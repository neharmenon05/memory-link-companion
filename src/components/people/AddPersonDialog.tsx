import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Upload, UserPlus, X } from 'lucide-react';
import { storageManager, Person } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface AddPersonDialogProps {
  trigger: React.ReactNode;
  onPersonAdded?: (person: Person) => void;
  isCaregiver?: boolean;
}

export function AddPersonDialog({ trigger, onPersonAdded, isCaregiver = false }: AddPersonDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    relation: '',
    notes: '',
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const relations = [
    'Family Member', 'Son', 'Daughter', 'Spouse', 'Parent', 'Sibling',
    'Friend', 'Doctor', 'Nurse', 'Caregiver', 'Neighbor', 'Other'
  ];

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Name is required",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      let photoUrl = '';
      if (photoFile) {
        photoUrl = await storageManager.saveFile(photoFile, 'photos');
      }

      const newPerson = storageManager.addPerson({
        name: formData.name.trim(),
        relation: formData.relation || 'Other',
        notes: formData.notes.trim(),
        photo: photoUrl,
        status: isCaregiver ? 'approved' : 'pending'
      });

      toast({
        title: "Success",
        description: isCaregiver 
          ? "Person added successfully" 
          : "Person added for caregiver approval",
        variant: "default"
      });

      onPersonAdded?.(newPerson);
      setOpen(false);
      
      // Reset form
      setFormData({ name: '', relation: '', notes: '' });
      setPhotoFile(null);
      setPhotoPreview('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add person",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Add New Person
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Photo Upload */}
          <div className="space-y-2">
            <Label>Photo</Label>
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={photoPreview} />
                <AvatarFallback>
                  <Camera className="w-6 h-6 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo
                </Button>
                
                {photoFile && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {photoFile.name}
                    </Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removePhoto}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter person's name"
              required
            />
          </div>

          {/* Relation */}
          <div className="space-y-2">
            <Label>Relation</Label>
            <Select 
              value={formData.relation} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, relation: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                {relations.map((relation) => (
                  <SelectItem key={relation} value={relation}>
                    {relation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Add any notes or context about this person..."
              rows={3}
            />
          </div>

          {!isCaregiver && (
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
              <p className="text-sm text-warning-foreground">
                This person will be added for caregiver approval before being saved permanently.
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Adding...' : 'Add Person'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}