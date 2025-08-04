<script>
    import { onMount } from 'svelte';
    let canvas;
    let ctx;
  
    onMount(() => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx = canvas.getContext('2d');
  
      const noise = () => {
        const imageData = ctx.createImageData(canvas.width, canvas.height);
        for (let i = 0; i < imageData.data.length; i += 4) {
          const val = Math.random() * 255;
          imageData.data[i] = val;
          imageData.data[i + 1] = val;
          imageData.data[i + 2] = val;
          imageData.data[i + 3] = 10; // opacity rendah
        }
        ctx.putImageData(imageData, 0, 0);
      };
  
      setInterval(noise, 60); // refresh setiap 60ms
    });
  </script>
  
  <canvas bind:this={canvas}></canvas>
  
  <style>
    canvas {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 1;
      mix-blend-mode: difference;
    }
  </style>
  