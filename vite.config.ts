import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig(() => ({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "MultiColorReplaceFilter",
      fileName: "index",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["pixi.js"],
      output: {
        exports: "named",
        globals: {
          "pixi.js": "PIXI",
        },
      },
    },
  },
  plugins: [
    dts({
      include: ["src/**/*"],
      exclude: ["src/**/*.stories.*", "src/stories/**/*"]
    }),
    {
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
    },
  ],
}));
