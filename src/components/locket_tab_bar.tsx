/**
 * Locket-style bottom nav bar — exact 1:1 from Figma node 24:2715.
 * Only the camera (centre) tab triggers onCameraPress.
 * All other tabs are visual-only with no interaction.
 */

// Figma asset URLs (valid 7 days)
const imgChat    = "https://www.figma.com/api/mcp/asset/f30ffa98-1b94-423f-8178-a2e485766d9b";
const imgFriends = "https://www.figma.com/api/mcp/asset/b465d05e-e8c0-4e25-a646-2ef4167509f9";
const imgCamera  = "https://www.figma.com/api/mcp/asset/f2764cb2-97d8-4320-a73d-036abdd924c2";
const imgExploreNeedle = "https://www.figma.com/api/mcp/asset/54a053f7-8750-4ee5-aa8b-97373cd3d308";
const imgProfile = "https://www.figma.com/api/mcp/asset/370b3fd1-b6a2-4c21-86c1-edb108e74174";

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: "TikTok Sans, -apple-system, sans-serif",
  fontWeight: 500,
  fontSize: 10,
  lineHeight: 1.3,
  letterSpacing: "0.2287px",
  color: "rgba(255,255,255,0.6)",
  textAlign: "center",
  whiteSpace: "nowrap",
  minWidth: "100%",
};

// ── Chats icon ──────────────────────────────────────────────
function ChatIcon() {
  return (
    <div style={{ width: 32, height: 32, position: "relative", overflow: "clip", flexShrink: 0, marginBottom: -1 }}>
      <div style={{
        position: "absolute",
        left: "50%", top: "50%",
        transform: "translate(-50%,-50%)",
        width: 24, height: 24,
      }}>
        {/* chat bubble: flipped & rotated via Figma spec */}
        <div style={{
          position: "absolute",
          left: "50%", top: 4,
          transform: "translateX(-50%)",
          width: 18, height: 18.007,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ transform: "rotate(180deg) scaleY(-1)", flexShrink: 0, width: 18, height: 18.007, position: "relative" }}>
            <div style={{ position: "absolute", inset: "-8.33% -8.33% -5.79% -8.33%" }}>
              <img alt="" src={imgChat} style={{ display: "block", maxWidth: "none", width: "100%", height: "100%" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Friends icon ─────────────────────────────────────────────
function FriendsIcon() {
  return (
    <div style={{ width: 32, height: 32, position: "relative", overflow: "clip", flexShrink: 0, marginBottom: -1 }}>
      <div style={{
        position: "absolute",
        left: "50%", top: "50%",
        transform: "translate(-50%,-50%)",
        width: 24, height: 24,
      }}>
        <div style={{ position: "absolute", left: 1.41, top: 3.52, width: 21.174, height: 18.508 }}>
          <div style={{ position: "absolute", inset: "-8.1% -5.92% -4.49% -6.26%" }}>
            <img alt="" src={imgFriends} style={{ display: "block", maxWidth: "none", width: "100%", height: "100%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Explore icon (circle + rotated needle) ───────────────────
function ExploreIcon() {
  return (
    <div style={{ width: 32, height: 32, position: "relative", overflow: "clip", flexShrink: 0, marginBottom: -1 }}>
      <div style={{
        position: "absolute",
        left: "50%", top: "50%",
        transform: "translate(-50%,-50%)",
        width: 24, height: 24,
      }}>
        {/* Outer circle */}
        <div style={{
          position: "absolute",
          left: "50%", top: "50%",
          transform: "translate(-50%,-50%)",
          width: 19.356, height: 19.356,
          borderRadius: 40.472,
          border: "2px solid rgba(255,255,255,0.6)",
        }} />
        {/* Compass needle */}
        <div style={{
          position: "absolute",
          left: "50%", top: "50%",
          transform: "translate(-50%,-50%)",
          width: 9.816, height: 9.816,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ transform: "rotate(75deg)", flexShrink: 0, width: 8.015, height: 8.015, position: "relative" }}>
            <div style={{ position: "absolute", inset: "3.46%" }}>
              <img alt="" src={imgExploreNeedle} style={{ display: "block", maxWidth: "none", width: "100%", height: "100%" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Profile icon ─────────────────────────────────────────────
function ProfileIcon() {
  return (
    <div style={{ width: 32, height: 32, position: "relative", overflow: "clip", flexShrink: 0, marginBottom: -1 }}>
      <div style={{
        position: "absolute",
        left: "50%", top: "50%",
        transform: "translate(-50%,-50%)",
        width: 24, height: 24,
      }}>
        <div style={{ position: "absolute", left: 1.23, top: 0.5, width: 19.436, height: 21.392 }}>
          <img alt="" src={imgProfile} style={{ position: "absolute", display: "block", maxWidth: "none", width: "100%", height: "100%" }} />
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
type LocketTabBarProps = {
  onCameraPress?: () => void;
};

export default function LocketTabBar({ onCameraPress }: LocketTabBarProps) {
  return (
    <div
      style={{
        backgroundColor: "#000",
        width: "100%",
        flexShrink: 0,
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {/* 5-tab row — 49 px tall */}
      <div style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
        height: 49,
        overflow: "clip",
      }}>

        {/* Chats — visual only */}
        <div style={{
          flex: "1 0 0", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "flex-start",
          paddingTop: 2, paddingBottom: 4, minWidth: 1, minHeight: 1,
          overflow: "clip",
        }}>
          <ChatIcon />
          <span style={LABEL_STYLE}>Chats</span>
        </div>

        {/* Friends — visual only */}
        <div style={{
          flex: "1 0 0", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "flex-start",
          paddingTop: 2, paddingBottom: 4, minWidth: 1, minHeight: 1,
          overflow: "clip",
        }}>
          <FriendsIcon />
          <span style={LABEL_STYLE}>Friends</span>
        </div>

        {/* Camera — interactive, 76 px fixed width */}
        <button
          type="button"
          aria-label="Camera"
          onClick={onCameraPress}
          style={{
            width: 76, height: 49, flexShrink: 0,
            display: "flex", alignItems: "flex-start", justifyContent: "center",
            background: "none", border: "none", cursor: "pointer", padding: 0,
          }}
        >
          <div style={{ position: "relative", width: 76, height: 49, flexShrink: 0 }}>
            <div style={{ position: "absolute", left: 18, top: 1.5, width: 40, height: 40 }}>
              <img
                alt="Camera"
                src={imgCamera}
                style={{ position: "absolute", display: "block", maxWidth: "none", width: "100%", height: "100%" }}
              />
            </div>
          </div>
        </button>

        {/* Explore — visual only */}
        <div style={{
          flex: "1 0 0", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "flex-start",
          paddingTop: 2, paddingBottom: 4, minWidth: 1, minHeight: 1,
          overflow: "clip",
        }}>
          <ExploreIcon />
          <span style={LABEL_STYLE}>Explore</span>
        </div>

        {/* Profile — visual only */}
        <div style={{
          flex: "1 0 0", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "flex-start",
          paddingTop: 2, paddingBottom: 4, minWidth: 1, minHeight: 1,
          overflow: "clip",
        }}>
          <ProfileIcon />
          <span style={LABEL_STYLE}>Profile</span>
        </div>

      </div>

      {/* iOS home indicator — 34 px area */}
      <div style={{ height: 34, position: "relative", overflow: "clip" }}>
        <div style={{
          position: "absolute",
          bottom: 8,
          left: "50%",
          transform: "translateX(-50%)",
          width: 140, height: 5,
          backgroundColor: "#F6F6F6",
          borderRadius: 29,
        }} />
      </div>
    </div>
  );
}
