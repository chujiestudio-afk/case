import { useState } from "react";
import { TUXText, TUXNavBar } from "@byted-tiktok/tux-web";
import {
  TUXIconCamera,
  TUXIconChevronLeftOffsetLTR,
  TUXIconChevronRightSlimLTR,
  TUXIconHeartFill,
  TUXIconXMark,
} from "@byted-tiktok/tux-icons";

type FriendPhoto = {
  id: string;
  senderName: string;
  senderAvatar: string;
  photoUrl: string;
  timestamp: string;
  timeAgo: string;
  reaction?: string;
  caption?: string;
};

const MOCK_PHOTOS: FriendPhoto[] = [
  {
    id: "1",
    senderName: "小雨",
    senderAvatar: "https://picsum.photos/seed/avatar1/100/100",
    photoUrl: "https://picsum.photos/seed/locket-coffee/400/400",
    timestamp: "2026-03-30T10:23:00",
    timeAgo: "3 分钟前",
    caption: "早安咖啡 ☕",
  },
  {
    id: "2",
    senderName: "大明",
    senderAvatar: "https://picsum.photos/seed/avatar2/100/100",
    photoUrl: "https://picsum.photos/seed/locket-sunset/400/400",
    timestamp: "2026-03-30T09:45:00",
    timeAgo: "41 分钟前",
  },
  {
    id: "3",
    senderName: "阿柔",
    senderAvatar: "https://picsum.photos/seed/avatar3/100/100",
    photoUrl: "https://picsum.photos/seed/locket-cat/400/400",
    timestamp: "2026-03-30T08:12:00",
    timeAgo: "2 小时前",
    caption: "我家猫又睡了",
  },
  {
    id: "4",
    senderName: "杰哥",
    senderAvatar: "https://picsum.photos/seed/avatar4/100/100",
    photoUrl: "https://picsum.photos/seed/locket-gym/400/400",
    timestamp: "2026-03-29T22:30:00",
    timeAgo: "12 小时前",
    reaction: "💪",
  },
];

const QUICK_REACTIONS = ["❤️", "😍", "😂", "🔥", "😮", "😢"];

type PhotoDetailProps = {
  photo: FriendPhoto;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
};

