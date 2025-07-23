import type { Container, Renderer } from 'pixi.js';

export type RenderType = 'webgl1' | 'webgl2' | 'webgpu';

export interface TestScene
{
    it: string;
    skip?: boolean;
    only?: boolean;
    create: (scene: Container, renderer: Renderer) => Promise<void>;
    pixelMatch?: number;
    pixelMatchLocal?: number;
    renderers?: Partial<Record<RenderType, boolean>>;
}

export interface RendererOptions
{
    width?: number;
    height?: number;
    backgroundAlpha?: number;
    backgroundColor?: number;
}