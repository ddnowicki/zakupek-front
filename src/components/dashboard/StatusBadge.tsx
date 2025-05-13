import React from "react";

interface StatusBadgeProps {
  status: string; // As per plan: `status: string` – tekst statusu.
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  // Basic styling, can be expanded based on specific status values
  let bgColor = "bg-gray-200";
  let textColor = "text-gray-800";

  // Example: Customize based on status text.
  // This might need to be more robust, perhaps using statusId if available and mapping to styles.
  // For now, using the string directly as per the plan.
  if (status.toLowerCase().includes("to buy") || status.toLowerCase().includes("pending")) {
    bgColor = "bg-blue-100";
    textColor = "text-blue-800";
  } else if (status.toLowerCase().includes("bought") || status.toLowerCase().includes("purchased")) {
    bgColor = "bg-green-100";
    textColor = "text-green-800";
  } else if (status.toLowerCase().includes("in cart")) {
    bgColor = "bg-yellow-100";
    textColor = "text-yellow-800";
  }

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor} ${textColor}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
