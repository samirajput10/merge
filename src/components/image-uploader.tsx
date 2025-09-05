"use client";

import { useState, type ChangeEvent } from 'react';
import Image from 'next/image';
import { UploadCloud, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ImageUploaderProps {
  id: string;
  label: string;
  onImageUpload: (file: File) => void;
  onImageRemove: () => void;
}

export function ImageUploader({ id, label, onImageUpload, onImageRemove }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageUpload(file);
    }
  };
  
  const handleRemoveImage = () => {
    setPreview(null);
    onImageRemove();
    const fileInput = document.getElementById(id) as HTMLInputElement;
    if (fileInput) {
        fileInput.value = "";
    }
  }

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="relative border-2 border-dashed border-muted-foreground/50 rounded-lg h-80 flex flex-col items-center justify-center group overflow-hidden">
            <label htmlFor={id} className="absolute inset-0 cursor-pointer z-0 bg-accent/20 group-hover:bg-accent/40 transition-colors" aria-label={label}></label>
            {preview ? (
              <>
                <Image src={preview} alt="Image preview" fill className="object-contain rounded-lg p-2" />
                <Button variant="destructive" size="icon" className="absolute top-2 right-2 z-10 h-8 w-8" onClick={(e) => { e.preventDefault(); handleRemoveImage(); }}>
                  <X className="h-4 w-4" />
                   <span className="sr-only">Remove image</span>
                </Button>
              </>
            ) : (
                <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground pointer-events-none">
                    <UploadCloud className="h-12 w-12 text-gray-400" />
                    <span className="font-semibold text-foreground">{label}</span>
                    <p className="text-sm">Click to upload an image</p>
                </div>
            )}
        </div>
        <input
          id={id}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </CardContent>
    </Card>
  );
}
