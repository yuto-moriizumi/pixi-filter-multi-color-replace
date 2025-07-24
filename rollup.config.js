const typescript = require("@rollup/plugin-typescript");

function glslPlugin() {
  return {
    name: "glsl",
    transform(code, id) {
      if (id.endsWith(".frag") || id.endsWith(".vert") || id.endsWith(".wgsl")) {
        return `export default ${JSON.stringify(code)};`;
      }
    },
  };
}

module.exports = {
  input: "src/index.ts",
  external: ["pixi.js"],
  plugins: [
    glslPlugin(),
    typescript({
      tsconfig: "./tsconfig.json",
    }),
  ],
  output: [
    {
      file: "dist/index.js",
      format: "cjs",
      exports: "named",
    },
    {
      file: "dist/index.mjs",
      format: "es",
      exports: "named",
    },
    {
      file: "dist/index.umd.js",
      format: "umd",
      name: "MultiColorReplaceFilter",
      globals: {
        "pixi.js": "PIXI"
      },
      exports: "named",
    },
  ],
};