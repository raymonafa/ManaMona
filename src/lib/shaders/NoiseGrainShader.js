// src/lib/shaders/NoiseGrainShader.js

export const NoiseGrainShader = {
    uniforms: {
      tDiffuse: { value: null },
      time: { value: 0.0 },
      amount: { value: 0.01 } // Semakin besar, semakin kasar
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform float time;
      uniform float amount;
      varying vec2 vUv;
  
      float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
      }
  
      void main() {
        vec4 color = texture2D(tDiffuse, vUv);
        float noise = rand(vUv * time);
        color.rgb += (noise - 0.5) * amount;
        gl_FragColor = color;
      }
    `
  };
  