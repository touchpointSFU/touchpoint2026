precision highp float;

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform float uSpeed;
uniform bool uMobile;
uniform sampler2D uTexture;

#include "lygia/math/const.glsl"
#include "lygia/generative/snoise.glsl"

varying vec2 vUv;

void main() {

    vec2 uv = vUv;
    vec2 ratio = vec2(uResolution.x / uResolution.y, 1.0);
    // vec2 ratio = vec2(1.0);
    uv *= ratio;
    uv *= 10.;
    //Get the gray value for noise based on current XY
    float d3 = uMobile ? snoise(vec3(uv * 0.5, uTime * 0.5))  + 0.1 : snoise(vec3(uv, uTime)) * 0.4 + 0.6;
    // float d3 = snoise(vec3(uv * 0.5, uTime * 0.5))  + 0.1;

    vec2 cellUV = fract(uv * 8.);
    float img = texture2D(uTexture, vUv).r;

    gl_FragColor = vec4(vec3(img * d3), 1.0);
    
    // vec3 color = vec3(cellUV, 0.);
    // vec3 color = vec3(cellUV + vec2(valid), 0.); //+ (targetColor * cell50(cellUV) * validB) + (targetColor * cell75(cellUV) * validC) + validD * targetColor;
    // color *= d2;
    // gl_FragColor = vec4(vec3(uv.x / (mult * ratio.x)), 1.0);
    // gl_FragColor = vec4(img, 1.0);
}