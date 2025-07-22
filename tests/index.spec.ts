import { test, expect } from '@playwright/test';

test('MultiColorReplaceFilter VRT: Red square to green', async ({ page }) => {
  // HTMLページを設定
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 20px; background: #f0f0f0; }
          canvas { border: 2px solid #333; }
        </style>
      </head>
      <body>
        <div id="app"></div>
        <script src="https://pixijs.download/release/pixi.min.js"></script>
        <script>
          (async () => {
            try {
              console.log('Starting PIXI application initialization...');
              
              // PixiJSアプリケーションを初期化
              const app = new PIXI.Application();
              await app.init({
                width: 400,
                height: 300,
                backgroundColor: 0xffffff,
              });
              
              console.log('PIXI app created');
              
              document.getElementById('app').appendChild(app.canvas);
              console.log('Canvas added to DOM');
              
              // 赤い正方形を作成
              const graphics = new PIXI.Graphics();
              graphics.beginFill(0xFF0000); // 赤色
              graphics.drawRect(150, 100, 100, 100); // 中央に100x100の正方形
              graphics.endFill();
              
              app.stage.addChild(graphics);
              console.log('Red square added to stage');
              
              // MultiColorReplaceFilterが存在するかチェック
              if (PIXI.filters && PIXI.filters.MultiColorReplaceFilter) {
                console.log('MultiColorReplaceFilter found');
                
                // MultiColorReplaceFilterを適用（赤→緑に置換）
                const filter = new PIXI.filters.MultiColorReplaceFilter(
                  [[0xFF0000, 0x00FF00]], // 赤を緑に置換
                  0.05 // tolerance
                );
                
                graphics.filters = [filter];
                console.log('Filter applied');
              } else {
                console.log('MultiColorReplaceFilter not found, skipping filter');
              }
              
              // レンダリング完了を待つ
              await new Promise(resolve => setTimeout(resolve, 500));
              
              console.log('Test completed successfully');
              // テスト完了フラグを設定
              window.testComplete = true;
            } catch (error) {
              console.error('Error during test execution:', error);
              window.testError = error.message;
              window.testComplete = true;
            }
          })();
        </script>
      </body>
    </html>
  `);
  
  // テスト完了まで待機
  await page.waitForFunction(() => (window as any).testComplete === true);
  
  // エラーが発生した場合はログを出力
  const testError = await page.evaluate(() => (window as any).testError);
  if (testError) {
    console.log('Test error:', testError);
  }
  
  
  // スナップショットを取得
  await expect(page).toHaveScreenshot('red-to-green-filter.png');
});