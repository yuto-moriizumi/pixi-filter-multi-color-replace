# PixiJS MultiColorReplaceFilter

PixiJS用の高性能な多色置換フィルターです。[PixiJS Filters](https://github.com/pixijs/filters)の公式実装をベースにしたスタンドアロンパッケージです。

## 特徴

- ✅ 複数の色を同時に置換可能
- ✅ PixiJS v8対応
- ✅ TypeScript完全対応
- ✅ WebGL・WebGPU両対応
- ✅ 公式実装と完全互換

## インストール

```bash
npm install @volgakurvar/pixi-filter-multi-color-replace
```

## 使用方法

### 基本的な使用例

```typescript
import { Application, Sprite, Texture } from 'pixi.js';
import { MultiColorReplaceFilter } from '@volgakurvar/pixi-filter-multi-color-replace';

const app = new Application();
const sprite = Sprite.from('your-image.png');

// 赤色を青色に置換
const filter = new MultiColorReplaceFilter({
  replacements: [
    [0xFF0000, 0x0000FF] // [元の色, 置換後の色]
  ],
  tolerance: 0.05
});

sprite.filters = [filter];
app.stage.addChild(sprite);
```

### 複数色の同時置換

```typescript
const filter = new MultiColorReplaceFilter({
  replacements: [
    [0xFF0000, 0x0000FF], // 赤 → 青
    [0x00FF00, 0xFFFF00], // 緑 → 黄色
    [0x0000FF, 0xFF0000]  // 青 → 赤
  ],
  tolerance: 0.1
});
```

### RGB配列での色指定

```typescript
const filter = new MultiColorReplaceFilter({
  replacements: [
    [[1, 0, 0], [0, 0, 1]], // 赤 → 青 (RGB値は0-1)
    [[0, 1, 0], [1, 1, 0]]  // 緑 → 黄色
  ],
  tolerance: 0.05
});
```

## API

### MultiColorReplaceFilter

#### コンストラクタ

```typescript
new MultiColorReplaceFilter(options?: MultiColorReplaceFilterOptions)
```

#### オプション

| プロパティ | 型 | デフォルト | 説明 |
|-----------|-----|----------|-----|
| `replacements` | `Array<[ColorSource, ColorSource]>` | `[[0xff0000, 0x0000ff]]` | 置換する色のペア配列 |
| `tolerance` | `number` | `0.05` | 色マッチングの許容範囲（小さいほど厳密） |
| `maxColors` | `number` | `replacements.length` | 最大置換色数（コンパイル時に固定） |

#### プロパティ

| プロパティ | 型 | 説明 |
|-----------|-----|-----|
| `replacements` | `Array<[ColorSource, ColorSource]>` | 置換色ペア（読み書き可能） |
| `tolerance` | `number` | 許容範囲（読み書き可能） |
| `maxColors` | `number` | 最大色数（読み取り専用） |

#### メソッド

| メソッド | 説明 |
|---------|-----|
| `refresh()` | replacements配列を直接変更した後に呼び出してフィルターを更新 |

### ColorSource型

色は以下の形式で指定できます：

- `number`: `0xFF0000` (16進数)
- `number[]`: `[1, 0, 0]` (RGB配列、各値0-1)
- `Float32Array`: RGB値の配列

## パフォーマンス

- **色数が多い場合**: 現在の実装は線形検索を使用するため、色数が多いとパフォーマンスが低下する可能性があります
- **推奨**: 同時置換する色は10色以下に抑えることを推奨
- **最適化**: 頻繁に変更される場合は`maxColors`を適切に設定してください

## ブラウザ対応

- Chrome 91+
- Firefox 89+
- Safari 14.1+
- Edge 91+

WebGL 2.0またはWebGPUをサポートするブラウザが必要です。

## デモ

[example.html](./example.html)を開いてブラウザでデモを確認できます。

## 開発

```bash
# 依存関係のインストール
npm install

# ビルド
npm run build

# 開発モード（ウォッチ）
npm run dev
```

## ライセンス

MIT License

## 関連パッケージ

- [pixi.js](https://pixijs.com/) - PixiJS本体
- [@pixi/filters](https://github.com/pixijs/filters) - PixiJS公式フィルター集

## 貢献

バグ報告や機能要望は[Issues](https://github.com/your-username/pixi-filter-multi-color-replace/issues)でお願いします。