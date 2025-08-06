<script>
  import { onMount } from 'svelte';

  export let gridSize = 80;
  export let pixelSize = gridSize;
  export let color = 'rgb(211, 251, 67)';
  export let trailInterval = 16; // lebih cepat (60fps)
  export let maxLifetime = 60; // frame life (60 frame ≈ 1 detik)

  let canvas;
  let ctx;
  const particles = [];
  let lastTrailTime = 0;

  function offset() {
    return Math.random() * 2 - 1;
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  onMount(() => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext('2d');

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - lastTrailTime > trailInterval) {
        lastTrailTime = now;

        const snappedX = Math.floor(e.clientX / gridSize) * gridSize + gridSize / 2;
        const snappedY = Math.floor(e.clientY / gridSize) * gridSize + gridSize / 2;

        particles.push({
          x: snappedX + offset(),
          y: snappedY + offset(),
          life: 0
        });
      }
    });

    animate();
  });

  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.life += 1;
      const t = p.life / maxLifetime;
      const alpha = easeOutCubic(1 - t);
      const scale = 1 - 0 * t; // dari scale 1 ke 0.6

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.scale(scale, scale);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.fillRect(-pixelSize / 2, -pixelSize / 2, pixelSize, pixelSize);
      ctx.restore();
    }

    while (particles.length > 0 && particles[0].life > maxLifetime) {
      particles.shift();
    }
  }
</script>

<canvas bind:this={canvas}></canvas>

<style>
  canvas {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    pointer-events: none;
    mix-blend-mode: difference;
  }
</style>
