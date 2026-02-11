import { useRef, useState, useCallback, useEffect } from 'react';
import { Button } from './Button';

interface CameraCaptureProps {
  /** Called with the captured image as a base-64 data URL */
  onCapture: (dataUrl: string) => void;
  /** Currently captured image (for preview) */
  capturedImage: string | null;
  /** Clear the captured image */
  onClear: () => void;
}

export function CameraCapture({
  onCapture,
  capturedImage,
  onClear,
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isCameraOn, setIsCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Explicitly play the video to ensure it starts
        try {
          await videoRef.current.play();
        } catch (playError) {
          console.error('Error playing video:', playError);
          throw new Error('Failed to play video stream');
        }
      }
      setIsCameraOn(true);
    } catch (err) {
      setCameraError(
        'Unable to access camera. Please allow camera permissions in your browser.',
      );
      console.error('Camera error:', err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
  }, []);

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    // Check if video is actually playing and has dimensions
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      setCameraError('Camera not ready. Please wait a moment and try again.');
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    onCapture(dataUrl);
    stopCamera();
  }, [onCapture, stopCamera]);

  const retake = () => {
    onClear();
    startCamera();
  };

  // Clean up the camera stream when the component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  /* ── Captured preview ── */
  if (capturedImage) {
    return (
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          ID Photo (captured)
        </label>
        <div className="relative w-full max-w-xs rounded-lg overflow-hidden border border-gray-200">
          <img
            src={capturedImage}
            alt="Captured ID"
            className="w-full h-auto"
          />
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={retake}>
            Retake
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              onClear();
              stopCamera();
            }}
          >
            Remove
          </Button>
        </div>
      </div>
    );
  }

  /* ── Camera view ── */
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">
        ID Photo (webcam)
      </label>

      {cameraError && (
        <p className="text-red-600 text-xs bg-red-50 rounded px-3 py-2">
          {cameraError}
        </p>
      )}

      {isCameraOn ? (
        <>
          <div className="relative w-full max-w-xs rounded-lg overflow-hidden border border-gray-200 bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-auto"
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" onClick={capturePhoto}>
              📸 Capture
            </Button>
            <Button type="button" variant="secondary" onClick={stopCamera}>
              Cancel
            </Button>
          </div>
        </>
      ) : (
        <Button
          type="button"
          variant="secondary"
          onClick={startCamera}
          className="w-fit"
        >
          📷 Open Camera
        </Button>
      )}

      {/* Hidden canvas used for snapshot */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