function PhotoDetail({
  photo,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: PhotoDetailProps) {
  const [sentReaction, setSentReaction] = useState<string | null>(null);

  return (
    <div className="absolute inset-0 z-50 flex flex-col" style={{ backgroundColor: "#000" }}>
      {/* Header */}
      <div
        className="flex-none z-10 flex items-center justify-between px-4"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 8px)" }}
      >
        <button
          type="button"
          aria-label="关闭"
          onClick={onClose}
          className="flex items-center justify-center w-10 h-10 rounded-full"
          style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
        >
          <TUXIconXMark size={22} color="white" />
        </button>
        <div className="flex items-center gap-2">
          <img
            src={photo.senderAvatar}
            alt={photo.senderName}
            className="w-8 h-8 rounded-full object-cover"
            style={{ border: "2px solid rgba(255,255,255,0.3)" }}
          />
          <div className="flex flex-col">
            <TUXText typographyPreset="P1-Semibold" color="StaticWhite">
              {photo.senderName}
            </TUXText>
            <TUXText typographyPreset="SmallText2-Regular" color="StaticWhite">
              {photo.timeAgo}
            </TUXText>
          </div>
        </div>
        <div className="w-10" />
      </div>

      {/* Photo */}
      <div className="flex-1 min-h-0 relative flex items-center justify-center px-3 py-3">
        {hasPrev && (
          <button
            type="button"
            aria-label="上一张"
            onClick={onPrev}
            className="absolute left-2 z-10 flex items-center justify-center w-9 h-9 rounded-full"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
          >
            <TUXIconChevronLeftOffsetLTR size={20} color="white" />
          </button>
        )}
        <img
          src={photo.photoUrl}
          alt="好友照片"
          className="w-full h-full object-cover"
          style={{ borderRadius: "var(--tux-v2-radius-container-level1-large)" }}
        />
        {photo.caption && (
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2"
            style={{
              backgroundColor: "rgba(0,0,0,0.55)",
              borderRadius: "var(--tux-v2-radius-content-capsule)",
              backdropFilter: "blur(8px)",
            }}
          >
            <TUXText typographyPreset="P2-Semibold" color="StaticWhite">
              {photo.caption}
            </TUXText>
          </div>
        )}
        {hasNext && (
          <button
            type="button"
            aria-label="下一张"
            onClick={onNext}
            className="absolute right-2 z-10 flex items-center justify-center w-9 h-9 rounded-full"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
          >
            <TUXIconChevronRightSlimLTR size={20} color="white" />
          </button>
        )}
      </div>

      {/* Reaction bar */}
      <div
        className="flex-none flex items-center justify-center gap-5 py-4"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)" }}
      >
        {sentReaction ? (
          <div className="flex items-center gap-2">
            <span className="text-3xl">{sentReaction}</span>
            <TUXText typographyPreset="P2-Regular" color="StaticWhite">
              已发送
            </TUXText>
          </div>
        ) : (
          QUICK_REACTIONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              aria-label={`回应 ${emoji}`}
              onClick={() => setSentReaction(emoji)}
              className="text-3xl transition-transform active:scale-125"
            >
              {emoji}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col h-full">
      {/* Nav */}
      <TUXNavBar
        heightPreset={44}
        title="Explore"
        showSeparator={false}
        trailing={
          <button type="button" aria-label="拍照" className="flex items-center justify-center w-10 h-10">
            <TUXIconCamera size={24} />
          </button>
        }
      />

      {/* Widget-style photo feed */}
      <div className="flex-1 min-h-0 overflow-auto px-4 pb-4">
        {/* Featured latest photo - large widget */}
        <div className="mb-3">
          <button
            type="button"
            className="w-full text-left"
            onClick={() => setSelectedIndex(0)}
          >
            <div
              className="relative overflow-hidden w-full aspect-square"
              style={{ borderRadius: "var(--tux-v2-radius-container-level0-large)" }}
            >
              <img
                src={MOCK_PHOTOS[0].photoUrl}
                alt="最新照片"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(transparent 50%, rgba(0,0,0,0.6) 100%)",
                }}
              />
              {MOCK_PHOTOS[0].caption && (
                <div
                  className="absolute bottom-14 left-4 px-3 py-1.5"
                  style={{
                    backgroundColor: "rgba(0,0,0,0.45)",
                    borderRadius: "var(--tux-v2-radius-content-capsule)",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  <TUXText typographyPreset="P2-Regular" color="StaticWhite">
                    {MOCK_PHOTOS[0].caption}
                  </TUXText>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-4">
                <img
                  src={MOCK_PHOTOS[0].senderAvatar}
                  alt={MOCK_PHOTOS[0].senderName}
                  className="w-10 h-10 rounded-full object-cover"
                  style={{ border: "2px solid rgba(255,255,255,0.5)" }}
                />
                <div className="flex flex-col">
                  <TUXText typographyPreset="P1-Semibold" color="StaticWhite">
                    {MOCK_PHOTOS[0].senderName}
                  </TUXText>
                  <TUXText typographyPreset="SmallText2-Regular" color="StaticWhite">
                    {MOCK_PHOTOS[0].timeAgo}
                  </TUXText>
                </div>
                <div className="ml-auto">
                  <TUXIconHeartFill size={24} color="white" />
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Grid of other photos - 2 column */}
        <div className="grid grid-cols-2 gap-3">
          {MOCK_PHOTOS.slice(1).map((photo, idx) => (
            <button
              key={photo.id}
              type="button"
              className="text-left"
              onClick={() => setSelectedIndex(idx + 1)}
            >
              <div
                className="relative overflow-hidden w-full aspect-square"
                style={{ borderRadius: "var(--tux-v2-radius-container-level0-small)" }}
              >
                <img
                  src={photo.photoUrl}
                  alt={`来自${photo.senderName}的照片`}
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(transparent 40%, rgba(0,0,0,0.6) 100%)",
                  }}
                />
                {photo.reaction && (
                  <div className="absolute top-2 right-2 text-xl">{photo.reaction}</div>
                )}
                <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2 p-2.5">
                  <img
                    src={photo.senderAvatar}
                    alt={photo.senderName}
                    className="w-7 h-7 rounded-full object-cover"
                    style={{ border: "1.5px solid rgba(255,255,255,0.5)" }}
                  />
                  <div className="flex flex-col min-w-0">
                    <TUXText typographyPreset="SmallText1-Semibold" color="StaticWhite">
                      {photo.senderName}
                    </TUXText>
                    <TUXText typographyPreset="SmallText2-Regular" color="StaticWhite">
                      {photo.timeAgo}
                    </TUXText>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Empty state hint */}
        {MOCK_PHOTOS.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 pt-24">
            <div
              className="flex items-center justify-center w-20 h-20 rounded-full"
              style={{ backgroundColor: "var(--tux-v2-color-ui-page-flat-2)" }}
            >
              <TUXIconCamera size={36} />
            </div>
            <TUXText typographyPreset="H3-Semibold">还没有照片</TUXText>
            <TUXText typographyPreset="P2-Regular" color="UIText3">
              邀请好友，开始分享你的日常
            </TUXText>
          </div>
        )}
      </div>

      {/* Photo detail overlay */}
      {selectedIndex !== null && (
        <PhotoDetail
          photo={MOCK_PHOTOS[selectedIndex]}
          onClose={() => setSelectedIndex(null)}
          onPrev={() => setSelectedIndex((i) => Math.max(0, (i ?? 0) - 1))}
          onNext={() =>
            setSelectedIndex((i) => Math.min(MOCK_PHOTOS.length - 1, (i ?? 0) + 1))
          }
          hasPrev={selectedIndex > 0}
          hasNext={selectedIndex < MOCK_PHOTOS.length - 1}
        />
      )}
    </div>
  );
}
