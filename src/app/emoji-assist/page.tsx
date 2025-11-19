
"use client";

import { EmojiSuggestionForm } from '@/components/emoji-suggestion-form';
import { useState, useEffect } from 'react';

export default function Home() {
  const [description, setDescription] = useState("Enter some text and let AI suggest the perfect emoji for you! Supports multiple languages.");
  const [footerText, setFooterText] = useState("© 2024 Emoji Assist. Powered by Gemini 2.5 Flash & Firebase Studio.");


  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.language) {
      const lang = navigator.language.toLowerCase();
      if (lang.startsWith('zh')) {
        setDescription("輸入一些文字，讓 AI 為您建議完美的表情符號！支援多國語言。");
      } else {
        setDescription("Enter some text and let AI suggest the perfect emoji for you! Supports multiple languages.");
      }
    }
    // Update year dynamically
    setFooterText(`© ${new Date().getFullYear()} Emoji Assist. Powered by Gemini 2.5 Flash & Firebase Studio.`);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-10 lg:p-16 bg-background font-body">
      <div className="w-full max-w-2xl space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-headline font-bold text-primary tracking-tight sm:text-5xl md:text-6xl">
            Emoji Assist
          </h1>
          <p className="mt-3 text-lg text-muted-foreground sm:mt-4 md:text-xl">
            {description}
          </p>
        </header>
        <EmojiSuggestionForm />
        <footer className="text-center text-sm text-muted-foreground pt-8 tabular-nums space-y-1">
          <p>{footerText}</p>
          <p>For any questions or feedback, feel free to <a href="https://www.linkedin.com/in/dionchangtw/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">reach out</a>.</p>
          <p>
            Developed by <a href="https://www.linkedin.com/in/dionchangtw/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Dion Chang</a>
          </p>
        </footer>
      </div>
    </main>
  );
}
