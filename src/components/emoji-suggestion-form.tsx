
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
import { Loader2, Send } from "lucide-react";

import { suggestEmojis, type SuggestEmojisInput, type SuggestEmojisOutput } from "@/ai/flows/suggest-emojis";
import { EmojiDisplay } from "./emoji-display";

const MAX_CHARS = 500;

const formSchema = z.object({
  text: z.string().min(1, { message: "Please enter some text." }).max(MAX_CHARS, { message: `Text cannot exceed ${MAX_CHARS} characters.` }),
});

export function EmojiSuggestionForm() {
  const [suggestedEmojis, setSuggestedEmojis] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [hasSearched, setHasSearched] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  const textValue = form.watch("text");
  const currentCharCount = textValue?.length || 0;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const input: SuggestEmojisInput = { text: values.text };
      const result: SuggestEmojisOutput = await suggestEmojis(input);
      setSuggestedEmojis(result.emojis || []);
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
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold text-foreground">Enter your text</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="E.g., Happy birthday! or Let's celebrate..."
                    className="resize-none min-h-[100px] text-base border-input focus:border-primary focus:ring-primary shadow-sm"
                    {...field}
                    aria-describedby="text-input-description text-input-char-count"
                  />
                </FormControl>
                <div className="flex justify-between items-center">
                  <p id="text-input-description" className="text-sm text-muted-foreground">
                    Describe a feeling, event, or idea, and we'll suggest emojis.
                  </p>
                  <p id="text-input-char-count" className={`text-sm ${currentCharCount > MAX_CHARS ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {currentCharCount}/{MAX_CHARS}
                  </p>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full py-3 text-lg font-medium">
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
        </form>
      </Form>
      <EmojiDisplay emojis={suggestedEmojis} isLoading={isLoading} error={error} hasSearched={hasSearched} />
    </div>
  );
}
