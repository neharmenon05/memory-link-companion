import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Activity } from 'lucide-react';
import { storageManager, HealthMetric } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface AddHealthMetricDialogProps {
  onMetricAdded?: (metric: HealthMetric) => void;
}

export function AddHealthMetricDialog({ onMetricAdded }: AddHealthMetricDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    unit: '',
    status: 'normal' as 'normal' | 'warning' | 'critical',
    target: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const metricTypes = [
    { name: 'Heart Rate', unit: 'bpm', target: '80' },
    { name: 'Blood Pressure (Systolic)', unit: 'mmHg', target: '120' },
    { name: 'Blood Pressure (Diastolic)', unit: 'mmHg', target: '80' },
    { name: 'Temperature', unit: '°F', target: '98.6' },
    { name: 'Weight', unit: 'lbs', target: '' },
    { name: 'Blood Sugar', unit: 'mg/dL', target: '100' },
    { name: 'Hydration', unit: 'glasses', target: '8' },
    { name: 'Steps', unit: 'steps', target: '10000' },
    { name: 'Sleep', unit: 'hours', target: '8' },
    { name: 'Custom', unit: '', target: '' }
  ];

  const handleMetricSelect = (metricName: string) => {
    const metric = metricTypes.find(m => m.name === metricName);
    if (metric) {
      setFormData(prev => ({
        ...prev,
        name: metricName,
        unit: metric.unit,
        target: metric.target
      }));
    }
  };

  const determineStatus = (value: number, target?: number): 'normal' | 'warning' | 'critical' => {
    if (!target) return 'normal';
    
    const ratio = value / target;
    if (ratio >= 0.8 && ratio <= 1.2) return 'normal';
    if (ratio >= 0.6 && ratio <= 1.4) return 'warning';
    return 'critical';
  };

  const determineTrend = (): 'up' | 'down' | 'stable' => {
    // In a real implementation, this would compare with previous values
    const trends: ('up' | 'down' | 'stable')[] = ['up', 'down', 'stable'];
    return trends[Math.floor(Math.random() * trends.length)];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.value.trim()) {
      toast({
        title: "Error",
        description: "Name and value are required",
        variant: "destructive"
      });
      return;
    }

    const value = parseFloat(formData.value);
    if (isNaN(value)) {
      toast({
        title: "Error",
        description: "Value must be a valid number",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const target = formData.target ? parseFloat(formData.target) : undefined;
      const status = determineStatus(value, target);
      const trend = determineTrend();

      const newMetric = storageManager.addHealthMetric({
        name: formData.name.trim(),
        value,
        unit: formData.unit.trim(),
        status,
        trend,
        target,
        timestamp: new Date().toISOString()
      });

      toast({
        title: "Success",
        description: "Health metric added successfully",
        variant: "default"
      });

      onMetricAdded?.(newMetric);
      setOpen(false);
      
      // Reset form
      setFormData({ name: '', value: '', unit: '', status: 'normal', target: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add health metric",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Metric
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Add Health Metric
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Metric Type */}
          <div className="space-y-2">
            <Label>Metric Type</Label>
            <Select 
              value={formData.name} 
              onValueChange={handleMetricSelect}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select metric type" />
              </SelectTrigger>
              <SelectContent>
                {metricTypes.map((metric) => (
                  <SelectItem key={metric.name} value={metric.name}>
                    {metric.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Name (if Custom selected) */}
          {formData.name === 'Custom' && (
            <div className="space-y-2">
              <Label htmlFor="customName">Custom Metric Name</Label>
              <Input
                id="customName"
                value={formData.name === 'Custom' ? '' : formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter custom metric name"
              />
            </div>
          )}

          {/* Value */}
          <div className="space-y-2">
            <Label htmlFor="value">Value *</Label>
            <Input
              id="value"
              type="number"
              step="any"
              value={formData.value}
              onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
              placeholder="Enter measurement value"
              required
            />
          </div>

          {/* Unit */}
          <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
            <Input
              id="unit"
              value={formData.unit}
              onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
              placeholder="e.g., bpm, mmHg, °F"
            />
          </div>

          {/* Target (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="target">Target Value (Optional)</Label>
            <Input
              id="target"
              type="number"
              step="any"
              value={formData.target}
              onChange={(e) => setFormData(prev => ({ ...prev, target: e.target.value }))}
              placeholder="Target or normal value"
            />
          </div>

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
              {isSubmitting ? 'Adding...' : 'Add Metric'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}