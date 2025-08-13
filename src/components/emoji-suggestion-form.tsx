
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, Mic, MicOff } from "lucide-react";

import { suggestEmojis, type SuggestEmojisInput, type SuggestEmojisOutput } from "@/ai/flows/suggest-emojis";
import { EmojiDisplay } from "./emoji-display";

const MAX_CHARS = 500;

const formSchema = z.object({
  text: z.string().min(1, { message: "Please enter some text." }).max(MAX_CHARS, { message: `Text cannot exceed ${MAX_CHARS} characters.` }),
});

const catExamples = [
  { lang: "EN", text: "Cat" },
  { lang: "中文", text: "貓" },
  { lang: "日本語", text: "ねこ" },
  { lang: "한국어", text: "냥이" },
  { lang: "Bahasa Indonesia", text: "Kucing" },
  { lang: "العربية", text: "هريرة" },
  { lang: "Italiano", text: "micetto" },
  { lang: "Français", text: "Minou" },
  { lang: "Español", text: "gatito" },
  { lang: "Монгол", text: "Муур" },
  { lang: "Русский", text: "котенок" },
];


export function EmojiSuggestionForm() {
  const [suggestedEmojis, setSuggestedEmojis] = React.useState<string[]>([]);
  const [detectedLanguage, setDetectedLanguage] = React.useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [hasSearched, setHasSearched] = React.useState(false);
  const [isListening, setIsListening] = React.useState(false);
  const [isSpeechRecognitionSupported, setIsSpeechRecognitionSupported] = React.useState(false);

  const { toast } = useToast();

  const recognitionRef = React.useRef<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  const onSubmit = React.useCallback(async (values: z.infer<typeof formSchema>) => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const input: SuggestEmojisInput = { text: values.text };
      const result: SuggestEmojisOutput = await suggestEmojis(input);
      setSuggestedEmojis(result.emojis || []);
      setDetectedLanguage(result.language);
      if (!result.emojis || result.emojis.length === 0) {
         // This case is handled by EmojiDisplay based on emojis.length and hasSearched
      }
    } catch (e) {
      console.error("Error suggesting emojis:", e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Failed to get suggestions. ${errorMessage}`);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Could not fetch emoji suggestions. ${errorMessage}`,
      });
      setSuggestedEmojis([]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, toast]);

  React.useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSpeechRecognitionSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = typeof navigator !== 'undefined' ? navigator.language : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        if (event.error === 'no-speech' || event.error === 'network') {
            toast({
              variant: "default",
              title: "Voice Input Paused",
              description: "Couldn't hear anything. Please try speaking again.",
            });
        } else {
            toast({
              variant: "destructive",
              title: "Voice Error",
              description: `An error occurred during speech recognition: ${event.error}`,
            });
        }
        setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        form.setValue("text", transcript, { shouldValidate: true });
        onSubmit({ text: transcript });
      };
      
      recognitionRef.current = recognition;
    }
  }, [toast, form, onSubmit]);


  const textValue = form.watch("text");
  const currentCharCount = textValue?.length || 0;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modifierKeyPressed = isMac ? event.metaKey : event.ctrlKey;

    if (event.key === 'Enter' && modifierKeyPressed) {
      event.preventDefault();
      if (!isLoading) {
        form.handleSubmit(onSubmit)();
      }
    }
  };

  const handleExampleClick = async (exampleText: string) => {
    if (isLoading) return;
    form.setValue("text", exampleText, { shouldValidate: true });
    await onSubmit({ text: exampleText });
  };
  
  const handleListen = () => {
    if (!isSpeechRecognitionSupported) {
      toast({
        variant: "destructive",
        title: "Unsupported",
        description: "Your browser does not support speech recognition.",
      });
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      form.setValue("text", ""); // Clear the textarea before listening
      recognitionRef.current?.start();
    }
  };


  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-lg font-semibold text-foreground">Enter your text</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="E.g., Happy birthday! or Let's celebrate..."
                    className="resize-none min-h-[100px] text-base border-input focus:border-primary focus:ring-primary shadow-sm tabular-nums"
                    {...field}
                    onKeyDown={handleKeyDown}
                    aria-describedby="text-input-description text-input-char-count"
                  />
                </FormControl>
                <div className="flex justify-between items-center">
                  <p id="text-input-description" className="text-sm text-muted-foreground">
                    Describe a feeling, event, or idea. (Use Cmd/Ctrl + Enter to submit)
                  </p>
                  <p id="text-input-char-count" className={`text-sm font-code ${currentCharCount > MAX_CHARS ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {currentCharCount}/{MAX_CHARS}
                  </p>
                </div>
                 {currentCharCount === 0 && !isLoading && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground ">
                      Or try an example:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {catExamples.map((example) => (
                        <Button
                          key={example.lang}
                          type="button"
                          variant="outline"
                          size="sm"
                          className="rounded-full px-3 py-1 h-auto text-xs"
                          onClick={() => handleExampleClick(example.text)}
                        >
                          {example.text}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-2">
            <Button type="submit" disabled={isLoading || isListening} className="w-full py-3 text-lg font-medium">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Suggesting...
                </>
              ) : (
                <>
                  Suggest Emojis <Send className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
            {isSpeechRecognitionSupported && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-full w-11 h-11 flex-shrink-0"
                onClick={handleListen}
                disabled={isLoading}
                aria-label={isListening ? "Stop listening" : "Start listening"}
              >
                {isListening ? (
                  <MicOff className="h-5 w-5 text-destructive animate-pulse" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>
        </form>
      </Form>
      <EmojiDisplay 
        emojis={suggestedEmojis} 
        isLoading={isLoading} 
        error={error} 
        hasSearched={hasSearched} 
        inputText={textValue}
        language={detectedLanguage}
      />
    </div>
  );
}
