import type { TestRunnerConfig } from '@storybook/test-runner';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

const config: TestRunnerConfig = {
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },
  async postVisit(page, context) {
    // Wait for Storybook to complete rendering
    await page.waitForFunction(() => (window as any).testComplete === true, {
      timeout: 10000,
    });

    const testError = await page.evaluate(() => (window as any).testError);
    if (testError) {
      console.log("Test error:", testError);
      throw new Error(testError);
    }

    // Take screenshot of the canvas element with story-specific filename
    const canvas = page.locator('canvas');
    if (await canvas.count() > 0) {
      const storyName = context.name.toLowerCase().replace(/\s+/g, '-');
      const image = await canvas.screenshot();
      expect(image).toMatchImageSnapshot({
        customSnapshotIdentifier: storyName,
      });
    }
  },
};

export default config;