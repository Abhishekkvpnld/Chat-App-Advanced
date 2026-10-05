
import React from "react";
import moment from "moment";
import {
  UserRound,
  AtSign,
  CalendarDays,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { transformImage } from "../../lib/Features";

const Profile = ({ user }) => {
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="relative">
          <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-stone-100 shadow-lg ring-1 ring-stone-200">
            {user?.avatar?.url ? (
              <img
                src={transformImage(user.avatar.url)}
                alt={user?.name || "Profile"}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-stone-400">
                <UserRound size={46} strokeWidth={1.5} />
              </div>
            )}
          </div>

          {/* Online indicator */}
          <span className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-4 border-white bg-emerald-500" />
        </div>

        {/* Name */}
        <h2 className="mt-5 text-xl font-semibold tracking-tight text-stone-900">
          {user?.name || "User"}
        </h2>

        {/* Username */}
        <p className="mt-1 text-sm text-stone-500">
          @{user?.username || "username"}
        </p>
      </div>

      {/* Bio */}
      {user?.bio && (
        <div className="mt-7 rounded-2xl border border-stone-200 bg-stone-50/70 p-5">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
            About
          </p>

          <p className="text-sm leading-6 text-stone-600">
            {user.bio}
          </p>
        </div>
      )}

      {/* Profile Details */}
      <div className="mt-5 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <ProfileItem
          icon={<AtSign size={18} />}
          label="Username"
          value={`@${user?.username || "username"}`}
        />

        <ProfileItem
          icon={<UserRound size={18} />}
          label="Full name"
          value={user?.name || "Not available"}
        />

        {user?.email && (
          <ProfileItem
            icon={<Mail size={18} />}
            label="Email"
            value={user.email}
          />
        )}

        <ProfileItem
          icon={<CalendarDays size={18} />}
          label="Member since"
          value={
            user?.createdAt
              ? moment(user.createdAt).format("MMM YYYY")
              : "Not available"
          }
          last
        />
      </div>

      {/* Account Status */}
      <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
          <ShieldCheck size={18} />
        </div>

        <div>
          <p className="text-sm font-medium text-stone-800">
            Account active
          </p>
          <p className="text-xs text-stone-500">
            Your profile is available to your contacts
          </p>
        </div>

        <span className="ml-auto h-2.5 w-2.5 rounded-full bg-emerald-500" />
      </div>
    </div>
  );
};

const ProfileItem = ({ icon, label, value, last = false }) => {
  return (
    <div
      className={`flex items-center gap-4 px-5 py-4 ${
        !last ? "border-b border-stone-100" : ""
      }`}
    >
      {/* Icon */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-600">
        {icon}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wider text-stone-400">
          {label}
        </p>

        <p className="mt-0.5 truncate text-sm font-medium text-stone-800">
          {value}
        </p>
      </div>
    </div>
  );
};

export default Profile;

