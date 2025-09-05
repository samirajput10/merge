"use client";

import Image from 'next/image';
import { Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface GeneratedImageCardProps {
  src: string;
}

export function GeneratedImageCard({ src }: GeneratedImageCardProps) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = 'stylefusion-ai-result.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="animate-in fade-in zoom-in-95 duration-500">
      <CardHeader>
        <CardTitle>Your Style Fused!</CardTitle>
        <CardDescription>Here is the result of your image fusion.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-square w-full max-w-lg mx-auto overflow-hidden rounded-lg border">
          <Image
            src={src}
            alt="Generated merged image"
            fill
            className="object-contain"
            data-ai-hint="fashion model"
          />
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <Button onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download Image
        </Button>
      </CardFooter>
    </Card>
  );
}
