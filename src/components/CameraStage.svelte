<script>
  /**
   * Displays the live camera feed with countdown overlay and flash effect.
   *
   * @prop {HTMLVideoElement | null} videoRef - Bindable ref to the video element
   * @prop {string} facing - 'user' | 'environment'
   * @prop {boolean} mirrorOn - Whether to mirror the video horizontally
   * @prop {number} countdown - Current countdown value (0 = hidden)
   * @prop {boolean} isFlashing - Whether the flash overlay is active
   */
  let {
    videoRef = $bindable(null),
    facing,
    mirrorOn,
    countdown,
    isFlashing,
  } = $props();

  let shouldMirror = $derived(mirrorOn && facing === 'user');
</script>

<div class="stage">
  <video
    bind:this={videoRef}
    playsinline
    autoplay
    muted
    style:transform={shouldMirror ? 'scaleX(-1)' : 'none'}
  ></video>

  <div class="overlay">
    {#if countdown > 0}
      <div class="count">{countdown}</div>
    {/if}
  </div>

  <div class="flash" class:on={isFlashing}></div>
</div>

<style>
  .stage {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    background: #000;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  video {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    display: block;
  }

  .overlay {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    pointer-events: none;
  }

  .count {
    font-size: 92px;
    font-weight: 900;
    color: #ffd166;
    text-shadow: 0 12px 34px rgba(0, 0, 0, 0.85);
  }

  .flash {
    position: absolute;
    inset: 0;
    background: #fff;
    opacity: 0;
    transition: opacity 0.12s ease;
    pointer-events: none;
  }

  .flash.on {
    opacity: 0.85;
  }
</style>
