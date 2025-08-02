import {
  Color,
  ColorSource,
  Filter,
  GlProgram,
  GpuProgram,
  PointData,
  Texture,
  TextureStyle,
} from "pixi.js";
import { vertex, wgslVertex } from "pixi-filters";
import fragment from "./multi-color-replace.frag";
import source from "./multi-color-replace.wgsl";

const COLOR_MAP_WIDTH = 4096;
const COLOR_MAP_HEIGHT = 4096;

/** Options for the MultiColorReplaceFilter constructor. */
export interface MultiColorReplaceFilterOptions {
  /**
   * The collection of replacement items. Each item is color-pair
   * (an array length is 2). In the pair, the first value is original color , the second value is target color
   *
   * _If you wish to change individual elements on the replacement array after instantiation,
   * use the `refresh` function to update the uniforms once you've made the changes_
   */
  replacements: Array<[Color, Color]>;
}

/**
 * Filter for replacing a color with another color.
 * Similar to pixi-filters/MultiColorReplaceFilter, but faster for large number of replacements.
 */
export class MultiColorReplaceFilter extends Filter {
  private readonly colorMap: Uint8Array;
  private readonly _replacements: Array<[Color, Color]> = [];
  public readonly uniforms: {
    uDisplacementMap: Texture;
    uDisplacementSampler: TextureStyle;
  };

  /**
   * @param options - Options for the MultiColorReplaceFilter constructor.
   */
  constructor(options: MultiColorReplaceFilterOptions) {
    const gpuProgram = GpuProgram.from({
      vertex: {
        source: wgslVertex,
        entryPoint: "mainVertex",
      },
      fragment: {
        source: source,
        entryPoint: "mainFragment",
      },
    });

    const glProgram = GlProgram.from({
      vertex,
      fragment: fragment,
      name: "multi-color-replace-filter",
    });

    /**
     * 置換前の色と置換後の色を格納するテクスチャ。
     * インデックスは次のようにエンコードされる
     * R + G*256 + B*256*256
     * 4096x4096のテクスチャを使用し、各ピクセルが置換後の色を表す。
     * 大きく16x16のグリッドに分割され、各グリッドは左上から順に各青色に対応する。
     * たとえば一番左上のグリッドは青色0で、その中で横軸が赤色、縦軸が緑色を表す。
     * 一番右上のグリッドは青色15で、その中で横軸が赤色、縦軸が緑色を表す。
     */
    const length = 4 * COLOR_MAP_WIDTH * COLOR_MAP_HEIGHT;
    const array = new Uint8Array(length);
    for (let y = 0; y < COLOR_MAP_HEIGHT; y++) {
      for (let x = 0; x < COLOR_MAP_WIDTH; x++) {
        const [r, g, b, a] = pointToIndex({ x, y });
        array[r] = x % 256;
        array[g] = y % 256;
        array[b] = Math.floor(x / 256) + Math.floor(y / 256) * 16;
        array[a] = 255; // Alpha channel
      }
    }
    // テクスチャのサイズは、GPUの制限に合わせて調整する必要がある。
    // 手元で試したときは一辺16384(128*128)が最大だった。
    const texture = getColorMap(array);

    super({
      gpuProgram,
      glProgram,
      resources: {
        uDisplacementMap: texture.source,
        uDisplacementSampler: texture.source.style,
      },
    });
    this.colorMap = array;
    this.uniforms = {
      uDisplacementMap: texture,
      uDisplacementSampler: texture.source.style,
    };
    this.replacements = options.replacements;
  }

  /**
   * The collection of replacement items. Each item is color-pair
   * (an array length is 2). In the pair, the first value is original color , the second value is target color
   */
  set replacements(replacements: [Color, Color][]) {
    replacements.forEach(([source, target]) => {
      const sourceXY = colorToPoint(source);
      const sourceIndices = pointToIndex(sourceXY);
      const [r, g, b] = target.toUint8RgbArray();
      this.colorMap[sourceIndices[0]] = r;
      this.colorMap[sourceIndices[1]] = g;
      this.colorMap[sourceIndices[2]] = b;
      this.colorMap[sourceIndices[3]] = 255;
    });

    this.uniforms.uDisplacementMap = getColorMap(this.colorMap);
    this.uniforms.uDisplacementSampler =
      this.uniforms.uDisplacementMap.source.style;
  }

  get replacements(): Array<[ColorSource, ColorSource]> {
    return this._replacements;
  }

  /**
   * Should be called after changing any of the contents of the replacements.
   * This is a convenience method for resetting the `replacements`.
   * @todo implement nested proxy to remove the need for this function
   */
  refresh(): void {
    this.replacements = this._replacements;
  }
}

/** Convert RGB color to ColorMap coordinates */
function colorToPoint(color: Color): PointData {
  const [r, g, b] = color.toUint8RgbArray();
  const x = r + (b % 16) * 256;
  const y = g + Math.floor(b / 16) * 256;
  return { x, y };
}

/** Convert Point to ColorMap array index */
function pointToIndex(
  point: PointData,
): [r: number, g: number, b: number, a: number] {
  const r = (point.y * COLOR_MAP_WIDTH + point.x) * 4;
  return [r, r + 1, r + 2, r + 3];
}

function getColorMap(array: Uint8Array) {
  return Texture.from({
    resource: array,
    width: COLOR_MAP_WIDTH,
    height: COLOR_MAP_HEIGHT,
    format: "bgra8unorm",
  });
}
