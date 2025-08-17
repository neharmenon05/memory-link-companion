import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Shield, User, Heart } from 'lucide-react';

interface HeaderProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  userMode: 'patient' | 'caregiver';
  onModeToggle: () => void;
}

export function Header({ currentLanguage, onLanguageChange, userMode, onModeToggle }: HeaderProps) {
  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">
            AI Health Companion
          </h1>
        </div>

        <div className="flex items-center gap-2 ml-6">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <Select value={currentLanguage} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-32 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="de">Deutsch</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50">
          {userMode === 'caregiver' ? (
            <Shield className="w-4 h-4 text-primary" />
          ) : (
            <User className="w-4 h-4 text-accent" />
          )}
          <span className="text-sm font-medium capitalize">
            {userMode} Mode
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onModeToggle}
          className="h-9"
        >
          {userMode === 'patient' ? 'Caregiver Access' : 'Patient Mode'}
        </Button>
      </div>
    </header>
  );
}