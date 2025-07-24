import { test, expect, Page } from "@playwright/test";

async function waitForStoryCompletion(page: Page) {
  await page.waitForFunction(() => (window as any).testComplete === true, {
    timeout: 10000,
  });

  const testError = await page.evaluate(() => (window as any).testError);
  if (testError) {
    console.log("Test error:", testError);
  }
}

test.describe("MultiColorReplaceFilter VRT", () => {
  const testCases = [
    {
      name: "Red to Green",
      webglId: "multicolorreplacefilter--red-to-green-web-gl",
      webgpuId: "multicolorreplacefilter--red-to-green-web-gpu",
      screenshotPrefix: "red-to-green",
    },
    {
      name: "Red to Blue",
      webglId: "multicolorreplacefilter--red-to-blue-web-gl",
      webgpuId: "multicolorreplacefilter--red-to-blue-web-gpu",
      screenshotPrefix: "red-to-blue",
    },
    {
      name: "Red with High Tolerance",
      webglId: "multicolorreplacefilter--red-with-high-tolerance-web-gl",
      webgpuId: "multicolorreplacefilter--red-with-high-tolerance-web-gpu",
      screenshotPrefix: "red-high-tolerance",
    },
  ];

  for (const testCase of testCases) {
    test(`${testCase.name} (WebGL)`, async ({ page }) => {
      await page.goto(
        `/iframe.html?globals=&args=&id=${testCase.webglId}&viewMode=story`,
      );

      await waitForStoryCompletion(page);
      const canvas = page.locator('canvas');
      await expect(canvas).toHaveScreenshot(
        `${testCase.screenshotPrefix}-webgl-filter.png`,
      );
    });

    test(`${testCase.name} (WebGPU)`, async ({ page }) => {
      await page.goto(
        `/iframe.html?globals=&args=&id=${testCase.webgpuId}&viewMode=story`,
      );

      await waitForStoryCompletion(page);
      const canvas = page.locator('canvas');
      await expect(canvas).toHaveScreenshot(
        `${testCase.screenshotPrefix}-webgpu-filter.png`,
      );
    });
  }
});
