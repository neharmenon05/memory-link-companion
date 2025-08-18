import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Search, Filter } from 'lucide-react';
import { storageManager, Person } from '@/lib/storage';
import { PersonCard } from './PersonCard';
import { AddPersonDialog } from './AddPersonDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PeopleManagementProps {
  isCaregiver?: boolean;
}

export function PeopleManagement({ isCaregiver = false }: PeopleManagementProps) {
  const [people, setPeople] = useState<Person[]>([]);
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending'>('all');

  const loadPeople = () => {
    const allPeople = storageManager.getPeople();
    const visiblePeople = isCaregiver ? allPeople : allPeople.filter(p => p.status === 'approved');
    setPeople(visiblePeople);
  };

  useEffect(() => {
    loadPeople();
  }, [isCaregiver]);

  useEffect(() => {
    let filtered = people;

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(person =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.relation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(person => person.status === statusFilter);
    }

    setFilteredPeople(filtered);
  }, [people, searchTerm, statusFilter]);

  const handlePersonAdded = () => {
    loadPeople();
  };

  const getStatusCounts = () => {
    const approved = people.filter(p => p.status === 'approved').length;
    const pending = people.filter(p => p.status === 'pending').length;
    return { approved, pending, total: people.length };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              People Management
              <Badge variant="secondary">{statusCounts.total}</Badge>
            </CardTitle>
            
            <AddPersonDialog
              trigger={
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Person
                </Button>
              }
              onPersonAdded={handlePersonAdded}
              isCaregiver={isCaregiver}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-success/10 rounded-lg">
              <div className="text-2xl font-bold text-success">{statusCounts.approved}</div>
              <div className="text-sm text-muted-foreground">Approved</div>
            </div>
            {isCaregiver && (
              <div className="text-center p-3 bg-warning/10 rounded-lg">
                <div className="text-2xl font-bold text-warning">{statusCounts.pending}</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
            )}
            <div className="text-center p-3 bg-primary/10 rounded-lg">
              <div className="text-2xl font-bold text-primary">{statusCounts.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search people..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {isCaregiver && (
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>

      {/* People Grid */}
      {filteredPeople.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">
                {people.length === 0 ? 'No People Added' : 'No Results Found'}
              </h3>
              <p className="text-sm mb-4">
                {people.length === 0 
                  ? 'Start by adding people to enable face recognition features.' 
                  : 'Try adjusting your search or filter criteria.'
                }
              </p>
              {people.length === 0 && (
                <AddPersonDialog
                  trigger={
                    <Button>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add First Person
                    </Button>
                  }
                  onPersonAdded={handlePersonAdded}
                  isCaregiver={isCaregiver}
                />
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPeople.map((person) => (
            <PersonCard
              key={person.id}
              person={person}
              isPatientMode={!isCaregiver}
            />
          ))}
        </div>
      )}
    </div>
  );
}