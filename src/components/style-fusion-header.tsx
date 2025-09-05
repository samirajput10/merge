import { Sparkles } from 'lucide-react';

export function StyleFusionHeader() {
  return (
    <header className="py-6 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight font-headline text-center">
            StyleFusion AI
          </h1>
        </div>
      </div>
    </header>
  );
}
