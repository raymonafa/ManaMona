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
  let currentModel;
  let scene, camera, renderer, composer;

  const modelPath = '/models/modelB.glb'; // Hanya satu model

  function loadModel(path) {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      loader.load(
        path,
        (gltf) => {
          const model = gltf.scene;
          model.scale.set(0.25, 0.25, 0.25);
          model.position.set(0, 0, 0);
          model.traverse((child) => {
            if (child.isMesh) child.userData.interactive = true;
          });
          resolve(model);
        },
        undefined,
        reject
      );
    });
  }

  onMount(async () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 2;

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);

    // Light dari arah kamera
    const directional = new THREE.DirectionalLight(0xffffff, 1);
    directional.position.copy(camera.position);
    scene.add(directional);
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    // Load model tunggal
    currentModel = await loadModel(modelPath);
    scene.add(currentModel);

    // Postprocessing
    composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const pixelPass = new ShaderPass(PixelShader);
    pixelPass.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
    pixelPass.enabled = false;
    composer.addPass(pixelPass);

    const rgbShiftPass = new ShaderPass(RGBShiftShader);
    rgbShiftPass.uniforms.amount.value = 0.0015;
    rgbShiftPass.enabled = false;
    composer.addPass(rgbShiftPass);

    const grainPass = new ShaderPass(NoiseGrainShader);
    grainPass.uniforms.amount.value = 0.04;
    composer.addPass(grainPass);

    // Mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    window.addEventListener('mousemove', (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      if (currentModel) {
        gsap.to(currentModel.rotation, {
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

    // 2D Text rotation
    const text = document.querySelector('.hero-text');
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      text.style.transform = `translate(-50%, -50%) rotateX(${y * 10}deg) rotateY(${x * 10}deg)`;
    });

    // Animate
    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (currentModel) {
        currentModel.position.y = -0.9 + Math.sin(elapsed * 2) * 0.01;
      }

      grainPass.uniforms.time.value = elapsed;
      composer.render();
    }

    animate();

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

<!-- <div class="hero-text">TECH CRAFTER</div> -->

<style>
  canvas {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    display: block;
    z-index: 1;
  }

  .hero-text {
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 10vw;
    transform: translate(-50%, -50%);
    color: #000;
    opacity: 0.08;
    pointer-events: none;
    z-index: -1;
    text-align: center;

    transform-style: preserve-3d;
    will-change: transform;
  }
</style>
