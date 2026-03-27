<script>
  import ActionBar from "./ActionBar.svelte";
  import LayoutSettings from "./LayoutSettings.svelte";
  import SliderSettings from "./SliderSettings.svelte";
  import CaptionBar from "./CaptionBar.svelte";
  import StatusBar from "./StatusBar.svelte";

  /**
   * Composes all control sections into a single panel.
   *
   * @prop {boolean} isRunning
   * @prop {boolean} hasOutput
   * @prop {string} status
   * @prop {() => void} onStart
   * @prop {() => void} onRedo
   * @prop {() => void} onDownload
   * @prop {() => void} onFlipbook
   * @prop {() => void} onSwitchCamera
   */
  let {
    isRunning,
    hasOutput,
    status,
    onStart,
    onRedo,
    onDownload,
    onFlipbook,
    onSwitchCamera,
  } = $props();
</script>

<div class="controls">
  <ActionBar
    {isRunning}
    {hasOutput}
    {onStart}
    {onRedo}
    {onDownload}
    {onFlipbook}
  />
  <LayoutSettings {onSwitchCamera} />
  <SliderSettings />
  <CaptionBar />
  <StatusBar message={status} />
</div>

<style>
  .controls {
    display: grid;
    gap: 10px;
    padding-top: 10px;
  }
</style>
