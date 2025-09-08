'use server';

import { generateMergedImage, type GenerateMergedImageInput } from '@/ai/flows/generate-merged-image';

interface ActionResult {
  mergedImageDataUri?: string;
  error?: string;
}

export async function mergeImagesAction(input: GenerateMergedImageInput): Promise<ActionResult> {
  try {
    const result = await generateMergedImage(input);
    if (result.mergedImageDataUri) {
        return { mergedImageDataUri: result.mergedImageDataUri };
    }
    return { error: 'The AI failed to return an image. Please try again.' };
  } catch (e) {
    console.error(e);
    // Return a more specific error message for debugging
    if (e instanceof Error) {
        return { error: `AI Error: ${e.message}` };
    }
    return { error: 'An unexpected error occurred while generating the image. Please try again later.' };
  }
}
