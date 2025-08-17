// Local storage utilities for the AI Health Companion System

export interface Person {
  id: string;
  name: string;
  relation: string;
  notes?: string;
  photo?: string;
  faceEncoding?: number[];
  lastMet?: string;
  status: 'approved' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  target?: number;
  timestamp: string;
}

export interface MedicalReport {
  id: string;
  title: string;
  type: 'prescription' | 'report' | 'lab_result';
  fileUrl: string;
  description?: string;
  createdAt: string;
  tags: string[];
}

export interface AppSettings {
  language: string;
  voiceEnabled: boolean;
  notifications: boolean;
  patientName: string;
}

class LocalStorageManager {
  private getStorageKey(key: string): string {
    return `ai-health-companion-${key}`;
  }

  // People management
  getPeople(): Person[] {
    const data = window.localStorage.getItem(this.getStorageKey('people'));
    return data ? JSON.parse(data) : [];
  }

  savePeople(people: Person[]): void {
    window.localStorage.setItem(this.getStorageKey('people'), JSON.stringify(people));
  }

  addPerson(person: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>): Person {
    const people = this.getPeople();
    const newPerson: Person = {
      ...person,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    people.push(newPerson);
    this.savePeople(people);
    return newPerson;
  }

  updatePerson(id: string, updates: Partial<Person>): Person | null {
    const people = this.getPeople();
    const personIndex = people.findIndex(p => p.id === id);
    if (personIndex === -1) return null;

    people[personIndex] = {
      ...people[personIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.savePeople(people);
    return people[personIndex];
  }

  deletePerson(id: string): boolean {
    const people = this.getPeople();
    const filteredPeople = people.filter(p => p.id !== id);
    if (filteredPeople.length === people.length) return false;
    this.savePeople(filteredPeople);
    return true;
  }

  // Health metrics
  getHealthMetrics(): HealthMetric[] {
    const data = window.localStorage.getItem(this.getStorageKey('health-metrics'));
    return data ? JSON.parse(data) : this.getDefaultHealthMetrics();
  }

  saveHealthMetrics(metrics: HealthMetric[]): void {
    window.localStorage.setItem(this.getStorageKey('health-metrics'), JSON.stringify(metrics));
  }

  addHealthMetric(metric: Omit<HealthMetric, 'id'>): HealthMetric {
    const metrics = this.getHealthMetrics();
    const newMetric: HealthMetric = {
      ...metric,
      id: crypto.randomUUID(),
    };
    metrics.push(newMetric);
    this.saveHealthMetrics(metrics);
    return newMetric;
  }

  private getDefaultHealthMetrics(): HealthMetric[] {
    return [
      {
        id: '1',
        name: 'Heart Rate',
        value: 72,
        unit: 'bpm',
        status: 'normal',
        trend: 'stable',
        target: 80,
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Blood Pressure',
        value: 120,
        unit: 'mmHg',
        status: 'normal',
        trend: 'down',
        target: 120,
        timestamp: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Temperature',
        value: 98.6,
        unit: '°F',
        status: 'normal',
        trend: 'stable',
        timestamp: new Date().toISOString(),
      },
      {
        id: '4',
        name: 'Hydration',
        value: 6,
        unit: 'glasses',
        status: 'warning',
        trend: 'up',
        target: 8,
        timestamp: new Date().toISOString(),
      },
    ];
  }

  // Medical reports
  getMedicalReports(): MedicalReport[] {
    const data = window.localStorage.getItem(this.getStorageKey('medical-reports'));
    return data ? JSON.parse(data) : [];
  }

  saveMedicalReports(reports: MedicalReport[]): void {
    window.localStorage.setItem(this.getStorageKey('medical-reports'), JSON.stringify(reports));
  }

  // App settings
  getSettings(): AppSettings {
    const data = window.localStorage.getItem(this.getStorageKey('settings'));
    return data ? JSON.parse(data) : {
      language: 'en',
      voiceEnabled: true,
      notifications: true,
      patientName: 'Patient',
    };
  }

  saveSettings(settings: AppSettings): void {
    window.localStorage.setItem(this.getStorageKey('settings'), JSON.stringify(settings));
  }

  // File storage simulation (in real app, would use File System API or similar)
  saveFile(file: File, category: 'photos' | 'reports' | 'prescriptions'): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const fileData = {
          name: file.name,
          type: file.type,
          data: reader.result,
          timestamp: new Date().toISOString(),
        };
        
        const key = this.getStorageKey(`files-${category}`);
        const files = JSON.parse(window.localStorage.getItem(key) || '[]');
        const fileId = crypto.randomUUID();
        files.push({ id: fileId, ...fileData });
        window.localStorage.setItem(key, JSON.stringify(files));
        
        resolve(`local-file://${fileId}`);
      };
      reader.readAsDataURL(file);
    });
  }

  getFile(fileUrl: string): any | null {
    if (!fileUrl.startsWith('local-file://')) return null;
    
    const fileId = fileUrl.replace('local-file://', '');
    const categories = ['photos', 'reports', 'prescriptions'];
    
    for (const category of categories) {
      const key = this.getStorageKey(`files-${category}`);
      const files = JSON.parse(window.localStorage.getItem(key) || '[]');
      const file = files.find((f: any) => f.id === fileId);
      if (file) return file;
    }
    
    return null;
  }
}

export const storageManager = new LocalStorageManager();