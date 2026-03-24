import { TUXNavBar } from "@byted-tiktok/tux-web";
import {
  TUXIconMagnifyingGlass,
  TUXIconTwoPersonPlus,
} from "@byted-tiktok/tux-icons";

export default function InboxPage() {
  return (
    <div>
      <TUXNavBar
        heightPreset={44}
        title="Inbox"
        showSeparator={true}
        leading={<TUXIconTwoPersonPlus size={24} />}
        trailing={<TUXIconMagnifyingGlass size={24} />}
      />
    </div>
  );
}
