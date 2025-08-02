#version 300 es

precision highp float;

in vec2 vTextureCoord;
out vec4 finalColor;

uniform sampler2D uTexture;
uniform sampler2D uDisplacementMap;

void main(void)
{
    vec4 originalColor = texture(uTexture, vTextureCoord);
    ivec3 color = ivec3(originalColor.rgb * 255.0);
    int x = color.r + (color.b % 16) * 256;
    int y = color.g + (color.b / 16) * 256;
    finalColor = texelFetch(uDisplacementMap, ivec2(x, y), 0);
}