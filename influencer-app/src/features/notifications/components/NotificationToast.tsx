import { useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { hideNotification } from "../slice/Notification.slice";

function NotificationToast() {
  const dispatch = useAppDispatch();
  const { isVisible, type, title, message } = useAppSelector(
    (state) => state.notification
  );

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        dispatch(hideNotification());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, dispatch]);

  if (!isVisible) return null;

  const handleClose = () => {
    dispatch(hideNotification());
  };

  const bgColor =
    type === "success"
      ? "bg-green-50 border-green-600"
      : type === "error"
      ? "bg-red-50 border-red-600"
      : type === "warning"
      ? "bg-yellow-50 border-yellow-600"
      : "bg-blue-50 border-blue-600";

  const textColor =
    type === "success"
      ? "text-green-600"
      : type === "error"
      ? "text-red-600"
      : type === "warning"
      ? "text-yellow-600"
      : "text-blue-600";

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[1000] w-full max-w-sm">
      <div
        className={`${bgColor} shadow-lg rounded-md p-4 border-l-4 flex animate-slide-up`}
      >
        <div className="flex-1">
          <div className="flex items-center">
            <div className={`${textColor} font-bold text-sm`}>{title}</div>
          </div>
          {message && (
            <div className="mt-1 text-sm text-gray-600">{message}</div>
          )}
        </div>
        <button
          onClick={handleClose}
          className={`${textColor} hover:opacity-75 self-start`}
          aria-label="Close notification"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

export default NotificationToast;
