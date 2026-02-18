#extension GL_OES_standard_derivatives : enable
 
precision highp float;
 
uniform vec3 uColor;
uniform sampler2D tMap;
 
varying vec2 vUv;
 
void main() {
  vec3 color = texture2D(tMap, vUv).rgb;

 
  gl_FragColor = vec4(color, 1.0);
  // gl_FragColor = vec4(uColor, 1.0);
}