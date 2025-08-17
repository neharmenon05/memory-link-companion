import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MicOff, Volume2, VolumeX, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      toast({
        title: "Voice Assistant Active",
        description: "Listening for your questions...",
      });
    }
  };

  const toggleSpeaking = () => {
    setIsSpeaking(!isSpeaking);
    if (!isSpeaking) {
      toast({
        title: "Speaking Mode On",
        description: "I'll respond with voice",
      });
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {isExpanded ? (
        <Card className="w-80 bg-card/95 backdrop-blur-sm border-primary/20 shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                <span className="font-medium">AI Assistant</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
              >
                ×
              </Button>
            </div>

            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                Ask me about:
              </div>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• "Who is this person?"</li>
                <li>• "When did I last see John?"</li>
                <li>• "Do I have to take medicine?"</li>
                <li>• "What's my health status?"</li>
              </ul>

              <div className="flex gap-2 pt-3 border-t border-border/50">
                <Button
                  variant={isListening ? "default" : "outline"}
                  size="sm"
                  onClick={toggleListening}
                  className="flex-1"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  {isListening ? "Stop" : "Listen"}
                </Button>
                <Button
                  variant={isSpeaking ? "default" : "outline"}
                  size="sm"
                  onClick={toggleSpeaking}
                  className="flex-1"
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  {isSpeaking ? "Mute" : "Speak"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          onClick={() => setIsExpanded(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Mic className="w-6 h-6 text-white" />
        </Button>
      )}
    </div>
  );
}