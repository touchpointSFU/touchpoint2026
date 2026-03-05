precision highp float;

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uDisplacement;
uniform vec2 uResolution;
#define MAX_METABLOBS 50
uniform vec3 uMetablobs[MAX_METABLOBS];
uniform float uSpeed;
uniform bool uMobile;

#include "lygia/math/const.glsl"
#include "lygia/generative/snoise.glsl"

varying vec2 vUv;

void main() {
    vec2 uv = vUv;
    vec2 center = vec2(0.5);
    float mult = 1.0;
    float timeBounce = (0.5 + sin(uTime - PI / 2.0) / 2.);
    vec2 ratio = vec2(uResolution.x / uResolution.y, 1.0);
    // vec2 ratio = vec2(1.0);
    uv *= ratio * mult;
    center *= ratio * mult;
    center += uMouse * ratio * mult;

    vec2 toMetablob[MAX_METABLOBS];
    vec2 movingCoord[MAX_METABLOBS];
    float valid = 0.0;
    // vec3 color[MAX_METABLOBS];
    vec3 colorFinal = vec3(1.0);

    for (int i = 0; i < MAX_METABLOBS; i++) {
        toMetablob[i] = (uMetablobs[i].xy) * ratio;
        movingCoord[i] = (center) + (normalize(toMetablob[i]) * uMetablobs[i].z * uSpeed * timeBounce);
        float dist = distance(movingCoord[i], uv);
        // 
        // dist = dist == 0.0 ? 1.0 : dist * (1.0 - step(uMetablobs[i].z, dist));
        valid += (1.0 / pow(dist / (uMetablobs[i].z * (uSpeed)), 2.0)) / (float(MAX_METABLOBS));
        // valid += (5.)*exp(-dist / 0.2) / float(MAX_METABLOBS);
        // float size = dist * uMetablobs[i].z;
        // valid += smoothstep(0.1 * uMetablobs[i].z, 0.0, dist);
    }
    valid = min(valid, 1.0);
    // colorFinal *=  distance(uv, vec2(0.5) * ratio * mult);


    //Get the gray value for noise based on current XY
    // float d3 = uMobile ? snoise(vec3(uv, uTime * 0.5))  + 0.1 : snoise(floor(uv * uResolution / pxSize) * pxSize);
    float d3 = snoise(vec3(uv - uDisplacement, sin(uTime) * 0.5 + 0.5));
    
    // float d3 = snoise(vec3(uv * 0.5, uTime * 0.5))  + 0.1;

    vec2 cellUV = fract(uv * 8.);
    vec3 color = vec3(d3 * 0.8 + 0.2);
    // vec3 color = vec3(1.0) * (distance(movingCoord[3], uv));
    // vec3 color = vec3(valid);
    // vec3 color = vec3(cellUV, 0.);
    // vec3 color = vec3(cellUV + vec2(valid), 0.); //+ (targetColor * cell50(cellUV) * validB) + (targetColor * cell75(cellUV) * validC) + validD * targetColor;
    // color *= d3;
    // gl_FragColor = vec4(vec3(uv.x / (mult * ratio.x)), 1.0);
    gl_FragColor = vec4(color, 1.0);
}