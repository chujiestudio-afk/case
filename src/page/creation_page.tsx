import { useState } from "react";
import StoryCapturePage from "./story_capture_page";
import StoryPreviewPage from "./story_preview_page";

type CreationStep = "capture" | "preview";

type CreationPageProps = {
  onPreviewChange?: (isPreview: boolean) => void;
};

export default function CreationPage({ onPreviewChange }: CreationPageProps) {
  const [step, setStep] = useState<CreationStep>("capture");
  const [photoDataUrl, setPhotoDataUrl] = useState<string>("");

  const handlePhotoCaptured = (dataUrl: string) => {
    setPhotoDataUrl(dataUrl);
    setStep("preview");
    onPreviewChange?.(true);
  };

  const handleBack = () => {
    setStep("capture");
    setPhotoDataUrl("");
    onPreviewChange?.(false);
  };

  const handleSend = () => {
    setStep("capture");
    setPhotoDataUrl("");
    onPreviewChange?.(false);
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {step === "capture" && (
        <StoryCapturePage
          onClose={() => {}}
          onPhotoCaptured={handlePhotoCaptured}
        />
      )}

      {step === "preview" && photoDataUrl && (
        <StoryPreviewPage
          photoDataUrl={photoDataUrl}
          onBack={handleBack}
          onSend={handleSend}
        />
      )}
    </div>
  );
}
