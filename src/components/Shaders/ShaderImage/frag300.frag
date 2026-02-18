#version 300 es
 
precision highp float;

#define varying in
#define texture2D texture
#define gl_FragColor FragColor

out vec4 FragColor;

uniform vec3 uColor;
uniform sampler2D tMap;
uniform float uWidth;
uniform float uDPR;
 
varying vec2 vUv;
 
void main() {
  vec3 color = texture2D(tMap, vUv).rgb;
  // color = vec3(vUv.x, 0.0, 0.0);
 
  gl_FragColor = vec4(color, 1.0);
  // gl_FragColor = vec4(uColor, 1.0);
}