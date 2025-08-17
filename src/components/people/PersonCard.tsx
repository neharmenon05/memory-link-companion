import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, User, Edit, Clock } from 'lucide-react';

interface PersonCardProps {
  person: {
    id: string;
    name: string;
    relation: string;
    lastMet?: string;
    notes?: string;
    photo?: string;
    status?: 'approved' | 'pending';
  };
  onEdit?: () => void;
  isPatientMode?: boolean;
}

export function PersonCard({ person, onEdit, isPatientMode = false }: PersonCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatLastMet = (date?: string) => {
    if (!date) return 'No record';
    return new Date(date).toLocaleDateString();
  };

  return (
    <Card className="bg-gradient-to-br from-card to-secondary/10 border-primary/10 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16 border-2 border-primary/20">
            <AvatarImage src={person.photo} alt={person.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
              {getInitials(person.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-semibold text-foreground truncate">
                {person.name}
              </h3>
              {person.status === 'pending' && (
                <Badge variant="outline" className="text-xs">
                  Pending
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-1 text-muted-foreground mb-2">
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">{person.relation}</span>
            </div>

            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                Last met: {formatLastMet(person.lastMet)}
              </span>
            </div>
          </div>

          {!isPatientMode && onEdit && (
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      {person.notes && (
        <CardContent className="pt-0">
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Notes
              </span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {person.notes}
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}