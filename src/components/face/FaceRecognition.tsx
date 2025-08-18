import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, CameraOff, Scan, User } from 'lucide-react';
import { storageManager, Person } from '@/lib/storage';
import { PersonCard } from '@/components/people/PersonCard';
import { useToast } from '@/hooks/use-toast';

interface FaceRecognitionProps {
  isCaregiver?: boolean;
}

export function FaceRecognition({ isCaregiver = false }: FaceRecognitionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [recognizedPerson, setRecognizedPerson] = useState<Person | null>(null);
  const [people, setPeople] = useState<Person[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setPeople(storageManager.getPeople().filter(p => p.status === 'approved'));
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreamActive(true);
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsStreamActive(false);
    setIsScanning(false);
    setRecognizedPerson(null);
  }, []);

  const captureFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return null;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    
    return canvas.toDataURL('image/jpeg', 0.8);
  }, []);

  const performFaceRecognition = useCallback(async () => {
    if (people.length === 0) {
      toast({
        title: "No People Added",
        description: "Add some people first to enable face recognition.",
        variant: "default"
      });
      return;
    }

    setIsScanning(true);
    try {
      const frameData = captureFrame();
      if (!frameData) {
        throw new Error('Failed to capture frame');
      }

      // Simulate face recognition - in a real implementation, you would:
      // 1. Extract face features from the current frame
      // 2. Compare with stored face encodings
      // 3. Find the best match above a confidence threshold
      
      // For demo purposes, randomly select a person (simulate recognition)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const randomPerson = people[Math.floor(Math.random() * people.length)];
      
      // Update last met timestamp
      const updatedPerson = storageManager.updatePerson(randomPerson.id, {
        lastMet: new Date().toISOString()
      });
      
      if (updatedPerson) {
        setRecognizedPerson(updatedPerson);
        setPeople(storageManager.getPeople().filter(p => p.status === 'approved'));
        
        toast({
          title: "Person Recognized!",
          description: `Found ${updatedPerson.name}`,
          variant: "default"
        });
      }
    } catch (error) {
      toast({
        title: "Recognition Failed",
        description: "Could not recognize person in frame",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  }, [people, captureFrame, toast]);

  return (
    <div className="space-y-6">
      {/* Camera Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Face Recognition Camera
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-64 bg-muted rounded-lg object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {isScanning && (
              <div className="absolute inset-0 bg-primary/20 rounded-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <Scan className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                  <p className="text-sm font-medium">Scanning...</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {!isStreamActive ? (
              <Button onClick={startCamera} className="flex-1">
                <Camera className="w-4 h-4 mr-2" />
                Start Camera
              </Button>
            ) : (
              <>
                <Button onClick={stopCamera} variant="outline" className="flex-1">
                  <CameraOff className="w-4 h-4 mr-2" />
                  Stop Camera
                </Button>
                <Button 
                  onClick={performFaceRecognition} 
                  disabled={isScanning}
                  className="flex-1"
                >
                  <Scan className="w-4 h-4 mr-2" />
                  {isScanning ? 'Scanning...' : 'Recognize Face'}
                </Button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="w-4 h-4" />
            <span>{people.length} people available for recognition</span>
          </div>
        </CardContent>
      </Card>

      {/* Recognition Result */}
      {recognizedPerson && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-success/10 text-success border-success/20">
              Person Recognized
            </Badge>
          </div>
          <PersonCard 
            person={recognizedPerson} 
            isPatientMode={!isCaregiver}
          />
        </div>
      )}
    </div>
  );
}