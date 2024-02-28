import React from "react";

const UnauthorizedAccess: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white p-5 rounded-lg shadow-lg max-w-sm">
        <p className="text-gray-700 text-center">
          You are not authorised to view this
        </p>
      </div>
    </div>
  );
};

export default UnauthorizedAccess;
