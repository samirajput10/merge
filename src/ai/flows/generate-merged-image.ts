'use server';

/**
 * @fileOverview Image merging flow.
 *
 * - generateMergedImage - A function that merges a person image and a clothing image.
 * - GenerateMergedImageInput - The input type for the generateMergedImage function.
 * - GenerateMergedImageOutput - The return type for the generateMergedImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMergedImageInputSchema = z.object({
  personImageDataUri: z
    .string()
    .describe(
      "A photo of a person, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  clothingImageDataUri: z
    .string()
    .describe(
      "A photo of a clothing item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateMergedImageInput = z.infer<typeof GenerateMergedImageInputSchema>;

const GenerateMergedImageOutputSchema = z.object({
  mergedImageDataUri: z.string().describe('The merged image as a data URI.'),
});
export type GenerateMergedImageOutput = z.infer<typeof GenerateMergedImageOutputSchema>;

export async function generateMergedImage(
  input: GenerateMergedImageInput
): Promise<GenerateMergedImageOutput> {
  return generateMergedImageFlow(input);
}

const generateMergedImagePrompt = ai.definePrompt({
  name: 'generateMergedImagePrompt',
  input: {schema: GenerateMergedImageInputSchema},
  output: {schema: GenerateMergedImageOutputSchema},
  prompt: [
    {
      media: {url: '{{personImageDataUri}}'},
    },
    {
      text: 'generate an image of this person wearing the clothing in the second image',
    },
    {
      media: {url: '{{clothingImageDataUri}}'},
    },
  ],
  config: {
    responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE, IMAGE only won't work
  },
});

const generateMergedImageFlow = ai.defineFlow(
  {
    name: 'generateMergedImageFlow',
    inputSchema: GenerateMergedImageInputSchema,
    outputSchema: GenerateMergedImageOutputSchema,
  },
  async input => {
    const {media} = await ai.generate(generateMergedImagePrompt, input);
    return {mergedImageDataUri: media.url!};
  }
);
