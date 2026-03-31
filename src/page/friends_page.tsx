import { useState } from "react";
import { TUXText, TUXNavBar, TUXButton, TUXInput } from "@byted-tiktok/tux-web";
import {
  TUXIconPersonPlus,
  TUXIconQRCode,
  TUXIconLink,
  TUXIconXMark,
  TUXIconTrashBin,
  TUXIconChevronRightSlimLTR,
  TUXIconMagnifyingGlass,
} from "@byted-tiktok/tux-icons";

type Friend = {
  id: string;
  name: string;
  avatar: string;
  lastPhotoTime: string;
  lastPhotoUrl?: string;
  online?: boolean;
};

const MOCK_FRIENDS: Friend[] = [
  {
    id: "1",
    name: "小雨",
    avatar: "https://picsum.photos/seed/avatar1/100/100",
    lastPhotoTime: "3 分钟前",
    lastPhotoUrl: "https://picsum.photos/seed/locket-coffee/100/100",
    online: true,
  },
  {
    id: "2",
    name: "大明",
    avatar: "https://picsum.photos/seed/avatar2/100/100",
    lastPhotoTime: "41 分钟前",
    lastPhotoUrl: "https://picsum.photos/seed/locket-sunset/100/100",
    online: true,
  },
  {
    id: "3",
    name: "阿柔",
    avatar: "https://picsum.photos/seed/avatar3/100/100",
    lastPhotoTime: "2 小时前",
    lastPhotoUrl: "https://picsum.photos/seed/locket-cat/100/100",
  },
  {
    id: "4",
    name: "杰哥",
    avatar: "https://picsum.photos/seed/avatar4/100/100",
    lastPhotoTime: "12 小时前",
    lastPhotoUrl: "https://picsum.photos/seed/locket-gym/100/100",
  },
  {
    id: "5",
    name: "小琳",
    avatar: "https://picsum.photos/seed/avatar5/100/100",
    lastPhotoTime: "昨天",
  },
];

const MAX_FRIENDS = 10;

type AddFriendSheetProps = {
  onClose: () => void;
};

