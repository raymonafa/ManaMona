<!-- src/lib/MouseTrail.svelte -->
<script>
  import { onMount, onDestroy } from 'svelte';

  let container;
  const MAX_TRAILS = 30;
  const trailElements = [];

  let mouse = { x: 0, y: 0 };

  onMount(() => {
    const handleMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMove);

    const interval = setInterval(() => {
      const pixel = document.createElement('div');
      pixel.className = 'trail-pixel';
      pixel.style.left = `${mouse.x}px`;
      pixel.style.top = `${mouse.y}px`;

      container.appendChild(pixel);
      trailElements.push(pixel);

      if (trailElements.length > MAX_TRAILS) {
        const old = trailElements.shift();
        if (old && old.parentNode) old.remove();
      }

    }, 16); // ~60 FPS

    onDestroy(() => {
      window.removeEventListener('mousemove', handleMove);
      clearInterval(interval);
    });
  });
</script>

<div class="trail-container" bind:this={container}></div>

<style>
  .trail-container {
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
    width: 100%;
    height: 100%;
    z-index: 20;
  }

  .trail-pixel {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: black;
    opacity: 0;
    transform: translate(-50%, -50%) scale(1);
    animation: fadeTrail 0.6s ease-out forwards;
  }

  @keyframes fadeTrail {
    0% {
      opacity: 0.6;
      transform: translate(-50%, -50%) scale(1.2);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.5);
    }
  }
</style>
