import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { PinLogin } from '@/components/auth/PinLogin';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { VoiceAssistant } from '@/components/voice/VoiceAssistant';
import { PersonCard } from '@/components/people/PersonCard';
import { HealthMetrics } from '@/components/health/HealthMetrics';
import { FaceRecognition } from '@/components/face/FaceRecognition';
import { PeopleManagement } from '@/components/people/PeopleManagement';
import { AddHealthMetricDialog } from '@/components/health/AddHealthMetricDialog';
import { PendingApprovals } from '@/components/caregiver/PendingApprovals';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Heart, FileText, Camera, AlertCircle, Clock, CheckCircle, Activity, UserCheck, ArrowLeft } from 'lucide-react';
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
  const [activeView, setActiveView] = useState<'dashboard' | 'people' | 'health' | 'camera' | 'reports' | 'approvals'>('dashboard');
  const { toast } = useToast();

  const loadData = () => {
    const loadedPeople = storageManager.getPeople();
    const loadedMetrics = storageManager.getHealthMetrics();
    setPeople(loadedPeople);
    setHealthMetrics(loadedMetrics);
  };

  useEffect(() => {
    // Load data from local storage
    loadData();
    const settings = storageManager.getSettings();
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
        {/* Navigation Header */}
        {activeView !== 'dashboard' && (
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => setActiveView('dashboard')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        )}

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

        {activeView === 'dashboard' && (
          <>
            {/* Dashboard Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <DashboardCard
                title="People"
                description="Manage facial recognition database"
                icon={Users}
                action={{
                  label: userMode === 'patient' ? 'View People' : 'Manage People',
                  onClick: () => setActiveView('people'),
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
                  onClick: () => setActiveView('health'),
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
                title="Face Recognition"
                description="Live camera recognition system"
                icon={Camera}
                action={{
                  label: "Open Camera",
                  onClick: () => setActiveView('camera'),
                  variant: "secondary"
                }}
              >
                <div className="text-sm text-muted-foreground">
                  Camera ready for detection
                </div>
              </DashboardCard>

              {userMode === 'caregiver' && (
                <DashboardCard
                  title="Pending Approvals"
                  description="Review new people added"
                  icon={UserCheck}
                  action={{
                    label: "Review Approvals",
                    onClick: () => setActiveView('approvals'),
                    variant: "outline"
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-warning">
                      {getPendingCount()} Pending
                    </Badge>
                  </div>
                </DashboardCard>
              )}
            </div>

            {/* Health Metrics Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Heart className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-semibold text-foreground">Health Overview</h2>
                  {getCriticalHealthCount() > 0 && (
                    <Badge variant="destructive">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Attention Needed
                    </Badge>
                  )}
                </div>
                {userMode === 'caregiver' && (
                  <AddHealthMetricDialog onMetricAdded={loadData} />
                )}
              </div>
              
              {healthMetrics.length > 0 ? (
                <HealthMetrics 
                  metrics={healthMetrics.map(m => ({
                    ...m,
                    lastUpdated: m.timestamp
                  }))} 
                />
              ) : (
                <Card>
                  <CardContent className="py-12">
                    <div className="text-center text-muted-foreground">
                      <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No Health Metrics</h3>
                      <p className="text-sm mb-4">
                        {userMode === 'caregiver' 
                          ? 'Add health measurements to start tracking.' 
                          : 'Your caregiver will add health data for monitoring.'
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
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
                <Card>
                  <CardContent className="py-12">
                    <div className="text-center text-muted-foreground">
                      <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No People Added Yet</h3>
                      <p className="text-sm mb-4">
                        Start by adding family members, caregivers, or friends to the recognition system
                      </p>
                      <Button onClick={() => setActiveView('people')}>
                        Add First Person
                      </Button>
                    </div>
                  </CardContent>
                </Card>
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
          </>
        )}

        {/* People Management View */}
        {activeView === 'people' && (
          <PeopleManagement isCaregiver={userMode === 'caregiver'} />
        )}

        {/* Health Management View */}
        {activeView === 'health' && (
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Health Metrics
                </CardTitle>
                {userMode === 'caregiver' && (
                  <AddHealthMetricDialog onMetricAdded={loadData} />
                )}
              </CardHeader>
              <CardContent>
                {healthMetrics.length > 0 ? (
                  <HealthMetrics 
                    metrics={healthMetrics.map(m => ({
                      ...m,
                      lastUpdated: m.timestamp
                    }))} 
                  />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No health metrics recorded yet</p>
                    {userMode === 'caregiver' && (
                      <p className="text-sm">Add some health measurements to get started.</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Face Recognition View */}
        {activeView === 'camera' && (
          <FaceRecognition isCaregiver={userMode === 'caregiver'} />
        )}

        {/* Caregiver Approvals View */}
        {userMode === 'caregiver' && activeView === 'approvals' && (
          <PendingApprovals onUpdate={loadData} />
        )}

        {/* Reports View */}
        {activeView === 'reports' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Medical Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Medical reports feature coming soon</p>
                  <p className="text-sm">Upload and manage prescriptions, lab results, and medical documents.</p>
                </div>
              </CardContent>
            </Card>
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
