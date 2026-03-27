<script>
  import { settings } from '../lib/photoSettings.svelte.js';

  /**
   * Selection controls for layout, theme, background, filter, shape and mirror.
   * Reads and writes directly from/to the shared settings store.
   *
   * @prop {() => void} onSwitchCamera
   */
  let { onSwitchCamera } = $props();

  let isThemeActive = $derived(settings.theme !== 'off');
</script>

<div class="row row3">
  <select bind:value={settings.layout}>
    <option value="strip">Layout: Strip</option>
    <option value="grid">Layout: Grid</option>
    <option value="polaroid">Layout: Polaroid</option>
  </select>

  <select bind:value={settings.theme}>
    <option value="off">Theme: aus</option>
    <option value="hearts">Theme: ❤️ Hearts</option>
    <option value="autumn">Theme: 🍂 Autumn</option>
    <option value="spring">Theme: 🌱 Spring</option>
    <option value="summer">Theme: ☀️ Summer</option>
    <option value="winter">Theme: ❄️ Winter</option>
    <option value="sketch">Theme: ✍️ Sketch</option>
  </select>

  <select bind:value={settings.bg}>
    <option value="paper">BG: Paper</option>
    <option value="solid">BG: Solid</option>
    <option value="gradient">BG: Gradient</option>
    <option value="pattern">BG: Pattern</option>
  </select>
</div>

<div class="row row3">
  <select bind:value={settings.filter}>
    <option value="none">Filter: Normal</option>
    <option value="bw">Filter: B&W</option>
    <option value="vintage">Filter: Vintage</option>
    <option value="warm">Filter: Warm</option>
    <option value="contrast">Filter: Contrast</option>
  </select>

  <select bind:value={settings.shape}>
    <option value="rounded">Shape: Rounded</option>
    <option value="rect">Shape: Rect</option>
    <option value="circle">Shape: Circle</option>
    <option value="heart">Shape: Heart</option>
    <option value="triangle">Shape: Triangle</option>
    <option value="hex">Shape: Hex</option>
    <option value="ticket">Shape: Ticket</option>
    <option value="mix">Shape: Mix</option>
  </select>

  <button
    onclick={() => (settings.mirrorOn = !settings.mirrorOn)}
  >
    🪞 Mirror: {settings.mirrorOn ? 'an' : 'aus'}
  </button>
</div>

<div class="row">
  <button onclick={onSwitchCamera}>🔁 Kamera wechseln</button>
</div>

<style>
  .row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .row3 {
    grid-template-columns: 1.2fr 1fr 1fr;
  }
</style>
