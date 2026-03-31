import { useRef, useState, useCallback, useEffect } from "react";

// Figma asset URLs (valid 7 days from generation)
const imgWidgetFilled = "https://www.figma.com/api/mcp/asset/2e21e8bf-af1f-4e8c-960a-8d6283b451b0";
const imgChevronRightFill = "https://www.figma.com/api/mcp/asset/254fc303-0bef-47a8-a62c-8a69803398eb";
const imgFlip = "https://www.figma.com/api/mcp/asset/39075aed-0e72-4058-9d6a-f2b80bc949b0";
const imgFlashSlash = "https://www.figma.com/api/mcp/asset/309309a2-bf80-4230-bac3-6349ae387ec6";

type StoryCapturePageProps = {
  onClose: () => void;
  onPhotoCaptured: (dataUrl: string) => void;
};

type CaptureMode = "Instant" | "Normal";

export default function StoryCapturePage({
  onClose: _onClose,
  onPhotoCaptured,
}: StoryCapturePageProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [cameraReady, setCameraReady] = useState(false);
  const [captureMode, setCaptureMode] = useState<CaptureMode>("Instant");

  const startCamera = useCallback(async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1080 }, height: { ideal: 1080 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraReady(true);
      }
    } catch {
      setCameraReady(false);
    }
  }, [facingMode]);

  useEffect(() => {
    startCamera();
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [startCamera]);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const size = Math.min(video.videoWidth, video.videoHeight);
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const xOff = (video.videoWidth - size) / 2;
    const yOff = (video.videoHeight - size) / 2;
    if (facingMode === "user") {
      ctx.translate(size, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, xOff, yOff, size, size, 0, 0, size, size);
    onPhotoCaptured(canvas.toDataURL("image/jpeg", 0.92));
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") onPhotoCaptured(reader.result);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div
      className="absolute inset-0 flex flex-col"
      style={{ backgroundColor: "#000" }}
    >
      {/* ── Top bar: "Add widget" pill (centre) + side icons (right) ── */}
      <div className="relative flex-none flex items-center justify-center px-4 pt-3 pb-2" style={{ height: 56 }}>
        {/* Add widget pill */}
        <button
          type="button"
          aria-label="Add widget"
          className="flex items-center"
          style={{
            gap: 2,
            paddingLeft: 11,
            paddingRight: 14,
            paddingTop: 8,
            paddingBottom: 10,
            height: 40,
            backgroundColor: "rgba(255,255,255,0.2)",
            borderRadius: "90.909px",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "none",
            cursor: "pointer",
          }}
        >
          <img src={imgWidgetFilled} alt="" width={24} height={24} />
          <span
            style={{
              fontFamily: "TikTok Sans, -apple-system, sans-serif",
              fontWeight: 400,
              fontSize: 14,
              lineHeight: "18.2px",
              letterSpacing: "0.0931px",
              color: "#F6F6F6",
              whiteSpace: "nowrap",
            }}
          >
            Add widget
          </span>
          <img src={imgChevronRightFill} alt="" width={16} height={16} />
        </button>

        {/* Right sidebar: Flip + Flash */}
        <div className="absolute right-0 top-0 flex flex-col" style={{ width: 56, paddingTop: 4 }}>
          <button
            type="button"
            aria-label="Flip camera"
            onClick={() => setFacingMode((p) => (p === "user" ? "environment" : "user"))}
            className="flex items-center justify-center"
            style={{ width: 56, height: 52, background: "none", border: "none", cursor: "pointer" }}
          >
            <img src={imgFlip} alt="Flip" style={{ width: 30, height: 28, objectFit: "contain" }} />
          </button>
          <button
            type="button"
            aria-label="Flash off"
            className="flex items-center justify-center"
            style={{ width: 56, height: 52, background: "none", border: "none", cursor: "pointer" }}
          >
            <img src={imgFlashSlash} alt="Flash off" style={{ width: 28, height: 28, objectFit: "contain" }} />
          </button>
        </div>
      </div>

      {/* ── Camera viewfinder (takes remaining space, square aspect) ── */}
      <div className="flex-1 min-h-0 flex items-center justify-center px-0 py-2">
        {/* Square container capped at the narrower dimension */}
        <div
          style={{
            position: "relative",
            width: "min(100%, calc(100vh - 260px))",
            aspectRatio: "1 / 1",
            overflow: "hidden",
          }}
        >
          {/* Rotated inner frame */}
          <div
            style={{
              position: "absolute",
              inset: "1.3%",
              borderRadius: "25%",
              overflow: "hidden",
              transform: "rotate(-2deg)",
            }}
          >
            {/* Live camera */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: facingMode === "user" ? "scaleX(-1)" : undefined,
              }}
            />
            {/* Placeholder when camera unavailable */}
            {!cameraReady && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "#181818",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    color: "rgba(255,255,255,0.45)",
                    fontSize: 14,
                    fontFamily: "TikTok Sans, sans-serif",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Tap to choose a photo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelected}
      />

      {/* ── Instant / Normal mode toggle ── */}
      <div className="flex-none flex items-center justify-center pb-4" style={{ gap: 11, paddingTop: 12 }}>
        {(["Instant", "Normal"] as CaptureMode[]).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setCaptureMode(mode)}
            style={{
              height: 24,
              paddingLeft: 12,
              paddingRight: 12,
              paddingTop: 3,
              paddingBottom: 3,
              borderRadius: 15,
              backgroundColor: captureMode === mode ? "white" : "transparent",
              fontFamily: "TikTok Sans, -apple-system, sans-serif",
              fontWeight: 400,
              fontSize: 14,
              letterSpacing: "0.0931px",
              lineHeight: "18.2px",
              color: captureMode === mode ? "#000" : "rgba(255,255,255,0.65)",
              whiteSpace: "nowrap",
              border: "none",
              cursor: "pointer",
            }}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* ── Shutter button ── */}
      <div className="flex-none flex items-center justify-center" style={{ paddingBottom: 20 }}>
        <div style={{ position: "relative", width: 86, height: 86 }}>
          {/* White outer ring */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "3px solid white",
            }}
          />
          {/* Gradient inner circle */}
          <button
            type="button"
            aria-label="Take photo"
            onClick={handleCapture}
            style={{
              position: "absolute",
              top: 5,
              left: 5,
              width: 76,
              height: 76,
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, #35E8C3 0%, #3FCBFA 50%, #5AA8FF 100%)",
              border: "none",
              cursor: "pointer",
              transition: "transform 0.1s ease",
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.92)";
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
            }}
            onTouchStart={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.92)";
            }}
            onTouchEnd={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
            }}
          />
        </div>
      </div>
    </div>
  );
}
