# PixiJS Visual Regression Testing (VRT) 実装レポート

## 概要

PixiJSは、フィルターやレンダリング機能のテストのために独自のVisual Regression Testing (VRT) システムを実装しています。このシステムは、レンダリング結果のスナップショット画像を保存し、変更前後で比較することで視覚的な回帰を検出する仕組みです。

## VRTシステムの構成

### 1. ディレクトリ構造

```
tests/
├── visual/
│   ├── tester.ts           # VRTのコアロジック
│   ├── types.ts            # 型定義
│   ├── visuals.test.ts     # テスト実行ファイル
│   ├── scenes/             # テストシーン定義
│   │   ├── filters/        # フィルターテスト
│   │   ├── graphics/       # グラフィックステスト
│   │   └── ...
│   ├── snapshots/          # 基準画像保存
│   └── assets/             # テスト用アセット
└── utils/                  # テスト共通ユーティリティ
```

### 2. テストフレームワーク

- **Jest**: メインテストフレームワーク
- **@pixi/jest-electron**: Electron環境でのテスト実行
- **pixelmatch**: 画像比較ライブラリ
- **pngjs**: PNG画像処理

## VRTシステムの実装詳細

### 1. コア機能 (`tester.ts`)

**`renderTest`関数**がVRTの中心機能：

```typescript
export async function renderTest(
  id: string,
  createFunction: (scene: Container, renderer: Renderer) => Promise<void>,
  rendererType: RenderType,
  options?: Partial<RendererOptions>,
  pixelMatch = 100,
): Promise<number>;
```

**主要な処理フロー**：

1. **レンダラー準備**: WebGL1/WebGL2/WebGPUに対応
2. **シーン作成**: テスト関数でシーンを構築
3. **画像生成**: Canvas経由でスナップショット作成
4. **画像比較**: 既存の基準画像と比較
5. **差分検出**: pixelmatchで差異をピクセル単位で計算

### 2. スナップショット管理

**保存形式**:

- ファイル名: `{testId}-{rendererType}.png`
- 保存先: `tests/visual/snapshots/`
- 差分画像: `.pr_uploads/visual/` (CI環境)

**画像比較設定**:

- 閾値: `threshold: 0.2` (20%の色差を許容)
- 許容ピクセル数: デフォルト100ピクセル

### 3. テストシーン定義

各テストは`*.scene.ts`ファイルで定義：

```typescript
export const scene: TestScene = {
  it: "テストの説明",
  create: async (scene: Container, renderer: Renderer) => {
    // シーン構築ロジック
  },
  pixelMatch: 100, // 許容差分ピクセル数
  pixelMatchLocal: 100, // ローカル環境用設定
  renderers: {
    // 対象レンダラー
    webgl1: true,
    webgl2: true,
    webgpu: true,
  },
};
```

### 4. フィルター専用テスト設定

**フィルターテストの特徴**:

- 各フィルターが独立したシーンファイルを持つ
- 複数のレンダラーで自動テスト実行
- フィルター固有のパラメータ設定をサポート

**例**: Alpha Filter テスト

```typescript
const filter = new AlphaFilter({
  alpha: 0.5,
});
filterContainer.filters = filter;
```

## 実行環境とCI/CD統合

### 1. ローカル実行

```bash
# VRTテスト実行
npm run test:scene

# デバッグモード (ブラウザ表示)
npm run test:scene:debug

# HTTPサーバー起動 (アセット配信用)
npm run test:server
```

### 2. CI環境での動作

**GitHub Actions統合**:

- 自動スナップショット比較
- 差分画像の自動アップロード
- PRでの視覚的回帰検出

**アセット配信**:

- CI: GitHub Raw経由でアセット配信
- ローカル: HTTP サーバー (localhost:8080)

### 3. 環境別設定

```typescript
const pixelMatch = isCI
  ? (scene.data.pixelMatch ?? 100) // CI環境
  : (scene.data.pixelMatchLocal ?? 100); // ローカル環境
```

## @pixi/jest-electronによる実行環境

### Electronプロセスの起動タイミング

**Jest実行時のフロー**:

1. **Jest開始**: `jest.config.js`で`@pixi/jest-electron/runner`と`@pixi/jest-electron/environment`を指定

2. **Runner初期化**: `ElectronRunner`クラスがインスタンス化される

3. **テスト実行前**: `runTests()`メソッド内で`electronProc.initialWin()`が呼ばれる
   - **ここでElectronプロセスが起動**される
   - `spawn(electron, [entry])`でElectronアプリケーションを子プロセスとして起動
   - エントリーポイント: `src/electron/main/index.ts`

4. **テスト実行**: 各テストが`electronProc.runTest()`を通じてElectron内で実行される
   - テストコードはElectronのレンダラープロセス内で実行
   - 実際のWebGL/WebGPU環境でレンダリングテスト

5. **テスト終了**: デバッグモードでなければElectronプロセスを終了

### 実際のブラウザ環境での実行

**Electronが提供する環境**:

- 実際のChromiumブラウザ環境（JSDOM等のモックではない）
- 本物のWebGL/WebGPUコンテキスト
- Canvas API、DOM操作が完全に動作
- `document.createElement('canvas')`や`canvas.getContext('2d')`が実際に動作

**`tester.ts`での動作例**:

```typescript
// これらが実際のElectron（Chromium）内で実行される
const canvas = renderer.extract.canvas({...}) as HTMLCanvasElement;
const readableCanvas = document.createElement('canvas');
const context = readableCanvas.getContext('2d');
context.drawImage(canvas, 0, 0); // 実際のCanvas描画
const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
```

### デバッグモードの活用

**`DEBUG_MODE=1`設定時**:

- Electronウィンドウが表示される
- テスト結果のCanvasが`document.body.appendChild(canvas)`で実際に表示
- 視覚的にテスト結果を確認可能
- プロセス終了時にElectronウィンドウも自動的に閉じる

## まとめ

PixiJSのVRTシステムは以下の特徴を持つ：

1. **包括的なレンダラー対応**: WebGL1/2、WebGPU全てをテスト
2. **実際のブラウザ環境**: Electronで本物のChromium環境を提供
3. **自動化されたワークフロー**: Jest + Electronでの自動実行
4. **柔軟な比較設定**: テスト毎に許容差分を調整可能
5. **CI/CD統合**: GitHub Actionsでの自動回帰検出
6. **開発者フレンドリー**: デバッグモードでの視覚確認機能

**重要な技術的洞察**:

- JSMockやJSDOMではなく、実際のブラウザ環境でテスト実行
- これによりWebGL/WebGPUの完全な互換性を保証
- Canvas APIやDOM操作が実環境と同等に動作

このシステムを参考にすることで、pixi-filter-multi-color-replaceでも同様の堅牢なVRTを実装できます。

## このアイデアは廃棄

pixijs公式手法の最も重要なライブラリがhttps://github.com/pixijs/jest-electron
ところがこれはjest@27以降に非対応→ts-jestも26まで→typescript@4.9まで
メンテされてないのでこれに頼るべきではない！
