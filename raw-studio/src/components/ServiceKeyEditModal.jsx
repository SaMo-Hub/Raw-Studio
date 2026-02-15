"use client";

import Button from "@/components/Button";

export default function ServiceKeyEditModal({
  isOpen,
  onClose,
  onSave,
  keyId,
  name,
  password,
  description,
  role,
  onNameChange,
  onPasswordChange,
  onDescriptionChange,
  onRoleChange,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex p-4 items-center justify-end z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 w-full max-w-md flex flex-col justify-between h-full overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className=" h-full">

      
        <h2 className="text-xl font-bold mb-6 uppercase">Edit password</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-2 uppercase">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-2 uppercase">
              Password
            </label>
            <input
              type="text"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-2 uppercase">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-2 uppercase">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => onRoleChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="SERVICE">Service</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
            </div>
               </div>
          <div className="flex gap-3 ">
           
            <Button
              onClick={onClose}
              variant="secondary"
              className="w-full"
            >
              Cancel
            </Button>
             <Button onClick={() => onSave(keyId) } className="w-full">
              Save
            </Button>
          </div>
     
      </div>
    </div>
  );
}
