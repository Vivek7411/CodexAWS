import React from "react";

export default function Client({
  username,
  permission,
  isYou,
  socketId,
  currentUserPermission,
  onChangePermission,
}) {
  // Only the owner can change others' permissions
  const canChange = currentUserPermission === "owner" && !isYou;

  const getRoleLabel = (perm) => {
    switch (perm) {
      case "owner":
        return "Owner";
      case "edit":
        return "Editor";
      default:
        return "Viewer";
    }
  };

  const getNextPermission = (perm) => {
    // Cycle between read <-> edit (not owner)
    return perm === "edit" ? "read" : "edit";
  };

  return (
    <div className="client flex items-center justify-between bg-[#2c2c2c] p-3 rounded-lg mb-2 text-white">
      <div>
        <span className="font-semibold">
          {username} {isYou && "(You)"}
        </span>
        <span className="ml-2 text-sm text-gray-400">
          {getRoleLabel(permission)}
        </span>
      </div>

      {canChange && permission !== "owner" && (
        <button
          className="bg-emerald-600 px-2 py-1 rounded text-sm hover:bg-emerald-700"
          onClick={() =>
            onChangePermission(socketId, getNextPermission(permission))
          }
        >
          Make {getRoleLabel(getNextPermission(permission))}
        </button>
      )}
    </div>
  );
}
