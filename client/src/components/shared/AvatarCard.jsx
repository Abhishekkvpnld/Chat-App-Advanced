import React, { memo } from "react";
import { UsersRound } from "lucide-react";
import { transformImage } from "../../lib/Features";

const AvatarCard = ({ avatar = [], max = 4 }) => {
  const visibleAvatars = avatar.slice(0, max);

  // Single avatar
  if (visibleAvatars.length === 1) {
    return (
      <div className="relative h-12 w-12 shrink-0">
        <img
          src={transformImage(visibleAvatars[0])}
          alt="Avatar"
          className="
            h-12
            w-12
            rounded-full
            object-cover
            ring-2
            ring-white
            shadow-sm
          "
          loading="lazy"
        />
      </div>
    );
  }

  // No avatar
  if (visibleAvatars.length === 0) {
    return (
      <div
        className="
          flex
          h-12
          w-12
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-slate-100
          text-slate-400
          ring-2
          ring-white
        "
      >
        <UsersRound size={20} strokeWidth={1.8} />
      </div>
    );
  }

  // Multiple avatars
  return (
    <div className="relative h-12 w-[4.5rem] shrink-0">
      {visibleAvatars.map((src, index) => (
        <img
          key={`${src}-${index}`}
          src={transformImage(src)}
          alt={`Avatar ${index + 1}`}
          className="
            absolute
            top-0
            h-11
            w-11
            rounded-full
            border-2
            border-white
            bg-slate-100
            object-cover
            shadow-sm
            transition-transform
            duration-200
            group-hover:scale-105
          "
          style={{
            left: `${index * 0.75}rem`,
            zIndex: visibleAvatars.length - index,
          }}
          loading="lazy"
        />
      ))}
    </div>
  );
};

export default memo(AvatarCard);
