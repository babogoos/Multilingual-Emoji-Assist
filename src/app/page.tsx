import { EmojiSuggestionForm } from '@/components/emoji-suggestion-form';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-10 lg:p-16 bg-background font-body">
      <div className="w-full max-w-2xl space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-headline font-bold text-primary tracking-tight sm:text-5xl md:text-6xl">
            Emoji Assist
          </h1>
          <p className="mt-3 text-lg text-muted-foreground sm:mt-4 md:text-xl">
            Type some text and let AI suggest the perfect emojis for you!
          </p>
        </header>
        <EmojiSuggestionForm />
        <footer className="text-center text-sm text-muted-foreground pt-8">
          <p>&copy; {new Date().getFullYear()} Emoji Assist. Powered by AI.</p>
        </footer>
      </div>
    </main>
  );
}
