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

const generateMergedImageFlow = ai.defineFlow(
  {
    name: 'generateMergedImageFlow',
    inputSchema: GenerateMergedImageInputSchema,
    outputSchema: GenerateMergedImageOutputSchema,
  },
  async (input) => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        {media: {url: input.personImageDataUri}},
        {
          text: `You are an expert fashion designer. Your task is to generate a realistic image of the person from the first image wearing the clothing item from the second image. 
          
          Instructions:
          1.  Analyze the person in the first image, paying attention to their pose, body shape, and lighting.
          2.  Analyze the clothing item in the second image.
          3.  Create a new image where the person is realistically wearing the clothing. The final image should be photorealistic and high quality.
          4.  Ensure the clothing fits the person's body naturally.
          5.  Maintain the original background and lighting from the person's photo as much as possible.
          6.  The output should only be the final generated image. Do not include any text.`,
        },
        {media: {url: input.clothingImageDataUri}},
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });
    return {mergedImageDataUri: media.url!};
  }
);
