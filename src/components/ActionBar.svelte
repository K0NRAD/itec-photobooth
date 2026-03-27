<script>
  /**
   * Start/Redo/Download/Flipbook action buttons.
   *
   * @prop {boolean} isRunning - Disables Start while a series is running
   * @prop {boolean} hasOutput - Enables Download/Flipbook when a result exists
   * @prop {() => void} onStart
   * @prop {() => void} onRedo
   * @prop {() => void} onDownload
   * @prop {() => void} onFlipbook
   * @prop {() => void} onSwitchCamera
   */
  let { isRunning, hasOutput, onStart, onRedo, onDownload, onFlipbook, onSwitchCamera } = $props();
</script>

<div class="row">
  <button class="primary" onclick={onStart} disabled={isRunning}>
    📸 Start
  </button>
  <button onclick={onRedo}>♻️ Neu</button>
</div>

<div class="row">
  <button onclick={onDownload} disabled={!hasOutput}>⬇️ Download JPG</button>
  <button onclick={onFlipbook} disabled={!hasOutput}>🎞️ Flipbook</button>
</div>

<style>
  .row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  button:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  button:disabled:active {
    transform: none;
  }
</style>
