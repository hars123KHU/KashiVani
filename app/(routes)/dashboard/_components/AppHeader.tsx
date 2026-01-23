import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";

const menuOptions = [
  {
    id: 1,
    path: "/dashboard/history",
  },
];

function AppHeader() {
  return (
    <header
      className="
        sticky top-0 z-50
        flex items-center justify-between
        px-10 md:px-20 lg:px-40
        py-2
        bg-white
        border-b border-black/10
        shadow-[0_2px_10px_rgba(0,0,0,0.06)]
      "
    >
      {/* Logo (fixed height, visually scaled) */}
      <div className="h-16 flex items-center">
        <Image
          src="/kashivani.jpeg"
          alt="Kashivani logo"
          width={110}
          height={80}
          priority
          className="
            object-contain
            scale-110
            origin-left
          "
        />
      </div>

      {/* Spacer for future nav items */}
      <div className="hidden md:flex gap-12 items-center">
        {/* nav items can go here later */}
      </div>

      {/* User Profile */}
      <UserButton />
    </header>
  );
}

export default AppHeader;
