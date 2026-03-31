import { useState } from "react";
import { TUXText, TUXNavBar } from "@byted-tiktok/tux-web";
import { TUXIconGear } from "@byted-tiktok/tux-icons";

type ActivityType = "reaction" | "reply" | "new_friend" | "photo_received";

type ActivityItem = {
  id: string;
  type: ActivityType;
  senderName: string;
  senderAvatar: string;
  content: string;
  timeAgo: string;
  photoUrl?: string;
  read: boolean;
};

const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: "1",
    type: "reaction",
    senderName: "小雨",
    senderAvatar: "https://picsum.photos/seed/avatar1/100/100",
    content: "对你的照片回应了 ❤️",
    timeAgo: "1 分钟前",
    photoUrl: "https://picsum.photos/seed/locket-lunch/80/80",
    read: false,
  },
  {
    id: "2",
    type: "reply",
    senderName: "大明",
    senderAvatar: "https://picsum.photos/seed/avatar2/100/100",
    content: '回复了你的照片："哈哈好吃的"',
    timeAgo: "15 分钟前",
    photoUrl: "https://picsum.photos/seed/locket-food/80/80",
    read: false,
  },
  {
    id: "3",
    type: "photo_received",
    senderName: "阿柔",
    senderAvatar: "https://picsum.photos/seed/avatar3/100/100",
    content: "给你发了一张新照片",
    timeAgo: "2 小时前",
    photoUrl: "https://picsum.photos/seed/locket-cat/80/80",
    read: true,
  },
  {
    id: "4",
    type: "new_friend",
    senderName: "小琳",
    senderAvatar: "https://picsum.photos/seed/avatar5/100/100",
    content: "接受了你的好友邀请",
    timeAgo: "5 小时前",
    read: true,
  },
  {
    id: "5",
    type: "reaction",
    senderName: "杰哥",
    senderAvatar: "https://picsum.photos/seed/avatar4/100/100",
    content: "对你的照片回应了 🔥",
    timeAgo: "昨天",
    photoUrl: "https://picsum.photos/seed/locket-gym2/80/80",
    read: true,
  },
  {
    id: "6",
    type: "reply",
    senderName: "小雨",
    senderAvatar: "https://picsum.photos/seed/avatar1/100/100",
    content: '回复了你的照片："想你了～"',
    timeAgo: "昨天",
    photoUrl: "https://picsum.photos/seed/locket-sky/80/80",
    read: true,
  },
  {
    id: "7",
    type: "photo_received",
    senderName: "大明",
    senderAvatar: "https://picsum.photos/seed/avatar2/100/100",
    content: "给你发了一张新照片",
    timeAgo: "2 天前",
    photoUrl: "https://picsum.photos/seed/locket-street/80/80",
    read: true,
  },
];

function getActivityIcon(type: ActivityType): string {
  switch (type) {
    case "reaction":
      return "💬";
    case "reply":
      return "💌";
    case "new_friend":
      return "🤝";
    case "photo_received":
      return "📷";
  }
}

export default function InboxPage() {
  const [activities, setActivities] = useState(MOCK_ACTIVITIES);

  const unreadCount = activities.filter((a) => !a.read).length;
  const todayActivities = activities.filter(
    (a) => !a.timeAgo.includes("天前") && !a.timeAgo.includes("昨天")
  );
  const earlierActivities = activities.filter(
    (a) => a.timeAgo.includes("天前") || a.timeAgo.includes("昨天")
  );

  const markAllRead = () => {
    setActivities((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  return (
    <div className="flex flex-col h-full">
      <TUXNavBar
        heightPreset={44}
        title="Chats"
        showSeparator={false}
        trailing={
          <button
            type="button"
            aria-label="设置通知"
            className="flex items-center justify-center w-10 h-10"
          >
            <TUXIconGear size={24} />
          </button>
        }
      />

      <div className="flex-1 min-h-0 overflow-auto">
        {/* Unread badge */}
        {unreadCount > 0 && (
          <div className="flex items-center justify-between px-4 pb-2">
            <TUXText typographyPreset="SmallText1-Semibold" color="UIText3">
              {unreadCount} 条未读
            </TUXText>
            <button
              type="button"
              onClick={markAllRead}
              className="SmallText1-Semibold"
              style={{ color: "var(--tux-v2-color-static-blue)", fontFamily: "TikTok Sans, sans-serif" }}
            >
              全部已读
            </button>
          </div>
        )}

        {/* Today section */}
        {todayActivities.length > 0 && (
          <>
            <div className="px-4 pt-2 pb-1">
              <TUXText typographyPreset="SmallText1-Semibold" color="UIText3">
                今天
              </TUXText>
            </div>
            {todayActivities.map((activity) => (
              <ActivityRow key={activity.id} activity={activity} />
            ))}
          </>
        )}

        {/* Earlier section */}
        {earlierActivities.length > 0 && (
          <>
            <div className="px-4 pt-4 pb-1">
              <TUXText typographyPreset="SmallText1-Semibold" color="UIText3">
                更早
              </TUXText>
            </div>
            {earlierActivities.map((activity) => (
              <ActivityRow key={activity.id} activity={activity} />
            ))}
          </>
        )}

        {/* Empty state */}
        {activities.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 pt-24">
            <div className="text-5xl">📭</div>
            <TUXText typographyPreset="P1-Regular" color="UIText3">
              暂无消息
            </TUXText>
          </div>
        )}
      </div>
    </div>
  );
}

function ActivityRow({ activity }: { activity: ActivityItem }) {
  return (
    <button
      type="button"
      className="w-full flex items-center gap-3 px-4 py-3 active:bg-tux-v2-ui-page-flat-2 transition-colors"
    >
      {/* Avatar */}
      <div className="relative flex-none">
        <img
          src={activity.senderAvatar}
          alt={activity.senderName}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div
          className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs"
          style={{
            backgroundColor: "var(--tux-v2-color-ui-page-flat-1)",
          }}
        >
          {getActivityIcon(activity.type)}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col items-start gap-0.5">
        <div className="flex items-center gap-1.5">
          <TUXText typographyPreset="P2-Semibold">{activity.senderName}</TUXText>
          {!activity.read && (
            <div
              className="w-2 h-2 rounded-full flex-none"
              style={{ backgroundColor: "var(--tux-v2-color-static-blue)" }}
            />
          )}
        </div>
        <TUXText typographyPreset="SmallText1-Regular" color="UIText3">
          {activity.content}
        </TUXText>
        <TUXText typographyPreset="SmallText2-Regular" color="UIText3">
          {activity.timeAgo}
        </TUXText>
      </div>

      {/* Photo thumbnail */}
      {activity.photoUrl && (
        <div className="flex-none">
          <img
            src={activity.photoUrl}
            alt="相关照片"
            className="w-11 h-11 rounded-lg object-cover"
          />
        </div>
      )}
    </button>
  );
}
