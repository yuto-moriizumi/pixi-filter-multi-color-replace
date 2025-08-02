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
      width: 256,
      height: 256,
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
      width: 256,
      height: 256,
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
      width: 256,
      height: 256,
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
      width: 256,
      height: 256,
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

export const GreenToBlueWebGL: Story = {
  render: () =>
    createFilterStory({
      originalColor: 0x00ff00, // 緑色
      targetColor: 0x0000ff, // 青色
      width: 256,
      height: 256,
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

export const GreenToBlueWebGPU: Story = {
  render: () =>
    createFilterStory({
      originalColor: 0x00ff00, // 緑色
      targetColor: 0x0000ff, // 青色
      width: 256,
      height: 256,
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

export const BlueToRedWebGL: Story = {
  render: () =>
    createFilterStory({
      originalColor: 0x0000ff, // 青色
      targetColor: 0xff0000, // 赤色
      width: 256,
      height: 256,
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

export const BlueToRedWebGPU: Story = {
  render: () =>
    createFilterStory({
      originalColor: 0x0000ff, // 青色
      targetColor: 0xff0000, // 赤色
      width: 256,
      height: 256,
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
