import { Application, Container, Renderer } from 'pixi.js';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import * as fs from 'fs';
import * as path from 'path';
import type { RenderType, RendererOptions } from './types';

const isCI = process.env.CI === 'true';
const DEBUG_MODE = process.env.DEBUG_MODE === '1';

export async function renderTest(
    id: string,
    createFunction: (scene: Container, renderer: Renderer) => Promise<void>,
    rendererType: RenderType,
    options: Partial<RendererOptions> = {},
    pixelMatch = 100,
): Promise<number>
{
    const width = options.width ?? 200;
    const height = options.height ?? 200;
    
    // Create application with specified renderer
    const app = new Application();
    
    await app.init({
        width,
        height,
        backgroundAlpha: options.backgroundAlpha ?? 1,
        backgroundColor: options.backgroundColor ?? 0x000000,
        preference: rendererType === 'webgpu' ? 'webgpu' : 'webgl',
        powerPreference: 'high-performance',
    });

    const scene = new Container();
    app.stage.addChild(scene);

    try {
        // Execute the test scene creation
        await createFunction(scene, app.renderer);

        // Render the scene
        app.renderer.render({ container: app.stage });

        // Extract canvas from renderer
        const canvas = app.renderer.extract.canvas({ 
            target: app.stage,
            resolution: 1,
        }) as HTMLCanvasElement;

        // Convert to readable format
        const readableCanvas = document.createElement('canvas');
        readableCanvas.width = canvas.width;
        readableCanvas.height = canvas.height;
        const context = readableCanvas.getContext('2d')!;
        context.drawImage(canvas, 0, 0);

        if (DEBUG_MODE) {
            document.body.appendChild(canvas);
        }

        // Get image data
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        
        // Create PNG from image data
        const png = new PNG({ width: canvas.width, height: canvas.height });
        png.data = Buffer.from(imageData.data);

        const snapshotPath = path.join(__dirname, 'snapshots', `${id}-${rendererType}.png`);
        const snapshotDir = path.dirname(snapshotPath);

        // Ensure snapshots directory exists
        if (!fs.existsSync(snapshotDir)) {
            fs.mkdirSync(snapshotDir, { recursive: true });
        }

        let diffPixels = 0;

        if (fs.existsSync(snapshotPath)) {
            // Compare with existing snapshot
            const existingPng = PNG.sync.read(fs.readFileSync(snapshotPath));
            
            if (existingPng.width !== png.width || existingPng.height !== png.height) {
                throw new Error(`Image dimensions don't match for ${id}: expected ${existingPng.width}x${existingPng.height}, got ${png.width}x${png.height}`);
            }

            const diff = new PNG({ width: png.width, height: png.height });
            
            diffPixels = pixelmatch(
                existingPng.data,
                png.data,
                diff.data,
                png.width,
                png.height,
                { threshold: 0.2 }
            );

            if (diffPixels > pixelMatch) {
                // Save diff image for inspection
                const diffPath = path.join(__dirname, 'snapshots', `${id}-${rendererType}-diff.png`);
                fs.writeFileSync(diffPath, PNG.sync.write(diff));
                
                // Save actual result for comparison
                const actualPath = path.join(__dirname, 'snapshots', `${id}-${rendererType}-actual.png`);
                fs.writeFileSync(actualPath, PNG.sync.write(png));
                
                throw new Error(
                    `Visual regression detected for ${id}: ${diffPixels} pixels differ (threshold: ${pixelMatch})`
                );
            }
        } else {
            // Save new baseline
            fs.writeFileSync(snapshotPath, PNG.sync.write(png));
            console.log(`Created baseline snapshot: ${snapshotPath}`);
        }

        return diffPixels;
    } finally {
        app.destroy(true, true);
    }
}