import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X, Check } from "lucide-react";
import { AVATAR_OPTIONS } from "../../utils/avatar";

interface AvatarSelectionModalProps {
  isOpen: boolean;
  currentAvatar?: string;
  onClose: () => void;
  onSave: (avatar: string) => Promise<void>;
}

// Tailwind classes for nice colorful backgrounds correlating to the index
const BG_COLORS = [
  "bg-blue-500",
  "bg-yellow-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-red-500",
  "bg-orange-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-rose-500",
  "bg-amber-500",
];

export function AvatarSelectionModal({
  isOpen,
  currentAvatar,
  onClose,
  onSave,
}: AvatarSelectionModalProps) {
  const { t } = useTranslation();
  // Store the integer string ID of the avatar
  const [selectedId, setSelectedId] = useState<string>(() => {
    if (!currentAvatar) return "1";
    // Check if the currentAvatar is a string emoji (for legacy compatibility)
    if (isNaN(Number(currentAvatar))) {
      const idx = AVATAR_OPTIONS.indexOf(currentAvatar);
      return idx >= 0 ? String(idx + 1) : "1";
    }
    return currentAvatar;
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (currentAvatar) {
        if (isNaN(Number(currentAvatar))) {
          const idx = AVATAR_OPTIONS.indexOf(currentAvatar);
          setSelectedId(idx >= 0 ? String(idx + 1) : "1");
        } else {
          setSelectedId(currentAvatar);
        }
      } else {
        setSelectedId("1");
      }
    }
  }, [isOpen, currentAvatar]);

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave(selectedId);
      onClose();
    } catch (error) {
      console.error("Failed to save avatar", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div
        className="bg-card border border-border rounded-xl w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold flex items-center gap-2">
            🖼️ {t("profile.selectAvatar") || "Select Avatar"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
            disabled={isSaving}
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-4 sm:grid-cols-4 gap-4">
            {AVATAR_OPTIONS.map((avatar, index) => {
              const avatarId = String(index + 1);
              const isSelected = selectedId === avatarId;
              const bgColor = BG_COLORS[index % BG_COLORS.length];

              return (
                <button
                  key={avatarId}
                  onClick={() => setSelectedId(avatarId)}
                  className={`
                    relative group aspect-square rounded-2xl flex items-center justify-center text-4xl transition-all duration-200
                    ${bgColor} 
                    ${isSelected ? "ring-4 ring-primary ring-offset-4 ring-offset-card scale-105 shadow-lg shadow-primary/20" : "hover:scale-105 hover:shadow-md opacity-80 hover:opacity-100 cursor-pointer"}
                  `}
                >
                  {avatar}

                  {isSelected && (
                    <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1 shadow-sm">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6 border-t border-border flex justify-end gap-3 bg-secondary/10">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-medium text-muted-foreground hover:bg-secondary transition-colors"
            disabled={isSaving}
          >
            {t("common.cancel") || "Cancel"}
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t("common.loading") || "Saving..."}
              </>
            ) : (
              t("common.save") || "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
