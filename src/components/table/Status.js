import React from 'react';

const Status = ({ status }) => {
  // Define Tailwind classes for each status
  const statusClasses = {
    Pending: "bg-yellow-100 text-yellow-700", // Yellow background with dark yellow text
    Processing: "bg-blue-100 text-blue-700", // Blue background with dark blue text
    Delivered: "bg-green-100 text-green-700", // Green background with dark green text
    Cancel: "bg-red-100 text-red-700", // Red background with dark red text
  };

  // Default status class (for unknown or unhandled statuses)
  const defaultClass = "bg-gray-100 text-gray-700";

  return (
    <span
      className={`inline-block py-1 px-3 rounded-full text-xs font-medium ${statusClasses[status] || defaultClass}`}
    >
      {status}
    </span>
  );
};

export default Status;
