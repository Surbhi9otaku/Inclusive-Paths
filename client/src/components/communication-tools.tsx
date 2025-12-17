import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Mic, 
  Volume2, 
  Type,
  X,
  Play,
  Pause,
  Loader2,
  Hand
} from "lucide-react";

interface CommunicationToolsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeToolProp?: "tts" | "stt" | "sign" | null;
}

export function CommunicationTools({ open, onOpenChange, activeToolProp }: CommunicationToolsProps) {
  const [activeTool, setActiveTool] = useState<"tts" | "stt" | "sign" | null>(activeToolProp || null);
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleTextToSpeech = () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    const utterance = new SpeechSynthesisUtterance(inputText);
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsProcessing(false);
    };
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsProcessing(false);
      setIsSpeaking(false);
    };
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setOutputText("Speech recognition is not supported in your browser.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => {
      setIsListening(false);
      setOutputText("Error occurred while listening. Please try again.");
    };
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join("");
      setOutputText(transcript);
    };

    recognition.start();
  };

  const renderToolContent = () => {
    switch (activeTool) {
      case "tts":
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Enter text to speak</label>
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type the text you want to hear..."
                className="min-h-[150px]"
                data-testid="textarea-tts-input"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleTextToSpeech}
                disabled={!inputText.trim() || isProcessing || isSpeaking}
                className="gap-2 flex-1"
                data-testid="button-speak"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : isSpeaking ? (
                  <>
                    <Volume2 className="h-4 w-4 animate-pulse" />
                    Speaking...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Speak Text
                  </>
                )}
              </Button>
              {isSpeaking && (
                <Button variant="outline" onClick={stopSpeaking} data-testid="button-stop-speaking">
                  <Pause className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        );

      case "stt":
        return (
          <div className="space-y-4">
            <div className="text-center py-8">
              <Button
                size="lg"
                variant={isListening ? "destructive" : "default"}
                className={`h-24 w-24 rounded-full ${isListening ? "animate-pulse" : ""}`}
                onClick={isListening ? undefined : startListening}
                data-testid="button-listen"
              >
                <Mic className={`h-10 w-10 ${isListening ? "animate-bounce" : ""}`} />
              </Button>
              <p className="mt-4 text-muted-foreground">
                {isListening ? "Listening... Speak now" : "Tap to start listening"}
              </p>
            </div>
            {outputText && (
              <div>
                <label className="text-sm font-medium mb-2 block">Transcribed Text</label>
                <div className="p-4 rounded-lg bg-muted min-h-[100px]" data-testid="text-stt-output">
                  <p>{outputText}</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => navigator.clipboard.writeText(outputText)}
                    className="flex-1"
                    data-testid="button-copy-transcript"
                  >
                    Copy Text
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setOutputText("")}
                    data-testid="button-clear-transcript"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            )}
          </div>
        );

      case "sign":
        return (
          <div className="space-y-4">
            <div className="text-center py-8">
              <div className="h-48 w-48 mx-auto rounded-xl bg-muted flex items-center justify-center mb-4">
                <Hand className="h-16 w-16 text-primary/40" />
              </div>
              <p className="text-muted-foreground mb-4">
                Sign language translation feature coming soon. This will convert text to sign language animations.
              </p>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Enter text to translate</label>
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type the text you want to translate to sign language..."
                className="min-h-[100px]"
                data-testid="textarea-sign-input"
              />
            </div>
            <Button disabled className="w-full gap-2" data-testid="button-translate-sign">
              <Hand className="h-4 w-4" />
              Translate to Sign Language
            </Button>
          </div>
        );

      default:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card 
              className="cursor-pointer hover-elevate"
              onClick={() => setActiveTool("tts")}
              data-testid="card-tool-tts"
            >
              <CardContent className="pt-6 text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Volume2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Text to Speech</h3>
                <p className="text-sm text-muted-foreground">
                  Convert written text into spoken words
                </p>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover-elevate"
              onClick={() => setActiveTool("stt")}
              data-testid="card-tool-stt"
            >
              <CardContent className="pt-6 text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Mic className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Speech to Text</h3>
                <p className="text-sm text-muted-foreground">
                  Convert spoken words into written text
                </p>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover-elevate"
              onClick={() => setActiveTool("sign")}
              data-testid="card-tool-sign"
            >
              <CardContent className="pt-6 text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Hand className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Sign Language</h3>
                <p className="text-sm text-muted-foreground">
                  Translate text to sign language
                </p>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                {activeTool === "tts" && <Volume2 className="h-5 w-5 text-primary" />}
                {activeTool === "stt" && <Mic className="h-5 w-5 text-primary" />}
                {activeTool === "sign" && <Hand className="h-5 w-5 text-primary" />}
                {!activeTool && "Communication Tools"}
                {activeTool === "tts" && "Text to Speech"}
                {activeTool === "stt" && "Speech to Text"}
                {activeTool === "sign" && "Sign Language Translator"}
              </DialogTitle>
              <DialogDescription>
                {!activeTool && "Choose a communication tool to assist you"}
                {activeTool === "tts" && "Type text and have it spoken aloud"}
                {activeTool === "stt" && "Speak and see your words as text"}
                {activeTool === "sign" && "Translate text to sign language"}
              </DialogDescription>
            </div>
            {activeTool && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setActiveTool(null);
                  setInputText("");
                  setOutputText("");
                }}
                data-testid="button-back-tools"
              >
                Back
              </Button>
            )}
          </div>
        </DialogHeader>
        {renderToolContent()}
      </DialogContent>
    </Dialog>
  );
}

export function CommunicationFAB() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg"
          onClick={() => setOpen(true)}
          data-testid="button-communication-fab"
          aria-label="Open communication tools"
        >
          <Mic className="h-6 w-6" />
        </Button>
      </div>
      <CommunicationTools open={open} onOpenChange={setOpen} />
    </>
  );
}
