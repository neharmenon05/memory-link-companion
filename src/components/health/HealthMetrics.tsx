import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Heart, Activity, Thermometer, Droplets, TrendingUp, TrendingDown } from 'lucide-react';

interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  target?: number;
  lastUpdated: string;
}

interface HealthMetricsProps {
  metrics: HealthMetric[];
}

export function HealthMetrics({ metrics }: HealthMetricsProps) {
  const getMetricIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'heart rate':
        return Heart;
      case 'blood pressure':
        return Activity;
      case 'temperature':
        return Thermometer;
      case 'hydration':
        return Droplets;
      default:
        return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-success/10 text-success border-success/20';
      case 'warning':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'critical':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3" />;
      case 'down':
        return <TrendingDown className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {metrics.map((metric) => {
        const Icon = getMetricIcon(metric.name);
        const progressValue = metric.target ? (metric.value / metric.target) * 100 : 0;

        return (
          <Card key={metric.id} className="bg-gradient-to-br from-card to-secondary/10 border-primary/10">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.name}
                  </CardTitle>
                </div>
                
                <Badge className={getStatusColor(metric.status)}>
                  {metric.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-foreground">
                    {metric.value}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {metric.unit}
                  </span>
                  {metric.trend !== 'stable' && (
                    <div className={`flex items-center gap-1 ${
                      metric.trend === 'up' ? 'text-success' : 'text-destructive'
                    }`}>
                      {getTrendIcon(metric.trend)}
                    </div>
                  )}
                </div>

                {metric.target && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress to target</span>
                      <span>{metric.target} {metric.unit}</span>
                    </div>
                    <Progress 
                      value={Math.min(progressValue, 100)} 
                      className="h-2"
                    />
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  Updated: {new Date(metric.lastUpdated).toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}