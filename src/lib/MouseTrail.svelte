<!-- src/lib/MouseTrail.svelte -->
<script>
    import { onMount } from 'svelte';
  
    onMount(() => {
      const container = document.querySelector('.trail-container');
  
      window.addEventListener('mousemove', (e) => {
        const pixel = document.createElement('div');
        pixel.className = 'trail-pixel';
        pixel.style.left = `${e.clientX}px`;
        pixel.style.top = `${e.clientY}px`;
        container.appendChild(pixel);
  
        setTimeout(() => pixel.remove(), 400);
      });
    });
  </script>
  
  <!-- Ini div tempat kotak-kotak muncul -->
  <div class="trail-container"></div>
  
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
      width: 8px;
      height: 8px;
      background: #000;
      opacity: 0.5;
      transform: translate(-50%, -50%);
      animation: fade 0.4s ease-out forwards;
    }
  
    @keyframes fade {
      0% {
        opacity: 0.5;
        transform: translate(-50%, -50%) scale(1);
      }
      100% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.6);
      }
    }
  </style>
  