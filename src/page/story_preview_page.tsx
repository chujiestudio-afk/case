import { useState, useRef, useEffect } from "react";

// ── Figma assets (node 24:2970, valid 7 days) ────────────────────────────────
const imgWidgetFilled      = "https://www.figma.com/api/mcp/asset/ee3edaef-a006-4b01-95e5-9c477aa4895e";
const imgChevronRightFill  = "https://www.figma.com/api/mcp/asset/7c831987-ca78-4a4b-be13-aa508c4fb10c";
const imgPaperplaneFill    = "https://www.figma.com/api/mcp/asset/6bcfdb86-87ea-424a-a7ab-b40ef8d4d27d";
const imgArrowClockwise    = "https://www.figma.com/api/mcp/asset/87de7fd2-95d1-43bc-a01d-7b66ce6c963a";
const imgArrowDownLine     = "https://www.figma.com/api/mcp/asset/22b01e89-a6c2-4b6e-a90a-c64c4ec36575";
const imgStickers          = "https://www.figma.com/api/mcp/asset/a63687f2-6f6e-4f9b-ba2d-cdaf48302257";

// Friend avatar ellipses
const imgAllOuter   = "https://www.figma.com/api/mcp/asset/e0a255a9-1ac3-46f7-9869-a3e5752a0bc1";
const imgAllInner   = "https://www.figma.com/api/mcp/asset/a60f4587-03af-47aa-b430-89d18c1c29bf";
const imgF1Outer    = "https://www.figma.com/api/mcp/asset/7075a6c9-99ab-4ce7-baa4-7c3f9f128806";
const imgF1Inner    = "https://www.figma.com/api/mcp/asset/15ff0731-d31e-4b59-a004-ec01cfe2f295";  // opacity 0.6
const imgF2Outer    = "https://www.figma.com/api/mcp/asset/49753387-b09f-4465-aae0-f33dad248fbf";  // 52px ring
const imgF2Inner    = "https://www.figma.com/api/mcp/asset/17a43a36-8016-48f1-b38a-afb870255314";  // 42px
const imgF3Outer    = "https://www.figma.com/api/mcp/asset/49753387-b09f-4465-aae0-f33dad248fbf";
const imgF3Inner    = "https://www.figma.com/api/mcp/asset/092cf2b3-5af4-43b3-b08f-39dfdda1829c";  // 42px
const imgF4Outer    = "https://www.figma.com/api/mcp/asset/80a33178-2989-4ed1-8bee-5eae0c4ae89b";  // 48px ring
const imgF4Inner    = "https://www.figma.com/api/mcp/asset/534773a3-2283-4083-a782-8b78e92fe592";  // opacity 0.6
const imgF5Outer    = "https://www.figma.com/api/mcp/asset/80a33178-2989-4ed1-8bee-5eae0c4ae89b";
const imgF5Inner    = "https://www.figma.com/api/mcp/asset/cde69636-2eb3-40fb-89d3-e3afcab2df0d";  // opacity 0.6

// ── Types ────────────────────────────────────────────────────────────────────
type StoryPreviewPageProps = {
  photoDataUrl: string;
  onBack: () => void;
  onSend: () => void;
};

// ── Friend selector item ─────────────────────────────────────────────────────
type FriendItem = {
  id: string;
  outerSrc: string;
  innerSrc: string;
  innerSize: number;
  innerOffset: number;
  innerOpacity?: number;
  label?: string;
};

const FRIENDS: FriendItem[] = [
  { id: "all",  outerSrc: imgAllOuter,  innerSrc: imgAllInner,  innerSize: 40, innerOffset: 4,    label: "All" },
  { id: "f1",   outerSrc: imgF1Outer,   innerSrc: imgF1Inner,   innerSize: 40, innerOffset: 4,    innerOpacity: 0.6 },
  { id: "f2",   outerSrc: imgF2Outer,   innerSrc: imgF2Inner,   innerSize: 42, innerOffset: 5 },
  { id: "f3",   outerSrc: imgF3Outer,   innerSrc: imgF3Inner,   innerSize: 42, innerOffset: 5 },
  { id: "f4",   outerSrc: imgF4Outer,   innerSrc: imgF4Inner,   innerSize: 40, innerOffset: 4,    innerOpacity: 0.6 },
  { id: "f5",   outerSrc: imgF5Outer,   innerSrc: imgF5Inner,   innerSize: 40, innerOffset: 4,    innerOpacity: 0.6 },
];

