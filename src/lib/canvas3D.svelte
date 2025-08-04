<script>
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
  import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
  import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
  import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';

  import { PixelShader } from '$lib/shaders/PixelShader.js';
  import { RGBShiftShader } from '$lib/shaders/RGBShiftShader.js';
  import { NoiseGrainShader } from '$lib/shaders/NoiseGrainShader.js';

  import gsap from 'gsap';

  let canvas;
  let model;

  onMount(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0xe7e7e7, 0.1); // Background color

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(ambientLight, pointLight);

    // Load model
    const loader = new GLTFLoader();
    loader.load(
      '/models/model.glb',
      (gltf) => {
        model = gltf.scene;
        model.scale.set(0.35, 0.35, 0.35);
        model.position.set(0, 0, 0);
        model.traverse((child) => {
          if (child.isMesh) child.userData.interactive = true;
        });
        scene.add(model);
      },
      undefined,
      (error) => console.error('Error loading model:', error)
    );

    // === Postprocessing ===
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // Pixel Shader
    const pixelPass = new ShaderPass(PixelShader);
    pixelPass.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
    pixelPass.enabled = false;
    composer.addPass(pixelPass);

    // RGB Shift Shader
    const rgbShiftPass = new ShaderPass(RGBShiftShader);
    rgbShiftPass.uniforms.amount.value = 0.0015;
    rgbShiftPass.enabled = false;
    composer.addPass(rgbShiftPass);

    // Noise / Grain Shader (always on)
    const grainPass = new ShaderPass(NoiseGrainShader);
    grainPass.uniforms.amount.value = 0.04;
    composer.addPass(grainPass);

    // Mouse interaksi
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    window.addEventListener('mousemove', (event) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      mouse.x = (event.clientX / w) * 2 - 1;
      mouse.y = -(event.clientY / h) * 2 + 1;

      if (model) {
        gsap.to(model.rotation, {
          y: mouse.x * 0.8,
          x: mouse.y * 0.1,
          duration: 1.6,
          ease: 'power2.out',
        });

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);
        const hovering = intersects.some(obj => obj.object.userData.interactive);

        pixelPass.enabled = hovering;
        rgbShiftPass.enabled = hovering;
      }
    });

    // Animate
    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (model) {
        model.position.y = -0.9 + Math.sin(elapsed * 2) * 0.01;
      }

      grainPass.uniforms.time.value = elapsed;
      composer.render();
    }

    animate();

    // Resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);

      pixelPass.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
    });
  });
</script>

<canvas bind:this={canvas}></canvas>

<style>
  canvas {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    display: block;
    z-index: 0;
  }
</style>
