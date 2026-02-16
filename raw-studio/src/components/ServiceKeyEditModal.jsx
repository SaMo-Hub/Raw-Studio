"use client";

import Button from "@/components/Button";
import { useEffect, useRef } from "react";
import gsap from "gsap";

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
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
useEffect(() => {
  if (isOpen) {
    gsap.set([overlayRef.current, ], { opacity: 0 });
    gsap.set(contentRef.current, { x: "100%" });

    gsap.to(overlayRef.current, {
      opacity: 1,
      duration: 0.45,
      ease: "power3.out",
    });

    gsap.to(contentRef.current, {
      x: "0%",
      opacity: 1,
      duration: 0.85,
      ease: "expo.out",
    });
  }
}, [isOpen]);


const handleClose = async () => {
  const timeline = gsap.timeline();
  
  timeline.to(contentRef.current, {
    x: "100%",
    duration: 0.45,
    ease: "expo.inOut",
  }, 0);

  timeline.to(overlayRef.current, {
    opacity: 0,
    duration: 0.45,
    ease: "power2.inOut",
  }, 0);

  await timeline;

  onClose();
};

  if (!isOpen) return null;

  return (
    <div
     
      className="fixed inset-0 flex p-4  items-center justify-end z-50"
      onClick={handleClose}
    >
      <div
      
 ref={overlayRef}      className="top-0 left-0 bg-black/50 w-full h-full absolute z-0">

      </div>
      <div
        ref={contentRef}
className="bg-white p-8 z-10 w-full max-w-md translate-x-140  flex flex-col justify-between h-full overflow-y-auto will-change-transform"
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
