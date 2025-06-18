
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Copy, Info, Loader2, ClipboardList, Share2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface EmojiDisplayProps {
  emojis: string[];
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
  inputText: string;
}

export function EmojiDisplay({ emojis, isLoading, error, hasSearched, inputText }: EmojiDisplayProps) {
  const { toast } = useToast();

  const handleCopyEmoji = async (emoji: string) => {
    try {
      await navigator.clipboard.writeText(emoji);
      toast({
        title: "Copied! 🎉",
        description: (
          <div className="flex items-center">
            <span className="text-2xl mr-2">{emoji}</span>
            <span>Copied to clipboard.</span>
          </div>
        ),
        duration: 3000,
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Copy Failed 😥",
        description: "Could not copy emoji to clipboard.",
        duration: 3000,
      });
    }
  };

  const handleCopyAllEmojis = async () => {
    if (emojis.length === 0) return;
    const allEmojisString = emojis.join(" ");
    try {
      await navigator.clipboard.writeText(allEmojisString);
      toast({
        title: "All Emojis Copied! 📋",
        description: `${emojis.length} emojis copied to clipboard.`,
        duration: 3000,
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Copy Failed 😥",
        description: "Could not copy all emojis to clipboard.",
        duration: 3000,
      });
    }
  };

  const handleEmojiCharades = async () => {
    if (emojis.length === 0) return;
    const emojisToShare = emojis.join(" ");
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Emoji Challenge - Guess the Emojis!',
          text: emojisToShare,
        });
        toast({
          title: "Emojis Shared! 📢",
          description: "The charade has been shared.",
          duration: 3000,
        });
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          console.log('Share dialog dismissed by user.');
          return;
        }
        toast({
          variant: "destructive",
          title: "Share Failed 😥",
          description: "Could not share the emoji charade.",
          duration: 3000,
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Not Supported 🙁",
        description: "Web Share API is not supported in your browser.",
        duration: 3000,
      });
    }
  };


  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1 p-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-12 rounded-md" />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center p-6 text-destructive">
          <AlertCircle className="h-12 w-12 mb-4" />
          <p className="text-lg font-semibold">Oops! Something went wrong.</p>
          <p className="text-sm text-center">{error}</p>
        </div>
      );
    }

    if (!hasSearched) {
      return (
        <div className="flex flex-col items-center justify-center p-6 text-muted-foreground">
          <Info className="h-12 w-12 mb-4" />
          <p className="text-lg">Enter text above to get emoji suggestions.</p>
        </div>
      );
    }

    if (emojis.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-6 text-muted-foreground">
          <Info className="h-12 w-12 mb-4" />
          <p className="text-lg">No emojis found for your text.</p>
          <p className="text-sm">Try different keywords or be more specific.</p>
        </div>
      );
    }

    return (
      <ScrollArea className="max-h-64 p-1">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1 p-3">
          {emojis.map((emoji, index) => (
            <Button
              key={index}
              variant="outline"
              size="lg"
              className="text-3xl aspect-square p-0 hover:bg-accent/20 focus:bg-accent/30 transition-colors duration-150"
              onClick={() => handleCopyEmoji(emoji)}
              aria-label={`Copy emoji ${emoji}`}
            >
              {emoji}
            </Button>
          ))}
        </div>
      </ScrollArea>
    );
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline text-primary">Suggested Emojis</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-center">
        {renderContent()}
      </CardContent>
      {hasSearched && !isLoading && !error && emojis.length > 0 && (
        <CardFooter>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyAllEmojis}
              aria-label="Copy all suggested emojis"
              className="w-full"
            >
              <ClipboardList className="mr-2 h-4 w-4" />
              Copy All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEmojiCharades}
              aria-label="Share emoji charades"
              className="w-full"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Emoji Charades
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
