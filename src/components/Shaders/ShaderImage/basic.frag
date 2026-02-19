precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform sampler2D uTexture;

void main() {
  vec3 color = vec3(
    vUv.x,
    vUv.y,
    (sin(uTime) + 1.0) / 2.0
  );

  vec3 texture = texture2D(uTexture, vUv).rgb;
  gl_FragColor = vec4(color * texture, 1.0);
}
