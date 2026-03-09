import React from "react";
import { Modal } from "../Register/Modal";
import { Input } from "../../ui/Input/Input";
import { Button } from "../../ui/Button/Button";
import { Mail, Phone, User, MapPin } from "lucide-react";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: {
        name: string;
        email: string;
        phone: string;
        location: string;
    };
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
    isOpen,
    onClose,
    initialData,
}) => {
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
                    <Button variant="primary" onClick={onClose} className="h-10 px-8">
                        Save Changes
                    </Button>
                </div>
            }
        >
            <div className="space-y-6">
                <Input
                    label="Full Name"
                    defaultValue={initialData.name}
                    leftIcon={<User size={16} />}
                    placeholder="e.g. Alex Rivera"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Email Address"
                        type="email"
                        defaultValue={initialData.email}
                        leftIcon={<Mail size={16} />}
                        placeholder="alex.rivera@example.com"
                    />
                    <Input
                        label="Phone Number"
                        type="tel"
                        defaultValue={initialData.phone}
                        leftIcon={<Phone size={16} />}
                        placeholder="XXXXXXXXXX"
                    />
                </div>
                <Input
                    label="Address"
                    defaultValue={initialData.location}
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
