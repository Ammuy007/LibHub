import React, { useState, useEffect } from "react";
import { UserPlus } from "lucide-react";
import { Modal } from "../Register/Modal";
import { Input } from "../../ui/Input/Input";
import { Button } from "../../ui/Button/Button";

interface EditMemberModalProps {
    isOpen: boolean;

    onClose: () => void;
    onSave: (updatedData: any) => void;
    initialData: {
        name: string;
        email: string;
        phone: string;
        address: string;
    };
}

export const EditMemberModal: React.FC<EditMemberModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialData,
}) => {
    // Internal state to manage form inputs
    const [formData, setFormData] = useState(initialData);

    // Sync internal state if initialData changes (e.g., when switching members)
    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        // Pass the edited data back to the parent page
        onSave(formData);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Member Profile"
            icon={<UserPlus size={18} className="text-white" />}
            variant="branded"
            footer={
                <div className="flex items-center justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>
                        Save Changes
                    </Button>
                </div>
            }
        >
            <div className="space-y-4">
                <Input
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    labelClassName="text-xs font-semibold text-gray-700"
                    className="h-10 text-sm"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        labelClassName="text-xs font-semibold text-gray-700"
                        className="h-10 text-sm"
                    />
                    <Input
                        label="Phone Number"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        labelClassName="text-xs font-semibold text-gray-700"
                        className="h-10 text-sm"
                    />
                </div>

                <Input
                    label="Home Address"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    labelClassName="text-xs font-semibold text-gray-700"
                    className="h-10 text-sm"
                />
            </div>
        </Modal>
    );
};