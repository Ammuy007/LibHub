import React, { useEffect, useState } from "react";
import { Modal } from "../Register/Modal";
import { Input } from "../../ui/Input/Input";
import { Button } from "../../ui/Button/Button";
import { Phone, User, MapPin } from "lucide-react";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: {
        name: string;
        phone: string;
        location: string;
    };
    onSave: (data: { name: string; phone: string; location: string }) => Promise<void>;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
    isOpen,
    onClose,
    initialData,
    onSave,
}) => {
    const [form, setForm] = useState({
        name: initialData.name,
        phone: initialData.phone,
        location: initialData.location,
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setForm({
                name: initialData.name,
                phone: initialData.phone,
                location: initialData.location,
            });
        }
    }, [isOpen, initialData]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave({
                name: form.name,
                phone: form.phone,
                location: form.location,
            });
            onClose();
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            variant="branded"
            title="Edit Profile"
            subtitle="Update your personal information and contact details."
            icon={<User size={18} />}
            footer={
                <div className="flex items-center justify-end gap-3 w-full">
                    <Button variant="outline" onClick={onClose} className="h-10">
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSave} className="h-10 px-8" disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            }
        >
            <div className="space-y-6">
                <Input
                    label="Full Name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    leftIcon={<User size={16} />}
                    placeholder="e.g. Alex Rivera"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Phone Number"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        leftIcon={<Phone size={16} />}
                        placeholder="XXXXXXXXXX"
                    />
                </div>
                <Input
                    label="Address"
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                    leftIcon={<MapPin size={16} />}
                    placeholder="Whitefield, Bengaluru"
                />
                <p className="text-[11px] text-gray-400 font-medium italic">
                    * Your Member ID cannot be changed. If there's an error, please contact the library administrator.
                </p>
            </div>
        </Modal>
    );
};
