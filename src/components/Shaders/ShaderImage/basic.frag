precision highp float;
varying vec2 vUv;
uniform vec2 uResolution;
uniform float uTime;
uniform sampler2D uTexture;
uniform float uGridSize;
uniform float uProgress;

void main() {
  float progress = (0.5 + 0.5 * sin(uTime));
  vec3 color = vec3(
    fract(vUv.x * uResolution.x / uGridSize),
    fract(vUv.y * uResolution.y / uGridSize),
    (sin(uTime) + 1.0) / 2.0
  );

  vec3 texture = texture2D(uTexture, vUv).rgb;
  gl_FragColor = vec4(mix(color,texture,uProgress), 1.0);
}
