# @volgakurvar/pixi-filter-multi-color-replace

[![npm version](https://badge.fury.io/js/@volgakurvar%2Fpixi-filter-multi-color-replace.svg)](https://badge.fury.io/js/@volgakurvar%2Fpixi-filter-multi-color-replace)
[![npm downloads](https://img.shields.io/npm/dm/@volgakurvar/pixi-filter-multi-color-replace.svg)](https://www.npmjs.com/package/@volgakurvar/pixi-filter-multi-color-replace)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

A high-performance multi-color replacement filter for PixiJS. Achieves fast processing through texture-based color replacement using color map textures.
This filter is blazing faster than original `pixi-filters/multi-color-replace` filter when replacement count is big.

## Features

- ✅ High-speed color replacement with color map textures
- ✅ PixiJS v8 support
- ✅ Full TypeScript support
- ✅ WebGL & WebGPU compatible
- ✅ Supports ~16 million color replacements with 4096x4096 color map

## Installation

```bash
npm install @volgakurvar/pixi-filter-multi-color-replace
```

## Usage

### Basic Usage

```typescript
import { Application, Sprite, Color } from "pixi.js";
import { MultiColorReplaceFilter } from "@volgakurvar/pixi-filter-multi-color-replace";

const app = new Application();
const sprite = Sprite.from("your-image.png");

// Replace red with blue
const filter = new MultiColorReplaceFilter({
  replacements: [
    [new Color(0xff0000), new Color(0x0000ff)], // [source color, target color]
  ],
});

sprite.filters = [filter];
app.stage.addChild(sprite);
```

### Multiple Color Replacement

```typescript
const filter = new MultiColorReplaceFilter({
  replacements: [
    [new Color(0xff0000), new Color(0x0000ff)], // red → blue
    [new Color(0x00ff00), new Color(0xffff00)], // green → yellow
    [new Color(0x0000ff), new Color(0xff0000)], // blue → red
  ],
});
```

## API

### MultiColorReplaceFilter

#### Constructor

```typescript
new MultiColorReplaceFilter(options: MultiColorReplaceFilterOptions)
```

#### Options

| Property       | Type                    | Description                     |
| -------------- | ----------------------- | ------------------------------- |
| `replacements` | `Array<[Color, Color]>` | Array of color pairs (required) |

#### Properties

| Property       | Type                                | Description                          |
| -------------- | ----------------------------------- | ------------------------------------ |
| `replacements` | `Array<[ColorSource, ColorSource]>` | Color replacement pairs (read/write) |

#### Methods

| Method      | Description                                                           |
| ----------- | --------------------------------------------------------------------- |
| `refresh()` | Call after directly modifying the replacements array to update filter |

### Color Type

Colors use PixiJS's `Color` class:

```typescript
import { Color } from "pixi.js";

// Create from hex
const red = new Color(0xff0000);

// Create from RGB values (0-255)
const blue = new Color([0, 0, 255]);

// Create from RGB values (0-1)
const green = new Color([0, 1, 0]);
```

## Technical Specifications

### Color Map Texture

This filter uses a 4096x4096 color map texture for color replacement:

- **Size**: 4096x4096 pixels
- **Encoding**: RGB values mapped to coordinates (R + G*256 + B*256\*256)
- **Grid Structure**: Organized as 16x16 blue channel grids

### Performance

- **Memory Usage**: ~67MB color map texture
- **Processing Speed**: O(1) color replacement through texture lookup
- **GPU Optimization**: High-speed rendering with WebGL/WebGPU support

## Browser Support

- Chrome 91+
- Firefox 89+
- Safari 14.1+
- Edge 91+

Browsers that support WebGL 2.0 or WebGPU are required.

## Demo

Open [example.html](./example.html) in your browser to see the demo.

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Development mode (watch)
npm run dev
```

## License

MIT License

## Related Packages

- [pixi.js](https://pixijs.com/) - PixiJS core
- [@pixi/filters](https://github.com/pixijs/filters) - Official PixiJS filters collection

## Contributing

Please report bugs and feature requests at [Issues](https://github.com/your-username/pixi-filter-multi-color-replace/issues).

## Acknowledgements

Great thanks to the January Desk for the inspiration https://youtu.be/tAU95loPiD8?si=Kmt9kXNlGiwVI5qm
