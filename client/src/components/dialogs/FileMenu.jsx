import React, { useRef } from "react";
import {
  File,
  FileAudio,
  FileImage,
  FileVideo,
  Upload,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  setIsFileMenu,
  setIsLoadingLoader,
} from "../../../redux/reducers/misc";

import { useSendAttachmentsMutation } from "../../../redux/api/api";

const FileMenu = ({ anchorE1, chatId }) => {
  const { isFileMenu } = useSelector((state) => state.misc);

  const dispatch = useDispatch();

  const imageRef = useRef(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const fileRef = useRef(null);

  const [sendAttachments] = useSendAttachmentsMutation();

  const closeFileMenu = () => {
    dispatch(setIsFileMenu(false));
  };

  const selectImage = () => {
    imageRef.current?.click();
  };

  const selectAudio = () => {
    audioRef.current?.click();
  };

  const selectVideo = () => {
    videoRef.current?.click();
  };

  const selectFile = () => {
    fileRef.current?.click();
  };

  const fileChangeHandler = async (e, key) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    // Correctly check the number of selected files
    if (files.length > 5) {
      toast.error(`You can only send 5 ${key} at a time`);

      // Reset input so the same files can be selected again
      e.target.value = "";
      return;
    }

    dispatch(setIsLoadingLoader(true));

    const toastId = toast.loading(`Sending ${key.toLowerCase()}...`);

    closeFileMenu();

    try {
      const myForm = new FormData();

      myForm.append("chatId", chatId);

      files.forEach((file) => {
        myForm.append("files", file);
      });

      const res = await sendAttachments(myForm);

      if (res.data) {
        toast.success(
          `${key} sent successfully`,
          {
            id: toastId,
          }
        );
      } else {
        toast.error(
          `Failed to send ${key.toLowerCase()}`,
          {
            id: toastId,
          }
        );
      }
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          `Failed to send ${key.toLowerCase()}`,
        {
          id: toastId,
        }
      );
    } finally {
      dispatch(setIsLoadingLoader(false));

      // Allow selecting the same file again
      e.target.value = "";
    }
  };

  // Don't render anything until the menu is opened.
  if (!isFileMenu) return null;

  /*
   * The old MUI Menu used anchorEl for positioning.
   * We keep anchorE1 as a prop, but position the menu
   * relative to the attachment button when possible.
   */
  const rect = anchorE1?.getBoundingClientRect?.();

  const menuStyle = rect
    ? {
        position: "fixed",
        left: Math.max(12, rect.left),
        bottom: window.innerHeight - rect.top + 8,
      }
    : {
        position: "fixed",
        left: 16,
        bottom: 80,
      };

  const menuItems = [
    {
      label: "Image",
      description: "PNG, JPG, GIF",
      icon: FileImage,
      iconClass: "bg-blue-50 text-blue-600",
      onClick: selectImage,
      inputRef: imageRef,
      accept: "image/png,image/jpeg,image/gif",
      key: "Images",
    },
    {
      label: "Audio",
      description: "MP3, WAV",
      icon: FileAudio,
      iconClass: "bg-violet-50 text-violet-600",
      onClick: selectAudio,
      inputRef: audioRef,
      accept: "audio/mpeg,audio/wav",
      key: "Audios",
    },
    {
      label: "Video",
      description: "MP4, WebM, OGG",
      icon: FileVideo,
      iconClass: "bg-rose-50 text-rose-600",
      onClick: selectVideo,
      inputRef: videoRef,
      accept: "video/mp4,video/webm,video/ogg",
      key: "Videos",
    },
    {
      label: "File",
      description: "Any file type",
      icon: File,
      iconClass: "bg-emerald-50 text-emerald-600",
      onClick: selectFile,
      inputRef: fileRef,
      accept: "*",
      key: "Files",
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close attachment menu"
        onClick={closeFileMenu}
        className="fixed inset-0 z-[90] cursor-default bg-transparent"
      />

      {/* Attachment Menu */}
      <div
        style={menuStyle}
        className="
          z-[100]
          w-[250px]
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-2
          shadow-[0_15px_45px_rgba(15,23,42,0.14)]
          animate-in
          fade-in
          slide-in-from-bottom-2
          duration-200
        "
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-3 pb-2 pt-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Upload size={18} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Attach files
            </p>

            <p className="text-[11px] text-slate-400">
              Up to 5 files at a time
            </p>
          </div>
        </div>

        <div className="my-1 h-px bg-slate-100" />

        {/* Options */}
        <div className="space-y-1">
          {menuItems.map(
            ({
              label,
              description,
              icon: Icon,
              iconClass,
              onClick,
              inputRef,
              accept,
              key,
            }) => (
              <button
                key={label}
                type="button"
                onClick={onClick}
                className="
                  group
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  px-2.5
                  py-2.5
                  text-left
                  transition-all
                  duration-150
                  hover:bg-slate-50
                  active:scale-[0.98]
                "
              >
                {/* Icon */}
                <span
                  className={`
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    transition-transform
                    duration-200
                    group-hover:scale-105
                    ${iconClass}
                  `}
                >
                  <Icon size={19} />
                </span>

                {/* Text */}
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-slate-700">
                    {label}
                  </span>

                  <span className="block truncate text-[11px] text-slate-400">
                    {description}
                  </span>
                </span>

                {/* Hidden input */}
                <input
                  ref={inputRef}
                  type="file"
                  multiple
                  accept={accept}
                  className="hidden"
                  onChange={(e) =>
                    fileChangeHandler(e, key)
                  }
                />
              </button>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default FileMenu;

