const FLIPBOOK_WIDTH = 960;
const FLIPBOOK_HEIGHT = 720;
const EXPORT_ROUNDS = 2;

const SUPPORTED_CODECS = [
  { mimeType: 'video/webm;codecs=vp9' },
  { mimeType: 'video/webm;codecs=vp8' },
  { mimeType: 'video/webm' },
];

/**
 * Exports captured frames as a looping WebM flipbook and triggers a download.
 *
 * @param {string[]} frames - JPEG data URLs
 * @param {number} fps - Playback frames per second
 * @returns {Promise<number>} File size in bytes
 */
export async function exportFlipbook(frames, fps) {
  if (frames.length < 2) throw new Error('Zu wenige Frames');

  const images = await loadImages(frames);
  const { canvas, ctx } = createOffscreenCanvas();
  const mediaStream = canvas.captureStream(fps);
  const chunks = [];

  const recorderOptions = SUPPORTED_CODECS.find(o => MediaRecorder.isTypeSupported(o.mimeType)) ?? {};
  const recorder = new MediaRecorder(mediaStream, recorderOptions);
  recorder.ondataavailable = event => {
    if (event.data?.size) chunks.push(event.data);
  };

  recorder.start(100);
  await renderFrames(ctx, images, fps, EXPORT_ROUNDS);
  recorder.stop();
  await waitForStop(recorder);

  const blob = new Blob(chunks, { type: recorder.mimeType || 'video/webm' });
  triggerDownload(blob, fps);

  return blob.size;
}

// ─── Internals ────────────────────────────────────────────────────────────────

function createOffscreenCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = FLIPBOOK_WIDTH;
  canvas.height = FLIPBOOK_HEIGHT;
  return { canvas, ctx: canvas.getContext('2d') };
}

async function renderFrames(ctx, images, fps, rounds) {
  const delay = Math.round(1000 / fps);
  const total = images.length * rounds;

  for (let i = 0; i < total; i++) {
    const img = images[i % images.length];
    ctx.clearRect(0, 0, FLIPBOOK_WIDTH, FLIPBOOK_HEIGHT);
    ctx.drawImage(img, 0, 0, FLIPBOOK_WIDTH, FLIPBOOK_HEIGHT);
    await sleep(delay);
  }
}

function waitForStop(recorder) {
  return new Promise(resolve => { recorder.onstop = resolve; });
}

function triggerDownload(blob, fps) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `flipbook_${fps}fps.webm`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function loadImages(dataUrls) {
  return Promise.all(
    dataUrls.map(src => {
      const img = new Image();
      img.src = src;
      return img.decode().then(() => img);
    })
  );
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
