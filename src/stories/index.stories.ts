import type { Meta, StoryObj } from "@storybook/html";
import { createFilterStory } from "./utils/createFilterStory";

const meta: Meta = {
  title: "MultiColorReplaceFilter",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const RedToGreenWebGL: Story = {
  render: () =>
    createFilterStory({
      originalColor: 0xff0000, // 赤色
      targetColor: 0x00ff00, // 緑色
      tolerance: 0.05,
      width: 400,
      height: 300,
      preference: "webgl",
    }),
  parameters: {
    docs: {
      description: {
        story: "赤い正方形を緑色に置換するフィルターのテスト (WebGL)",
      },
    },
  },
};

export const RedToGreenWebGPU: Story = {
  render: () =>
    createFilterStory({
      originalColor: 0xff0000, // 赤色
      targetColor: 0x00ff00, // 緑色
      tolerance: 0.05,
      width: 400,
      height: 300,
      preference: "webgpu",
    }),
  parameters: {
    docs: {
      description: {
        story: "赤い正方形を緑色に置換するフィルターのテスト (WebGPU)",
      },
    },
  },
};

export const RedToBlueWebGL: Story = {
  render: () =>
    createFilterStory({
      originalColor: 0xff0000, // 赤色
      targetColor: 0x0000ff, // 青色
      tolerance: 0.05,
      width: 400,
      height: 300,
      preference: "webgl",
    }),
  parameters: {
    docs: {
      description: {
        story: "赤い正方形を青色に置換するフィルターのテスト (WebGL)",
      },
    },
  },
};

export const RedToBlueWebGPU: Story = {
  render: () =>
    createFilterStory({
      originalColor: 0xff0000, // 赤色
      targetColor: 0x0000ff, // 青色
      tolerance: 0.05,
      width: 400,
      height: 300,
      preference: "webgpu",
    }),
  parameters: {
    docs: {
      description: {
        story: "赤い正方形を青色に置換するフィルターのテスト (WebGPU)",
      },
    },
  },
};

export const RedWithHighToleranceWebGL: Story = {
  render: () =>
    createFilterStory({
      originalColor: 0xff0000, // 赤色
      targetColor: 0x00ff00, // 緑色
      tolerance: 0.2, // 高い許容値
      width: 400,
      height: 300,
      preference: "webgl",
    }),
  parameters: {
    docs: {
      description: {
        story: "高い許容値での赤い正方形の色置換テスト (WebGL)",
      },
    },
  },
};

export const RedWithHighToleranceWebGPU: Story = {
  render: () =>
    createFilterStory({
      originalColor: 0xff0000, // 赤色
      targetColor: 0x00ff00, // 緑色
      tolerance: 0.2, // 高い許容値
      width: 400,
      height: 300,
      preference: "webgpu",
    }),
  parameters: {
    docs: {
      description: {
        story: "高い許容値での赤い正方形の色置換テスト (WebGPU)",
      },
    },
  },
};
