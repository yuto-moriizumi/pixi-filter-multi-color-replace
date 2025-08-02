import * as PIXI from "pixi.js";
import { MultiColorReplaceFilter } from "../../MultiColorReplaceFilter";

interface FilterStoryOptions {
  originalColor: number;
  targetColor: number;
  tolerance: number;
  width: number;
  height: number;
  preference: "webgl" | "webgpu";
}

declare global {
  interface Window {
    testComplete?: boolean;
    testError?: string;
  }
}

export function createFilterStory(options: FilterStoryOptions): HTMLElement {
  const { originalColor, targetColor, tolerance, width, height, preference } =
    options;

  const container = document.createElement("div");
  container.style.width = `${width}px`;
  container.style.height = `${height}px`;
  container.style.border = "2px solid #333";
  container.style.background = "#f0f0f0";

  // PixiJSアプリケーションを初期化
  const initPixi = async () => {
    try {
      console.log("Starting PIXI application initialization...");

      // PixiJSアプリケーションを初期化
      const app = new PIXI.Application();
      const initOptions: Partial<PIXI.ApplicationOptions> = {
        width,
        height,
        backgroundColor: 0xffffff,
        preference,
      };

      await app.init(initOptions);

      console.log("PIXI app created");

      container.appendChild(app.canvas);
      console.log("Canvas added to DOM");

      // 指定色の正方形を作成
      const graphics = new PIXI.Graphics();
      graphics.rect(width / 2 - 50, height / 2 - 50, 100, 100); // 中央に100x100の正方形
      graphics.fill(originalColor);

      app.stage.addChild(graphics);
      console.log(
        `Square with color 0x${originalColor.toString(16).toUpperCase()} added to stage`,
      );

      // pixi-filtersのMultiColorReplaceFilterを適用
      console.log("Applying pixi-filters MultiColorReplaceFilter");

      const filter = new MultiColorReplaceFilter(
        [[originalColor, targetColor]], // 色置換設定: [[元の色, 置換後の色]]
        tolerance, // 許容値
      );

      graphics.filters = [filter];
      console.log(
        `pixi-filters MultiColorReplaceFilter applied: 0x${originalColor.toString(16).toUpperCase()} → 0x${targetColor.toString(16).toUpperCase()}`,
      );

      // レンダリング完了を待つ
      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log("Filter story completed successfully");
      window.testComplete = true;
    } catch (error) {
      console.error("Error during filter story execution:", error);
      window.testError = (error as Error).message;
      window.testComplete = true;
    }
  };

  // 初期化を実行
  initPixi();

  return container;
}
