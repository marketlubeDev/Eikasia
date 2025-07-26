import React from "react";
import { Home, Archive, User, Settings } from "lucide-react";
import Dock from "./Docker";

export default function Nav() {
  const items = [
    {
      icon: <Home size={18} />,
      label: "Home",
      onClick: () => alert("Home!"),
    },
    {
      icon: <Archive size={18} />,
      label: "Archive",
      onClick: () => alert("Archive!"),
    },
    {
      icon: <User size={18} />,
      label: "Profile",
      onClick: () => alert("Profile!"),
    },
    {
      icon: <Settings size={18} />,
      label: "Settings",
      onClick: () => alert("Settings!"),
    },
  ];
  return (
    <div className="fixed top-10 right-6 z-50 w-fit h-fit">
      <Dock
        items={items}
        panelHeight={68}
        baseItemSize={50}
        magnification={70}
      />
    </div>
  );
}
