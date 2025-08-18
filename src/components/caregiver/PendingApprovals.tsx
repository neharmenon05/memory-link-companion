import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle, XCircle, Clock, User } from 'lucide-react';
import { storageManager, Person } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface PendingApprovalsProps {
  onUpdate?: () => void;
}

export function PendingApprovals({ onUpdate }: PendingApprovalsProps) {
  const [pendingPeople, setPendingPeople] = useState<Person[]>([]);
  const { toast } = useToast();

  const loadPendingPeople = () => {
    const people = storageManager.getPeople().filter(p => p.status === 'pending');
    setPendingPeople(people);
  };

  useEffect(() => {
    loadPendingPeople();
  }, []);

  const handleApproval = (personId: string, approved: boolean) => {
    if (approved) {
      const updatedPerson = storageManager.updatePerson(personId, { status: 'approved' });
      if (updatedPerson) {
        toast({
          title: "Person Approved",
          description: `${updatedPerson.name} has been approved and is now available for recognition.`,
          variant: "default"
        });
      }
    } else {
      const success = storageManager.deletePerson(personId);
      if (success) {
        toast({
          title: "Person Rejected",
          description: "The person has been removed from the system.",
          variant: "default"
        });
      }
    }
    
    loadPendingPeople();
    onUpdate?.();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (pendingPeople.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Pending Approvals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No pending approvals</p>
            <p className="text-sm">All people have been reviewed.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Pending Approvals
          <Badge variant="secondary">{pendingPeople.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {pendingPeople.map((person) => (
          <div
            key={person.id}
            className="flex items-start gap-4 p-4 border border-warning/20 bg-warning/5 rounded-lg"
          >
            <Avatar className="w-12 h-12">
              <AvatarImage src={person.photo} alt={person.name} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(person.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-foreground">{person.name}</h4>
                <Badge variant="outline" className="text-xs">
                  Pending
                </Badge>
              </div>
              
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                <User className="w-3 h-3" />
                <span>{person.relation}</span>
              </div>

              {person.notes && (
                <p className="text-sm text-muted-foreground mb-2">
                  {person.notes}
                </p>
              )}

              <p className="text-xs text-muted-foreground">
                Added: {new Date(person.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleApproval(person.id, true)}
                className="bg-success hover:bg-success/90"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleApproval(person.id, false)}
              >
                <XCircle className="w-4 h-4 mr-1" />
                Reject
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}