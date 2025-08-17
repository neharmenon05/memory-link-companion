import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PinLoginProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PinLogin({ isOpen, onSuccess, onCancel }: PinLoginProps) {
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (pin === '1234') {
      toast({
        title: "Access Granted",
        description: "Welcome to caregiver mode",
      });
      onSuccess();
      setPin('');
    } else {
      toast({
        title: "Access Denied",
        description: "Incorrect PIN. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-card to-secondary/20 backdrop-blur-sm border-primary/20">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-semibold text-foreground">
            Caregiver Access
          </DialogTitle>
          <p className="text-muted-foreground">
            Enter your PIN to access caregiver controls
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Enter 4-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="pl-10 text-center text-lg font-mono tracking-widest h-12"
              maxLength={4}
              autoFocus
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading || pin.length !== 4}
            >
              {isLoading ? "Verifying..." : "Access"}
            </Button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            For patient access, close this dialog
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}