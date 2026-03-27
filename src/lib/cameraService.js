/**
 * Starts the camera and returns the MediaStream.
 * @param {'user' | 'environment'} facing - Which camera to use
 * @returns {Promise<MediaStream>}
 */
export async function startCamera(facing) {
  return navigator.mediaDevices.getUserMedia({
    video: { facingMode: facing },
    audio: false,
  });
}

/**
 * Stops all tracks of the given stream.
 * @param {MediaStream | null} stream
 */
export function stopCamera(stream) {
  stream?.getTracks().forEach(track => track.stop());
}
