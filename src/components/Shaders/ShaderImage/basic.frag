precision highp float;
varying vec2 vUv;
uniform float uDPR;
uniform vec2 uResolution;
uniform float uTime;
uniform sampler2D uTexture;
uniform float uGridSize;
uniform float uProgress;
uniform vec3 uBackground;

#include "lygia/generative/snoise.glsl"

void main() {
  float bounds = 4.0;
  vec2 gridBounds = floor(uResolution / uGridSize);
  float sProgress = (uProgress * (gridBounds.y + 2.0 + 2. * bounds)) - (bounds + 1.0);
  vec2 gridCoords = floor(vec2(vUv.x * uResolution.x / uGridSize, (1.0 - vUv.y) * uResolution.y / uGridSize));

  vec3 color = vec3(
    snoise(gridCoords + vec2(uProgress))
  );

  vec3 texture = texture2D(uTexture, vUv).rgb;
  // texture *= step(gridCoords.y - bounds, bufferedProgress);
  vec3 textureA = color;
  textureA *= step(length(gridCoords.y - sProgress), bounds);

  vec3 textureB = vec3(1.) * 1.0 - step(sProgress - bounds, gridCoords.y);
  vec3 textureC = vec3(1.) - (textureA + textureB);
  // vec3 textureB = vec3(1. - step(sProgress - 1., gridCoords.y));
  // textureB *= texture;

  // texture.rgb *= step((1.0 - uProgress) * ((uResolution.y / uGridSize)), (uResolution.y / uGridSize) -  gridCoords.y);
  // color.rgb *= step((uProgress) * ((uResolution.y / uGridSize)), gridCoords.y);
  
  // vec3 transition = mix(vec3(0.), textureA, uProgress);
  // vec3 transition2 = mix(vec3(0.), texture, uProgress);

  gl_FragColor = vec4((textureA + textureB) * texture + textureC * uBackground, 1.0);
  // gl_FragColor = vec4(((textureC) * uBackground) + (textureA + textureB) * texture, 1.0);
}
