<script>
    export let gridSize = 80;
    export let color = 'rgba(0, 0, 0, 1)'; // Bisa diganti jadi putih untuk dark mode
  </script>
  
  <div class="grid" />
  
  <style>
    .grid {
      position: fixed;
      inset: 0;
      z-index: -1; /* ⬅️ Di bawah semua layer */
      pointer-events: none;
  
      background-image:
        linear-gradient(to right, var(--grid-color) 1px, transparent 1px),
        linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px);
      background-size: var(--grid-size) var(--grid-size);
      background-repeat: repeat;
    }
  
    :global(:root) {
      --grid-size: 80px;
      --grid-color: rgba(3, 3, 3, 0.05)/* default grid color */
    }
  </style>
  