import { Link } from "react-router-dom";
import { Bell, MousePointer } from "lucide-react";

interface AlertNotificationProps {
  hasAlerts: boolean;
}

const AlertNotification = ({ hasAlerts }: AlertNotificationProps) => {
  return (
    <Link
      to="/alerts"
      className={`absolute -top-4 right-0 flex items-center gap-2 text-primary hover:text-primary/80 transition-colors ${
        hasAlerts ? "animate-pulse" : ""
      }`}
    >
      <Bell className={`w-5 h-5 ${hasAlerts ? "text-blue-500" : ""}`} />
      <span className="text-sm whitespace-nowrap">Create Custom Alerts </span>
    </Link>
  );
};

export default AlertNotification;
