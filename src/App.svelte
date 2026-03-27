<script>
  import { onMount } from 'svelte';
  import { settings } from './lib/photoSettings.svelte.js';
  import { startCamera, stopCamera } from './lib/cameraService.js';
  import { captureFrame } from './lib/photoCapture.js';
  import { buildLayout } from './lib/layoutBuilder.js';
  import { exportFlipbook } from './lib/flipbookExporter.js';
  import CameraStage from './components/CameraStage.svelte';
  import ControlPanel from './components/ControlPanel.svelte';

  let videoRef = $state(null);
  let stream = $state(null);
  let facing = $state('user');
  let status = $state('Bereit.');
  let lastOutput = $state('');
  let lastFrames = $state([]);
  let isRunning = $state(false);
  let countdown = $state(0);
  let isFlashing = $state(false);

  let hasOutput = $derived(lastOutput !== '');
  let panelOpen = $state(false);

  // Sync stream to video element whenever either changes
  $effect(() => {
    if (videoRef && stream) {
      videoRef.srcObject = stream;
    }
  });

  onMount(async () => {
    await initCamera();
    return () => stopCamera(stream);
  });

  // ─── Camera ─────────────────────────────────────────────────────────────────

  async function initCamera() {
    try {
      stopCamera(stream);
      stream = await startCamera(facing);
      status = 'Bereit.';
    } catch {
      status = 'Kamera blockiert.';
    }
  }

  async function handleSwitchCamera() {
    facing = facing === 'user' ? 'environment' : 'user';
    status = 'Kamera wechseln…';
    await initCamera();
  }

  // ─── Photo series ────────────────────────────────────────────────────────────

  async function handleStart() {
    panelOpen = false;
    isRunning = true;
    status = 'Serie läuft…';

    const frames = [];
    for (let i = 0; i < settings.shots; i++) {
      if (settings.timer > 0) await runCountdown(settings.timer);
      triggerFlash();
      frames.push(captureFrame(videoRef, {
        filter: settings.filter,
        mirrorOn: settings.mirrorOn,
        facing,
      }));
      await sleep(250);
    }

    lastFrames = frames;
    isRunning = false;
    status = 'Render…';

    try {
      lastOutput = await buildLayout(frames, settings);
      status = 'Fertig.';
    } catch (error) {
      console.error(error);
      status = 'Render fehlgeschlagen.';
    }
  }

  async function runCountdown(seconds) {
    for (let i = seconds; i > 0; i--) {
      countdown = i;
      await sleep(700);
    }
    countdown = 0;
  }

  function triggerFlash() {
    isFlashing = true;
    setTimeout(() => { isFlashing = false; }, 120);
  }

  // ─── Output actions ──────────────────────────────────────────────────────────

  function handleRedo() {
    lastOutput = '';
    lastFrames = [];
    status = 'Bereit.';
  }

  function handleDownload() {
    if (!lastOutput) { status = 'Kein Ergebnis.'; return; }

    const anchor = document.createElement('a');
    anchor.href = lastOutput;
    anchor.download = `fotokasten_${settings.layout}_${settings.theme}_${settings.shape}.jpg`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    status = 'Download gestartet.';
  }

  async function handleFlipbook() {
    if (!lastFrames.length) { status = 'Erst eine Serie aufnehmen.'; return; }
    status = 'Flipbook…';
    try {
      const bytes = await exportFlipbook(lastFrames, settings.fps);
      status = `Fertig (${Math.round(bytes / 1024)} KB).`;
    } catch (error) {
      console.error(error);
      status = 'Flipbook fehlgeschlagen.';
    }
  }

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
</script>

<div class="app">
  <header class="top">
    <div>
      <div class="title">PHOTOBOOTH</div>
    </div>
  </header>

  <!-- padding-bottom leaves space for the toggle button that straddles the camera edge -->
  <div class="stage-container">
    <!-- overflow:hidden clips the panel when it slides below the camera -->
    <div class="camera-clip">
      <CameraStage
        bind:videoRef
        {facing}
        mirrorOn={settings.mirrorOn}
        {countdown}
        {isFlashing}
      />

      <div class="drawer" class:open={panelOpen}>
        <div class="drawer-inner">
          <ControlPanel
            {isRunning}
            {hasOutput}
            {status}
            onStart={handleStart}
            onRedo={handleRedo}
            onDownload={handleDownload}
            onFlipbook={handleFlipbook}
            onSwitchCamera={handleSwitchCamera}
          />
        </div>
      </div>
    </div>

    <button
      class="toggle-btn"
      class:open={panelOpen}
      onclick={() => (panelOpen = !panelOpen)}
      aria-label={panelOpen ? 'Einstellungen schließen' : 'Einstellungen öffnen'}
    >
      <span class="toggle-icon"></span>
    </button>
  </div>

  <footer class="footer">
    <span>itec – learn together grow together</span>
  </footer>
</div>

<style>
  .app {
    width: min(95vw, 900px);
    background: var(--color-surface);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 22px;
    padding: 14px;
    box-shadow: var(--shadow-card);
    backdrop-filter: blur(8px);
  }

  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 10px;
  }

  .title {
    font-weight: 850;
    letter-spacing: 0.2px;
  }


  /* ── Camera + sliding panel ── */

  /* Extra bottom padding holds space for the toggle button */
  .stage-container {
    position: relative;
    padding-bottom: 26px;
  }

  /* overflow:hidden clips the panel when translated below the camera edge */
  .camera-clip {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
  }

  /* Panel slides in/out with translateY; clipped by camera-clip */
  .drawer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    transform: translateY(100%);
    transition: transform 0.40s cubic-bezier(0.4, 0, 0.2, 1);
    background: rgba(11, 12, 16, 0.92);
    backdrop-filter: blur(18px);
    border-top: 1px solid rgba(255, 255, 255, 0.10);
  }

  .drawer.open {
    transform: translateY(0);
  }

  .drawer-inner {
    overflow: hidden;
    padding: 10px 14px 16px;
  }

  /* ── Round toggle button ── */

  .toggle-btn {
    position: absolute;
    bottom: 0;
    left: 50%;
    /* translateX centers the button; translateY keeps it half inside the camera */
    transform: translateX(-50%);
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: #ffd166;
    border: 3px solid rgba(11, 12, 16, 0.55);
    cursor: pointer;
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.50);
    transition: background 0.2s;
  }

  .toggle-btn:hover  { background: #ffe099; }
  .toggle-btn:active { transform: translateX(-50%) scale(0.93); }

  /* + icon built with ::before / ::after pseudo-elements */
  .toggle-icon {
    position: relative;
    width: 20px;
    height: 20px;
  }

  .toggle-icon::before,
  .toggle-icon::after {
    content: '';
    position: absolute;
    inset: 0;
    margin: auto;
    width: 18px;
    height: 2.5px;
    background: #1b1400;
    border-radius: 2px;
    transition: rotate 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* + = horizontal bar + vertical bar (rotated 90°) */
  .toggle-icon::before { rotate: 0deg; }
  .toggle-icon::after  { rotate: 90deg; }

  /* × = both bars rotated ±45° */
  .toggle-btn.open .toggle-icon::before { rotate:  45deg; }
  .toggle-btn.open .toggle-icon::after  { rotate: -45deg; }

  .footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
    font-size: 11px;
    color: var(--color-text-muted);
    opacity: 0.6;
  }
</style>
