import { useState } from "react";
import { TUXText, TUXNavBar, TUXSwitch, TUXButton } from "@byted-tiktok/tux-web";
import {
  TUXIconGear,
  TUXIconBell,
  TUXIconEyeSlash,
  TUXIconTrashBin,
  TUXIconChevronRightSlimLTR,
  TUXIconImage,
  TUXIconClock,
  TUXIconQRCode,
} from "@byted-tiktok/tux-icons";

type SettingRowProps = {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  subtitle?: string;
  trailing?: React.ReactNode;
  onClick?: () => void;
};

function SettingRow({ icon, iconBg, label, subtitle, trailing, onClick }: SettingRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 active:bg-tux-v2-ui-page-flat-2 transition-colors"
    >
      <div
        className="flex-none flex items-center justify-center w-9 h-9 rounded-lg"
        style={{ backgroundColor: iconBg }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0 flex flex-col items-start">
        <TUXText typographyPreset="P2-Regular">{label}</TUXText>
        {subtitle && (
          <TUXText typographyPreset="SmallText2-Regular" color="UIText3">
            {subtitle}
          </TUXText>
        )}
      </div>
      <div className="flex-none">
        {trailing ?? <TUXIconChevronRightSlimLTR size={18} />}
      </div>
    </button>
  );
}

export default function ProfilePage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [screenshotAlert, setScreenshotAlert] = useState(true);

  const userProfile = {
    name: "我的昵称",
    avatar: "https://picsum.photos/seed/me-avatar/200/200",
    bio: "记录生活的每一刻 ✨",
    phone: "138****8888",
    friendCount: 5,
    photosSent: 42,
  };

  return (
    <div className="flex flex-col h-full">
      <TUXNavBar
        heightPreset={44}
        title="我的"
        showSeparator={false}
        trailing={
          <button
            type="button"
            aria-label="设置"
            className="flex items-center justify-center w-10 h-10"
          >
            <TUXIconGear size={24} />
          </button>
        }
      />

      <div className="flex-1 min-h-0 overflow-auto">
        {/* Profile card */}
        <div className="flex flex-col items-center gap-3 px-4 pt-4 pb-6">
          <div className="relative">
            <img
              src={userProfile.avatar}
              alt="头像"
              className="w-20 h-20 rounded-full object-cover"
            />
            <button
              type="button"
              aria-label="更换头像"
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "var(--tux-v2-color-static-blue)",
                border: "2px solid var(--tux-v2-color-ui-page-flat-1)",
              }}
            >
              <TUXIconImage size={14} color="white" />
            </button>
          </div>
          <TUXText typographyPreset="H2-Bold">{userProfile.name}</TUXText>
          <TUXText typographyPreset="P2-Regular" color="UIText3">
            {userProfile.bio}
          </TUXText>

          {/* Stats */}
          <div
            className="flex items-center justify-center gap-8 w-full py-4 mt-2"
            style={{
              backgroundColor: "var(--tux-v2-color-ui-page-flat-2)",
              borderRadius: "var(--tux-v2-radius-container-level0-large)",
            }}
          >
            <div className="flex flex-col items-center gap-1">
              <TUXText typographyPreset="H3-Semibold">{userProfile.friendCount}</TUXText>
              <TUXText typographyPreset="SmallText1-Regular" color="UIText3">
                好友
              </TUXText>
            </div>
            <div
              className="w-px h-8"
              style={{ backgroundColor: "var(--tux-v2-color-ui-shape-neutral-3)" }}
            />
            <div className="flex flex-col items-center gap-1">
              <TUXText typographyPreset="H3-Semibold">{userProfile.photosSent}</TUXText>
              <TUXText typographyPreset="SmallText1-Regular" color="UIText3">
                已发送照片
              </TUXText>
            </div>
            <div
              className="w-px h-8"
              style={{ backgroundColor: "var(--tux-v2-color-ui-shape-neutral-3)" }}
            />
            <div className="flex flex-col items-center gap-1">
              <TUXText typographyPreset="H3-Semibold">30天</TUXText>
              <TUXText typographyPreset="SmallText1-Regular" color="UIText3">
                保留期限
              </TUXText>
            </div>
          </div>
        </div>

        {/* My QR Code */}
        <div className="px-4 pb-2">
          <TUXText typographyPreset="SmallText1-Semibold" color="UIText3">
            我的名片
          </TUXText>
        </div>
        <SettingRow
          icon={<TUXIconQRCode size={18} color="white" />}
          iconBg="var(--tux-v2-color-static-blue)"
          label="我的二维码"
          subtitle="让好友扫码加你"
        />

        {/* Settings section */}
        <div className="px-4 pt-4 pb-2">
          <TUXText typographyPreset="SmallText1-Semibold" color="UIText3">
            偏好设置
          </TUXText>
        </div>

        <SettingRow
          icon={<TUXIconBell size={18} color="white" />}
          iconBg="var(--tux-v2-color-static-green)"
          label="推送通知"
          subtitle="好友发照片时通知你"
          trailing={
            <TUXSwitch
              checked={notificationsEnabled}
              onChange={setNotificationsEnabled}
            />
          }
        />

        <SettingRow
          icon={<TUXIconEyeSlash size={18} color="white" />}
          iconBg="var(--tux-v2-color-static-orange)"
          label="截图提醒"
          subtitle="有人截图时通知发送者"
          trailing={
            <TUXSwitch
              checked={screenshotAlert}
              onChange={setScreenshotAlert}
            />
          }
        />

        <SettingRow
          icon={<TUXIconClock size={18} color="white" />}
          iconBg="var(--tux-v2-color-ui-text-3)"
          label="免打扰时段"
          subtitle="23:00 - 07:00"
        />

        {/* Storage section */}
        <div className="px-4 pt-4 pb-2">
          <TUXText typographyPreset="SmallText1-Semibold" color="UIText3">
            数据与存储
          </TUXText>
        </div>

        <SettingRow
          icon={<TUXIconImage size={18} color="white" />}
          iconBg="var(--tux-v2-color-static-purple)"
          label="照片历史"
          subtitle="查看和管理已发送的照片"
        />

        <SettingRow
          icon={<TUXIconTrashBin size={18} color="white" />}
          iconBg="var(--tux-v2-color-static-red)"
          label="清除缓存"
          subtitle="当前占用 23.5 MB"
        />

        {/* Account section */}
        <div className="flex flex-col items-center gap-3 px-4 pt-8 pb-8">
          <TUXButton
            text="注销账号"
            themePreset="secondary"
            sizePreset="medium"
            shapePreset="capsule"
          />
          <TUXText typographyPreset="SmallText2-Regular" color="UIText3">
            亲密圈 v1.0.0
          </TUXText>
        </div>
      </div>
    </div>
  );
}
