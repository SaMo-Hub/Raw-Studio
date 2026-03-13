import { useEffect, useRef } from "react";
import gsap from "gsap";
import Button from "./Button";
import ToggleSwitch from "./ToggleSwitch";
import TextField from "./TextField";
import SelectField from "./SelectField";

export default function  EditModal({
  isOpen,
  onClose,
  onSave,
  editingItem,
  editFormData,
  setEditFormData,
  editIsActive,
  setEditIsActive,
  onDelete,
  carouselTypes,
}) {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.set(contentRef.current, { y: "150%" });

      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.45,
        ease: "power3.out",
      });

      gsap.to(contentRef.current, {
        y: "0%",
        duration: 0.85,
        ease: "expo.out",
      });
    }
  }, [isOpen]);

  const handleClose = () => {
    const tl = gsap.timeline({ onComplete: onClose });

    tl.to(contentRef.current, {
      y: "150%",
      duration: 0.45,
      ease: "expo.inOut",
    }, 0);

    tl.to(overlayRef.current, {
      opacity: 0,
      duration: 0.45,
      ease: "power2.inOut",
    }, 0);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/50 z-0"
      />

      {/* Panel */}
      <div
        ref={contentRef}
className="bg-white p-8 w-full max-w-xl -lg ow-2xl overflow-hidden"        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold uppercase">Modifier</h2>
            <Button onClick={handleClose} variant="ghost">×</Button>
          </div>

          <div className="space-y-6">
            {/* Image preview */}
            <div className="grid grid-cols-2 gap-4">
              <img
                src={editingItem.imageUrl}
                alt={editingItem.imageName}
                className="w-full h-full object-cover"
              />
              <div className="text-xs text-gray-500 flex flex-col gap-2">
                <p className="font-medium">{editingItem.imageName}</p>
                <Button variant="secondary">Remplacer l'image</Button>
              </div>
            </div>

            {/* Title */}
            <TextField
              label="TITLE"
              placeholder="Nom de l'image"
              value={editFormData.imageName}
              onChange={(e) => setEditFormData({ ...editFormData, imageName: e.target.value })}
              required
            />

            {/* Type + Client */}
            <div className="grid grid-cols-2 gap-4">
              <SelectField
                label="TYPE*"
                value={editFormData.type}
                onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
                options={Object.entries(carouselTypes).map(([value, label]) => ({ value, label }))}
              />
              <TextField
                label="CLIENT"
                placeholder="Client"
                value={editFormData.client}
                onChange={(e) => setEditFormData({ ...editFormData, client: e.target.value })}
              />
            </div>

            {/* Toggle actif */}
            <div className="flex items-center justify-between border border-gray-300 p-2">
              <label className="text-xs font-medium uppercase">ACTIVATE</label>
              <ToggleSwitch
                isActive={editIsActive}
                onChange={() => setEditIsActive(!editIsActive)}
              />
            </div>

            {/* Danger zone */}
            <div className="flex items-center justify-between pt-4">
              <h3 className="text-xs font-medium uppercase">DANGER ZONE</h3>
              <Button
                onClick={() => onDelete(editingItem.id)}
                size="md"
                variant="danger"
              >
                Supprimer
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 mt-8">
          <Button onClick={handleClose} variant="secondary" className="w-full">
            CANCEL
          </Button>
          <Button onClick={async () => { handleClose(); setTimeout(onSave, 450); }} className="w-full">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}