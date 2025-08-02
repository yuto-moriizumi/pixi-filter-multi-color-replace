import type { StorybookConfig } from "@storybook/html-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-docs"],
  framework: {
    name: "@storybook/html-vite",
    options: {},
  },
  viteFinal: async (config) => {
    // PixiJSとフィルターをバンドルに含める
    config.define = {
      ...config.define,
      global: "globalThis",
    };

    // PixiJSとフィルターを外部化しない
    if (config.build?.rollupOptions?.external) {
      const external = config.build.rollupOptions.external;
      if (Array.isArray(external)) {
        config.build.rollupOptions.external = external.filter(
          (dep) => dep !== "pixi.js" && dep !== "pixi-filters",
        );
      }
    }

    // GLSLファイル（.frag, .vert, .wgsl）を文字列として処理するプラグインを追加
    config.plugins = config.plugins || [];
    config.plugins.push({
      name: "glsl-loader",
      transform(code: string, id: string) {
        if (
          id.endsWith(".frag") ||
          id.endsWith(".vert") ||
          id.endsWith(".wgsl")
        ) {
          return `export default ${JSON.stringify(code)};`;
        }
      },
    });

    return config;
  },
};
export default config;
