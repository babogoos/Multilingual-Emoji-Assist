
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Copy, Info, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface EmojiDisplayProps {
  emojis: string[];
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
}

export function EmojiDisplay({ emojis, isLoading, error, hasSearched }: EmojiDisplayProps) {
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

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 p-4">
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
      <ScrollArea className="h-64 p-1">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 p-3">
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
      <CardContent className="min-h-[200px] flex flex-col justify-center">
        {renderContent()}
      </CardContent>
    </Card>
  );
}
