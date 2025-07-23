import { renderTest } from './tester';
import type { RenderType } from './types';

const isCI = process.env.CI === 'true';

// Supported renderer types
const rendererTypes: RenderType[] = ['webgl1', 'webgl2'];

// Import test scenes directly to avoid dynamic import issues
import { scene as alphaFilterScene } from './scenes/filters/alpha-filter.scene';

const testScenes = [
    { id: 'filters/alpha-filter', scene: alphaFilterScene }
];

describe('Visual Regression Tests', () => {
    test('should have test scenes available', () => {
        expect(testScenes.length).toBeGreaterThan(0);
    });

    // Generate tests for each scene and renderer combination
    describe.each(rendererTypes)('%s renderer', (rendererType: RenderType) => {
        testScenes.forEach(({ id, scene }) => {
            const testName = scene.it || `${id} visual test`;
            
            // Check if this renderer is enabled for this scene
            const rendererEnabled = scene.renderers?.[rendererType] ?? true;
            
            if (!rendererEnabled) {
                return;
            }

            const testFn = scene.skip ? test.skip : scene.only ? test.only : test;
            
            testFn(`${testName}`, async () => {
                const pixelMatch = isCI 
                    ? scene.pixelMatch ?? 100 
                    : scene.pixelMatchLocal ?? scene.pixelMatch ?? 100;

                const diffPixels = await renderTest(
                    id,
                    scene.create,
                    rendererType,
                    {
                        width: 200,
                        height: 200,
                        backgroundAlpha: 1,
                        backgroundColor: 0x000000,
                    },
                    pixelMatch
                );

                expect(diffPixels).toBeLessThanOrEqual(pixelMatch);
            }, 30000); // 30 second timeout for complex scenes
        });
    });
});