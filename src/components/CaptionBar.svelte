<script>
  import { settings } from '../lib/photoSettings.svelte.js';

  /**
   * Caption text input and date toggle button.
   * Reads and writes directly from/to the shared settings store.
   */
</script>

<div class="row">
  <input
    type="text"
    placeholder="Optionaler Text"
    bind:value={settings.caption}
  />
  <button onclick={() => (settings.dateOn = !settings.dateOn)}>
    📅 Datum: {settings.dateOn ? 'an' : 'aus'}
  </button>
</div>

<style>
  .row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
</style>
