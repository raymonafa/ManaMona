<script>
  import { onMount } from 'svelte';

  export let gridSize = 56;
  export let pixelSize = gridSize; // otomatis sama
  export let color = 'rgb(211, 251, 67)';
  export let trailInterval = 60;
  export let maxLifetime = 100;

  let canvas;
  let ctx;
  const particles = [];
  let lastTrailTime = 0;

  function offset() {
    return Math.random() * 2 - 1; // glitch kecil (±1px)
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
      const alpha = 1 - p.life / maxLifetime;

      ctx.fillStyle = color.replace('ALPHA', alpha.toFixed(2));
      ctx.fillRect(p.x - pixelSize / 2, p.y - pixelSize / 2, pixelSize, pixelSize);
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
