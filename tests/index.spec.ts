import { test, expect } from '@playwright/test';
import * as path from 'path';

test('MultiColorReplaceFilter VRT: Red square to green', async ({ page }) => {
  // HTMLファイルを読み込み
  await page.goto(`file://${path.resolve(__dirname, 'fixture', 'test-page.html')}`);
  
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