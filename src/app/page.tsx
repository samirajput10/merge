"use client";

import { useState, useTransition } from 'react';
import { StyleFusionHeader } from '@/components/style-fusion-header';
import { ImageUploader } from '@/components/image-uploader';
import { Button } from '@/components/ui/button';
import { mergeImagesAction } from './actions';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Sparkles } from 'lucide-react';
import { GeneratedImageCard } from '@/components/generated-image-card';

type ImageData = {
  file: File | null;
  dataUri: string | null;
};

export default function Home() {
  const [personImage, setPersonImage] = useState<ImageData>({ file: null, dataUri: null });
  const [clothingImage, setClothingImage] = useState<ImageData>({ file: null, dataUri: null });
  const [mergedImage, setMergedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleImageUpload = (file: File, type: 'person' | 'clothing') => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUri = e.target.result as string;
      if (type === 'person') {
        setPersonImage({ file, dataUri });
      } else {
        setClothingImage({ file, dataUri });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = (type: 'person' | 'clothing') => {
    if (type === 'person') {
        setPersonImage({ file: null, dataUri: null });
    } else {
        setClothingImage({ file: null, dataUri: null });
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!personImage.dataUri || !clothingImage.dataUri) return;

    setError(null);
    setMergedImage(null);

    startTransition(async () => {
      const result = await mergeImagesAction({
        personImageDataUri: personImage.dataUri!,
        clothingImageDataUri: clothingImage.dataUri!,
      });

      if (result.error) {
        setError(result.error);
      } else if (result.mergedImageDataUri) {
        setMergedImage(result.mergedImageDataUri);
      }
    });
  };

  const isButtonDisabled = isPending || !personImage.file || !clothingImage.file;

  return (
    <div className="flex min-h-screen flex-col bg-background font-body">
      <StyleFusionHeader />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-8 text-lg text-muted-foreground">
            Upload a photo of a person and an item of clothing to see them combined by AI!
          </p>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ImageUploader id="person-image" label="Upload Person" onImageUpload={(file) => handleImageUpload(file, 'person')} onImageRemove={() => handleImageRemove('person')} />
              <ImageUploader id="clothing-image" label="Upload Clothing" onImageUpload={(file) => handleImageUpload(file, 'clothing')} onImageRemove={() => handleImageRemove('clothing')} />
            </div>
            <Button type="submit" size="lg" disabled={isButtonDisabled}>
              <Sparkles className="mr-2 h-5 w-5" />
              {isPending ? 'Generating...' : 'Fuse Styles'}
            </Button>
          </form>

          <div className="mt-12">
            {isPending && <LoadingSpinner />}
            {error && (
              <Alert variant="destructive" className="max-w-md mx-auto text-left">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {mergedImage && <GeneratedImageCard src={mergedImage} />}
          </div>
        </div>
      </main>
    </div>
  );
}