function AddFriendSheet({ onClose }: AddFriendSheetProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className="relative z-10 flex flex-col bg-tux-v2-ui-page-flat-1"
        style={{
          borderRadius: "var(--tux-v2-radius-container-level2-large) var(--tux-v2-radius-container-level2-large) 0 0",
          paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)",
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-9 h-1 rounded-full bg-tux-v2-ui-shape-neutral-3" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-3">
          <TUXText typographyPreset="H2-Bold">添加好友</TUXText>
          <button
            type="button"
            aria-label="关闭"
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full"
            style={{ backgroundColor: "var(--tux-v2-color-ui-page-flat-2)" }}
          >
            <TUXIconXMark size={18} />
          </button>
        </div>

        {/* Invite methods */}
        <div className="flex flex-col gap-1 px-4 pb-4">
          <TUXText typographyPreset="SmallText1-Regular" color="UIText3">
            邀请你最亲密的人加入亲密圈（上限 {MAX_FRIENDS} 人）
          </TUXText>
        </div>

        <div className="flex flex-col gap-3 px-4 pb-4">
          {/* Invite link */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-4 p-4"
            style={{
              backgroundColor: "var(--tux-v2-color-ui-page-flat-2)",
              borderRadius: "var(--tux-v2-radius-container-level0-small)",
            }}
          >
            <div
              className="flex items-center justify-center w-11 h-11 rounded-full"
              style={{ backgroundColor: "var(--tux-v2-color-static-blue)" }}
            >
              <TUXIconLink size={22} color="white" />
            </div>
            <div className="flex flex-col items-start">
              <TUXText typographyPreset="P1-Semibold">
                {copied ? "已复制！" : "复制邀请链接"}
              </TUXText>
              <TUXText typographyPreset="SmallText1-Regular" color="UIText3">
                分享给好友即可加入
              </TUXText>
            </div>
            <div className="ml-auto">
              <TUXIconChevronRightSlimLTR size={20} />
            </div>
          </button>

          {/* QR Code */}
          <button
            type="button"
            className="flex items-center gap-4 p-4"
            style={{
              backgroundColor: "var(--tux-v2-color-ui-page-flat-2)",
              borderRadius: "var(--tux-v2-radius-container-level0-small)",
            }}
          >
            <div
              className="flex items-center justify-center w-11 h-11 rounded-full"
              style={{ backgroundColor: "var(--tux-v2-color-static-green)" }}
            >
              <TUXIconQRCode size={22} color="white" />
            </div>
            <div className="flex flex-col items-start">
              <TUXText typographyPreset="P1-Semibold">展示二维码</TUXText>
              <TUXText typographyPreset="SmallText1-Regular" color="UIText3">
                让好友面对面扫码添加
              </TUXText>
            </div>
            <div className="ml-auto">
              <TUXIconChevronRightSlimLTR size={20} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FriendsPage() {
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [friends, setFriends] = useState(MOCK_FRIENDS);
  const [searchText, setSearchText] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredFriends = searchText
    ? friends.filter((f) => f.name.includes(searchText))
    : friends;

  const handleDelete = (id: string) => {
    setFriends((prev) => prev.filter((f) => f.id !== id));
    setConfirmDeleteId(null);
  };

  return (
    <div className="flex flex-col h-full">
      <TUXNavBar
        heightPreset={44}
        title="好友"
        showSeparator={false}
        trailing={
          <button
            type="button"
            aria-label="添加好友"
            onClick={() => setShowAddSheet(true)}
            className="flex items-center justify-center w-10 h-10"
          >
            <TUXIconPersonPlus size={24} />
          </button>
        }
      />

      <div className="flex-1 min-h-0 overflow-auto">
        {/* Search */}
        <div className="px-4 pb-3">
          <div
            className="flex items-center gap-2 px-3 h-9"
            style={{
              backgroundColor: "var(--tux-v2-color-ui-page-flat-2)",
              borderRadius: "var(--tux-v2-radius-content-large)",
            }}
          >
            <TUXIconMagnifyingGlass size={16} />
            <input
              type="text"
              placeholder="搜索好友"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="flex-1 bg-transparent outline-none P2-Regular"
              style={{ fontFamily: "TikTok Sans, sans-serif" }}
            />
          </div>
        </div>

        {/* Friend count */}
        <div className="px-4 pb-2">
          <TUXText typographyPreset="SmallText1-Regular" color="UIText3">
            我的好友 {friends.length}/{MAX_FRIENDS}
          </TUXText>
        </div>

        {/* Friend list */}
        <div className="flex flex-col">
          {filteredFriends.map((friend) => (
            <div key={friend.id}>
              <button
                type="button"
                className="w-full flex items-center gap-3 px-4 py-3 active:bg-tux-v2-ui-page-flat-2 transition-colors"
              >
                {/* Avatar with online indicator */}
                <div className="relative flex-none">
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {friend.online && (
                    <div
                      className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full"
                      style={{
                        backgroundColor: "var(--tux-v2-color-static-green)",
                        border: "2px solid var(--tux-v2-color-ui-page-flat-1)",
                      }}
                    />
                  )}
                </div>

                {/* Name and last photo */}
                <div className="flex-1 min-w-0 flex flex-col items-start">
                  <TUXText typographyPreset="P1-Semibold">{friend.name}</TUXText>
                  <TUXText typographyPreset="SmallText1-Regular" color="UIText3">
                    最近照片 · {friend.lastPhotoTime}
                  </TUXText>
                </div>

                {/* Last photo thumbnail */}
                {friend.lastPhotoUrl && (
                  <div className="flex-none">
                    <img
                      src={friend.lastPhotoUrl}
                      alt="最近照片"
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  </div>
                )}

                {/* Delete */}
                <button
                  type="button"
                  aria-label={`删除 ${friend.name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDeleteId(friend.id);
                  }}
                  className="flex-none flex items-center justify-center w-8 h-8"
                >
                  <TUXIconTrashBin size={18} />
                </button>
              </button>

              {/* Delete confirmation */}
              {confirmDeleteId === friend.id && (
                <div className="flex items-center justify-end gap-2 px-4 pb-3">
                  <TUXButton
                    text="取消"
                    themePreset="secondary"
                    sizePreset="small"
                    shapePreset="capsule"
                    onClick={() => setConfirmDeleteId(null)}
                  />
                  <TUXButton
                    text="确认删除"
                    themePreset="destructive"
                    sizePreset="small"
                    shapePreset="capsule"
                    onClick={() => handleDelete(friend.id)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredFriends.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 pt-16">
            <TUXText typographyPreset="P1-Regular" color="UIText3">
              {searchText ? "没有找到好友" : "还没有好友"}
            </TUXText>
            {!searchText && (
              <TUXButton
                text="邀请好友"
                themePreset="primary"
                sizePreset="medium"
                shapePreset="capsule"
                onClick={() => setShowAddSheet(true)}
              />
            )}
          </div>
        )}
      </div>

      {/* Add friend sheet */}
      {showAddSheet && <AddFriendSheet onClose={() => setShowAddSheet(false)} />}
    </div>
  );
}
