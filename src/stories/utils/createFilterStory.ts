import {
  Application,
  ApplicationOptions,
  Color,
  ColorSource,
  Graphics,
} from "pixi.js";
import { MultiColorReplaceFilter } from "../../MultiColorReplaceFilter";

interface FilterStoryOptions {
  originalColor: ColorSource;
  targetColor: ColorSource;
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
  const { originalColor, targetColor, width, height, preference } = options;

  const container = document.createElement("div");
  container.style.width = `${width}px`;
  container.style.height = `${height}px`;
  container.style.border = "2px solid #333";
  container.style.background = "#f0f0f0";

  // PixiJSアプリケーションを初期化
  const initPixi = async () => {
    try {
      // PixiJSアプリケーションを初期化
      const app = new Application();
      const initOptions: Partial<ApplicationOptions> = {
        width,
        height,
        backgroundColor: 0xffffff,
        preference,
      };

      await app.init(initOptions);
      container.appendChild(app.canvas);

      // 指定色の正方形を作成
      const graphics = new Graphics();
      graphics.rect(0, 0, width, height);
      graphics.fill(originalColor);

      app.stage.addChild(graphics);

      const filter = new MultiColorReplaceFilter({
        replacements: [[new Color(originalColor), new Color(targetColor)]],
      });
      graphics.filters = [filter];
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
