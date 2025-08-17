import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "secondary" | "outline";
  };
  children?: React.ReactNode;
  className?: string;
}

export function DashboardCard({
  title,
  description,
  icon: Icon,
  action,
  children,
  className = ""
}: DashboardCardProps) {
  return (
    <Card className={`bg-gradient-to-br from-card to-secondary/10 border-primary/10 hover:border-primary/20 transition-all duration-300 hover:shadow-lg ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-foreground">
              {title}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {description}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {children}
        
        {action && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <Button
              variant={action.variant || "default"}
              onClick={action.onClick}
              className="w-full"
            >
              {action.label}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}