// outer ring size matches Figma: "All" group = 48px, f2/f3 = 52px, rest = 48px
const OUTER_SIZE: Record<string, number> = {
  all: 48, f1: 48, f2: 52, f3: 52, f4: 48, f5: 48,
};

// ── Main component ────────────────────────────────────────────────────────────
export default function StoryPreviewPage({ photoDataUrl, onBack, onSend }: StoryPreviewPageProps) {
  const [message, setMessage] = useState("");
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus when editing starts
  useEffect(() => {
    if (isEditingMessage) {
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [isEditingMessage]);

  const handleSend = async () => {
    setSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSent(true);
    setTimeout(() => onSend(), 1000);
  };

  return (
    <div
      className="absolute inset-0 flex flex-col"
      style={{ backgroundColor: "#000" }}
    >
      {/* ── Top bar ── */}
      <div
        className="flex-none relative flex items-center justify-center"
        style={{ height: 56, paddingTop: 4 }}
      >
        {/* Add widget pill */}
        <div
          className="flex items-center"
          style={{
            gap: 2,
            paddingLeft: 11, paddingRight: 14,
            paddingTop: 8, paddingBottom: 10,
            height: 40,
            backgroundColor: "rgba(255,255,255,0.2)",
            borderRadius: "90.909px",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <img src={imgWidgetFilled} alt="" width={24} height={24} />
          <span style={{
            fontFamily: "TikTok Sans, -apple-system, sans-serif",
            fontWeight: 400, fontSize: 14,
            letterSpacing: "0.0931px", color: "#F6F6F6", whiteSpace: "nowrap",
          }}>
            Add widget
          </span>
          <img src={imgChevronRightFill} alt="" width={16} height={16} />
        </div>

        {/* Download button — right */}
        <button
          type="button"
          aria-label="Save photo"
          style={{
            position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
            width: 36, height: 36, background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <img src={imgArrowDownLine} alt="Save" style={{ width: 30, height: 28, objectFit: "contain" }} />
        </button>
      </div>

      {/* ── Photo preview ── */}
      <div className="flex-1 min-h-0 flex items-center justify-center py-2">
        <div style={{
          position: "relative",
          width: "min(100%, calc(100vh - 260px))",
          aspectRatio: "1 / 1",
          overflow: "hidden",
        }}>
          {/* Rotated image */}
          <div style={{
            position: "absolute", inset: "1.3%",
            borderRadius: "25%",
            overflow: "hidden",
            transform: "rotate(-2deg)",
          }}>
            <img
              src={photoDataUrl}
              alt="Preview"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* "Add a message..." pill — overlaid on photo, ~84% from top */}
          <div
            style={{
              position: "absolute",
              bottom: "14%",
              left: "50%",
              transform: "translateX(-46%)",
              zIndex: 10,
            }}
          >
            {isEditingMessage ? (
              /* Live input mode */
              <div
                style={{
                  display: "flex", alignItems: "center",
                  height: 36, borderRadius: 100,
                  backgroundColor: "rgba(52,52,52,0.5)",
                  backdropFilter: "blur(2px)",
                  WebkitBackdropFilter: "blur(2px)",
                  paddingLeft: 16, paddingRight: 16,
                  minWidth: 160, maxWidth: 260,
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onBlur={() => setIsEditingMessage(false)}
                  onKeyDown={(e) => { if (e.key === "Enter") setIsEditingMessage(false); }}
                  placeholder="Add a message..."
                  maxLength={80}
                  style={{
                    background: "none", border: "none", outline: "none",
                    fontFamily: "TikTok Sans, -apple-system, sans-serif",
                    fontWeight: 400, fontSize: 16,
                    letterSpacing: "0.1064px",
                    color: "#F6F6F6",
                    width: "100%",
                    textAlign: "center",
                  }}
                />
              </div>
            ) : (
              /* Placeholder tap target */
              <button
                type="button"
                onClick={() => setIsEditingMessage(true)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  height: 36, borderRadius: 100,
                  backgroundColor: "rgba(52,52,52,0.5)",
                  backdropFilter: "blur(2px)",
                  WebkitBackdropFilter: "blur(2px)",
                  paddingLeft: 16, paddingRight: 16,
                  border: "none", cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{
                  fontFamily: "TikTok Sans, -apple-system, sans-serif",
                  fontWeight: 400, fontSize: 16,
                  letterSpacing: "0.1064px",
                  color: message ? "#F6F6F6" : "rgba(246,246,246,0.7)",
                }}>
                  {message || "Add a message..."}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Action row: Retake · Send · Stickers ── */}
      <div
        className="flex-none flex items-center justify-center"
        style={{ paddingBottom: 8, paddingTop: 4, gap: 0, position: "relative" }}
      >
        {/* Retake */}
        <button
          type="button"
          aria-label="Retake"
          onClick={onBack}
          style={{
            position: "absolute", left: 64,
            width: 36, height: 36,
            background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <img src={imgArrowClockwise} alt="Retake" style={{ width: 36, height: 36, objectFit: "contain" }} />
        </button>

        {/* Send button */}
        <div style={{ position: "relative", width: 86, height: 86 }}>
          {/* White outer ring */}
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            border: "3px solid white",
          }} />
          {/* Dark inner fill + paperplane icon */}
          <button
            type="button"
            aria-label="Send"
            onClick={handleSend}
            disabled={sending || sent}
            style={{
              position: "absolute", top: 5, left: 5,
              width: 76, height: 76, borderRadius: "50%",
              backgroundColor: sending || sent ? "#333" : "#1c1c1e",
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "transform 0.1s, background-color 0.2s",
            }}
            onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(0.92)"; }}
            onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
          >
            {sent ? (
              /* Checkmark when sent */
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <img src={imgPaperplaneFill} alt="Send" style={{ width: 48, height: 48, objectFit: "contain" }} />
            )}
          </button>
        </div>

        {/* Stickers */}
        <button
          type="button"
          aria-label="Stickers"
          style={{
            position: "absolute", right: 64,
            width: 40, height: 40,
            background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <img src={imgStickers} alt="Stickers" style={{ width: 37.5, height: 40, objectFit: "contain" }} />
        </button>
      </div>

      {/* ── Friend selector row ── */}
      <div
        className="flex-none flex items-center justify-center"
        style={{ gap: 20, paddingBottom: 4, paddingTop: 4, overflow: "hidden" }}
      >
        {FRIENDS.map((friend) => {
          const outerSize = OUTER_SIZE[friend.id] ?? 48;
          return (
            <button
              key={friend.id}
              type="button"
              aria-label={friend.label ?? "Friend"}
              style={{
                position: "relative",
                width: outerSize,
                height: outerSize,
                flexShrink: 0,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              {/* Outer ring */}
              <img
                src={friend.outerSrc}
                alt=""
                style={{
                  position: "absolute", top: 0, left: 0,
                  width: outerSize, height: outerSize,
                  display: "block",
                }}
              />
              {/* Inner avatar */}
              <img
                src={friend.innerSrc}
                alt=""
                style={{
                  position: "absolute",
                  top: friend.innerOffset,
                  left: friend.innerOffset,
                  width: friend.innerSize,
                  height: friend.innerSize,
                  opacity: friend.innerOpacity ?? 1,
                  display: "block",
                }}
              />
              {/* "All" text label */}
              {friend.label && (
                <span style={{
                  position: "absolute",
                  top: "50%", left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontFamily: "TikTok Sans, -apple-system, sans-serif",
                  fontWeight: 600, fontSize: 15,
                  color: "#fff",
                  pointerEvents: "none",
                  whiteSpace: "nowrap",
                  zIndex: 2,
                }}>
                  {friend.label}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── iOS home indicator ── */}
      <div style={{ height: 34, position: "relative", flexShrink: 0 }}>
        <div style={{
          position: "absolute", bottom: 8, left: "50%",
          transform: "translateX(-50%)",
          width: 140, height: 5,
          backgroundColor: "#F6F6F6",
          borderRadius: 29,
        }} />
      </div>

      {/* ── Sent overlay ── */}
      {sent && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 50,
          backgroundColor: "rgba(0,0,0,0.75)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 12,
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            backgroundColor: "#30d158",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{
            fontFamily: "TikTok Sans, -apple-system, sans-serif",
            fontWeight: 700, fontSize: 22, color: "#fff",
          }}>
            Sent!
          </span>
        </div>
      )}
    </div>
  );
}
