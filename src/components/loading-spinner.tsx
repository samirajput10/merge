import { Loader2 } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
      <p className="text-muted-foreground">Fusing styles... This may take a moment.</p>
    </div>
  );
}
