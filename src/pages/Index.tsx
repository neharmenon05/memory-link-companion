import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { PinLogin } from '@/components/auth/PinLogin';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { VoiceAssistant } from '@/components/voice/VoiceAssistant';
import { PersonCard } from '@/components/people/PersonCard';
import { HealthMetrics } from '@/components/health/HealthMetrics';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Heart, FileText, Camera, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { storageManager, type Person, type HealthMetric } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

type UserMode = 'patient' | 'caregiver';

const Index = () => {
  const [userMode, setUserMode] = useState<UserMode>('patient');
  const [showPinLogin, setShowPinLogin] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [people, setPeople] = useState<Person[]>([]);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [recentRecognition, setRecentRecognition] = useState<Person | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load data from local storage
    const loadedPeople = storageManager.getPeople();
    const loadedMetrics = storageManager.getHealthMetrics();
    const settings = storageManager.getSettings();
    
    setPeople(loadedPeople);
    setHealthMetrics(loadedMetrics);
    setCurrentLanguage(settings.language);
  }, []);

  const handleModeToggle = () => {
    if (userMode === 'patient') {
      setShowPinLogin(true);
    } else {
      setUserMode('patient');
      toast({
        title: "Switched to Patient Mode",
        description: "Simple interface activated",
      });
    }
  };

  const handlePinSuccess = () => {
    setUserMode('caregiver');
    setShowPinLogin(false);
    toast({
      title: "Caregiver Mode Activated",
      description: "Full controls now available",
    });
  };

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
    const settings = storageManager.getSettings();
    storageManager.saveSettings({ ...settings, language });
  };

  // Simulate face recognition
  const simulateFaceRecognition = () => {
    const recognizedPeople = people.filter(p => p.status === 'approved');
    if (recognizedPeople.length > 0) {
      const randomPerson = recognizedPeople[Math.floor(Math.random() * recognizedPeople.length)];
      setRecentRecognition(randomPerson);
      
      // Update last met timestamp
      const updatedPerson = storageManager.updatePerson(randomPerson.id, {
        lastMet: new Date().toISOString()
      });
      
      if (updatedPerson) {
        setPeople(storageManager.getPeople());
        toast({
          title: "Person Recognized!",
          description: `Hello ${randomPerson.name}!`,
        });
      }
    } else {
      toast({
        title: "No People Registered",
        description: "Add some people to the system first",
      });
    }
  };

  const getPendingCount = () => people.filter(p => p.status === 'pending').length;
  const getApprovedCount = () => people.filter(p => p.status === 'approved').length;
  const getCriticalHealthCount = () => healthMetrics.filter(m => m.status === 'critical').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        userMode={userMode}
        onModeToggle={handleModeToggle}
      />

      <main className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Recent Recognition Alert */}
        {recentRecognition && (
          <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-success" />
              <div>
                <h3 className="font-semibold text-success">Person Recognized!</h3>
                <p className="text-sm text-success/80">
                  {recentRecognition.name} ({recentRecognition.relation}) - Last seen: {new Date(recentRecognition.lastMet || '').toLocaleString()}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRecentRecognition(null)}
                className="ml-auto"
              >
                ×
              </Button>
            </div>
          </div>
        )}

        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title="People Recognized"
            description="Manage facial recognition database"
            icon={Users}
            action={{
              label: userMode === 'patient' ? 'View People' : 'Manage People',
              onClick: () => toast({ title: "People management opened" }),
              variant: "default"
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-success">
                {getApprovedCount()} Approved
              </Badge>
              {userMode === 'caregiver' && getPendingCount() > 0 && (
                <Badge variant="outline" className="text-warning">
                  {getPendingCount()} Pending
                </Badge>
              )}
            </div>
          </DashboardCard>

          <DashboardCard
            title="Health Status"
            description="Monitor vital signs and wellness"
            icon={Heart}
            action={{
              label: "View Health Data",
              onClick: () => toast({ title: "Health dashboard opened" }),
              variant: "default"
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              {getCriticalHealthCount() > 0 ? (
                <Badge variant="outline" className="text-destructive">
                  {getCriticalHealthCount()} Critical
                </Badge>
              ) : (
                <Badge variant="outline" className="text-success">
                  All Normal
                </Badge>
              )}
            </div>
          </DashboardCard>

          <DashboardCard
            title="Medical Reports"
            description="Store prescriptions and lab results"
            icon={FileText}
            action={{
              label: userMode === 'patient' ? 'View Reports' : 'Manage Reports',
              onClick: () => toast({ title: "Medical reports opened" }),
              variant: "outline"
            }}
          >
            <div className="text-sm text-muted-foreground">
              {storageManager.getMedicalReports().length} documents stored
            </div>
          </DashboardCard>

          <DashboardCard
            title="Face Recognition"
            description="Test live recognition system"
            icon={Camera}
            action={{
              label: "Test Recognition",
              onClick: simulateFaceRecognition,
              variant: "secondary"
            }}
          >
            <div className="text-sm text-muted-foreground">
              Camera ready for detection
            </div>
          </DashboardCard>
        </div>

        {/* Health Metrics Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Health Overview</h2>
            {getCriticalHealthCount() > 0 && (
              <Badge variant="destructive" className="ml-auto">
                <AlertCircle className="w-3 h-3 mr-1" />
                Attention Needed
              </Badge>
            )}
          </div>
          <HealthMetrics 
            metrics={healthMetrics.map(m => ({
              ...m,
              lastUpdated: m.timestamp
            }))} 
          />
        </div>

        {/* Recent People Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Recent People</h2>
            {userMode === 'caregiver' && getPendingCount() > 0 && (
              <Badge variant="outline" className="text-warning ml-auto">
                <Clock className="w-3 h-3 mr-1" />
                {getPendingCount()} Pending Approval
              </Badge>
            )}
          </div>
          
          {people.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No People Added Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by adding family members, caregivers, or friends to the recognition system
              </p>
              <Button onClick={() => toast({ title: "Add person dialog would open" })}>
                Add First Person
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {people
                .filter(person => userMode === 'caregiver' || person.status === 'approved')
                .slice(0, 6)
                .map((person) => (
                  <PersonCard
                    key={person.id}
                    person={person}
                    isPatientMode={userMode === 'patient'}
                    onEdit={() => toast({ title: `Editing ${person.name}` })}
                  />
                ))}
            </div>
          )}
        </div>

        {/* Reminders Section for Patient Mode */}
        {userMode === 'patient' && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground">Today's Reminders</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-info/10 border border-info/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-info" />
                  <span className="font-medium text-info">2:00 PM</span>
                </div>
                <p className="text-sm text-foreground">Take afternoon medication</p>
              </div>
              
              <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-accent" />
                  <span className="font-medium text-accent">4:00 PM</span>
                </div>
                <p className="text-sm text-foreground">Doctor appointment reminder</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <VoiceAssistant />
      
      <PinLogin
        isOpen={showPinLogin}
        onSuccess={handlePinSuccess}
        onCancel={() => setShowPinLogin(false)}
      />
    </div>
  );
};

export default Index;
