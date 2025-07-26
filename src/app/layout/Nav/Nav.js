import React, { useState, useEffect } from "react";
import { Home, Archive, User, Settings } from "lucide-react";
import Dock from "./Docker";

export default function Nav() {
  const [screenSize, setScreenSize] = useState("lg");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setScreenSize("sm");
      } else if (window.innerWidth < 768) {
        setScreenSize("md");
      } else {
        setScreenSize("lg");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getDockProps = () => {
    switch (screenSize) {
      case "sm":
        return { panelHeight: 56, baseItemSize: 40, magnification: 55 };
      case "md":
        return { panelHeight: 64, baseItemSize: 45, magnification: 62 };
      default:
        return { panelHeight: 68, baseItemSize: 50, magnification: 70 };
    }
  };
  const items = [
    {
      icon: <Home className="w-4 h-4 sm:w-5 sm:h-5" />,
      label: "Home",
      onClick: () => alert("Home!"),
    },
    {
      icon: <Archive className="w-4 h-4 sm:w-5 sm:h-5" />,
      label: "Archive",
      onClick: () => alert("Archive!"),
    },
    {
      icon: <User className="w-4 h-4 sm:w-5 sm:h-5" />,
      label: "Profile",
      onClick: () => alert("Profile!"),
    },
    {
      icon: <Settings className="w-4 h-4 sm:w-5 sm:h-5" />,
      label: "Settings",
      onClick: () => alert("Settings!"),
    },
  ];
  const dockProps = getDockProps();

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 sm:top-6 sm:right-4 sm:bottom-auto sm:left-auto sm:transform-none md:top-8 md:right-6 z-50 w-fit h-fit">
      <Dock items={items} {...dockProps} />
    </div>
  );
}
