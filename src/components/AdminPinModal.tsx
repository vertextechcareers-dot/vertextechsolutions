import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AdminPinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPinModal = ({ isOpen, onClose }: AdminPinModalProps) => {
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const handleComplete = (pin: string) => {
    if (pin === "3381") {
      sessionStorage.setItem('isAdmin', 'true');
      toast.success("Access Granted");
      onClose();
      navigate('/admin');
    } else {
      toast.error("Invalid PIN");
      setValue("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold font-heading">Admin Access</DialogTitle>
          <DialogDescription className="text-center">
            Please enter the administrator PIN code to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-6">
          <InputOTP
            maxLength={4}
            value={value}
            onChange={(val) => {
              setValue(val);
              if (val.length === 4) {
                handleComplete(val);
              }
            }}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className="w-12 h-14 text-xl border-brand-navy/20" />
              <InputOTPSlot index={1} className="w-12 h-14 text-xl border-brand-navy/20" />
              <InputOTPSlot index={2} className="w-12 h-14 text-xl border-brand-navy/20" />
              <InputOTPSlot index={3} className="w-12 h-14 text-xl border-brand-navy/20" />
            </InputOTPGroup>
          </InputOTP>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPinModal;
