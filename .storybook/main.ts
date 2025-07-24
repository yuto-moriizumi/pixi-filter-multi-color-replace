import type { StorybookConfig } from '@storybook/html-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-docs"
  ],
  "framework": {
    "name": "@storybook/html-vite",
    "options": {}
  },
  "staticDirs": ["../dist"],
  viteFinal: async (config) => {
    // PixiJSとフィルターをバンドルに含める
    config.define = {
      ...config.define,
      global: 'globalThis',
    };

    // PixiJSとフィルターを外部化しない
    if (config.build?.rollupOptions?.external) {
      const external = config.build.rollupOptions.external;
      if (Array.isArray(external)) {
        config.build.rollupOptions.external = external.filter(
          (dep) => dep !== 'pixi.js' && dep !== 'pixi-filters'
        );
      }
    }

    return config;
  }
};
export default config;