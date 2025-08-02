@group(0) @binding(1) var uTexture: texture_2d<f32>; 
@group(0) @binding(2) var uSampler: sampler;
@group(1) @binding(0) var uDisplacementMap: texture_2d<f32>;
@group(1) @binding(1) var uDisplacementSampler: sampler;

@fragment
fn mainFragment(
  @builtin(position) position: vec4<f32>,
  @location(0) uv : vec2<f32>
) -> @location(0) vec4<f32> {
  let originalColor: vec4<f32> = textureSample(uTexture, uSampler, uv);
  let color: vec3<i32> = vec3<i32>(originalColor.rgb * 255.0);
  let x: i32 = color.r + (color.b % 16) * 256;
  let y: i32 = color.g + i32(floor(f32(color.b) / 16.0)) * 256;
  let finalColor: vec4<f32> = textureLoad(uDisplacementMap, vec2<i32>(x, y), 0);
  // For debugging purposes, you can uncomment the line below to see ColorMap
  // let finalColor: vec4<f32> = textureSample(uDisplacementMap, uDisplacementSampler, uv);
  // 元テクスチャのRGBAがWebGPUだとBGRAと解釈されるため、bgraと取得して元に戻す
  return finalColor.bgra;
}