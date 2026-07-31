"use client";

import { FlameIcon, HomeIcon, PlusIcon, SearchIcon, UserIcon } from "./icons";

export type Tab = "feed" | "trending" | "search" | "you";

const TABS: { key: Tab; label: string; Icon: typeof HomeIcon }[] = [
  { key: "feed", label: "Feed", Icon: HomeIcon },
  { key: "trending", label: "Hot", Icon: FlameIcon },
  { key: "search", label: "Search", Icon: SearchIcon },
  { key: "you", label: "You", Icon: UserIcon },
];

export function BottomNav({
  active,
  onSelect,
  onCompose,
  unreadNotifs = 0,
}: {
  active: Tab;
  onSelect: (tab: Tab) => void;
  onCompose: () => void;
  unreadNotifs?: number;
}) {
  return (
    <nav className="nav">
      {TABS.slice(0, 2).map(({ key, label, Icon }) => (
        <button
          key={key}
          type="button"
          className={active === key ? "tab on" : "tab"}
          onClick={() => onSelect(key)}
        >
          <span className="ico">
            <Icon />
          </span>
          {label}
        </button>
      ))}

      <button type="button" className="fab press" onClick={onCompose} aria-label="Create post">
        <PlusIcon size={26} />
      </button>

      {TABS.slice(2).map(({ key, label, Icon }) => (
        <button
          key={key}
          type="button"
          className={active === key ? "tab on" : "tab"}
          onClick={() => onSelect(key)}
        >
          <span className="ico-wrap">
            <span className="ico">
              <Icon />
            </span>
            {key === "you" && unreadNotifs > 0 && (
              <span className="notif-badge" aria-label={`${unreadNotifs} unread`}>
                {unreadNotifs > 9 ? "9+" : unreadNotifs}
              </span>
            )}
          </span>
          {label}
        </button>
      ))}
    </nav>
  );
}
