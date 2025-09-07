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
        {
          text: `You are a world-class digital artist and fashion retoucher. Your mission is to flawlessly composite a clothing item onto a person from two separate images.

**Your Goal:**
Create a single, photorealistic output image that shows the person from the "Person Image" wearing the clothing from the "Clothing Image". The result must be seamless, believable, and high-quality.

**Person Image:**
`,
        },
        {media: {url: input.personImageDataUri}},
        {
          text: `
**Clothing Image:**
`,
        },
        {media: {url: input.clothingImageDataUri}},
        {
          text: `
**Step-by-Step Instructions:**

1.  **Analyze the Person Image:**
    *   **Pose & Body Shape:** Carefully identify the person's posture, body contours, and limb positions.
    *   **Lighting:** Determine the direction, softness, and color of the primary light source. Note any highlights and core shadows on the person.
    *   **Environment:** Observe the background. The final composite must retain this original background.

2.  **Analyze the Clothing Image:**
    *   **Fabric & Texture:** Identify the material of the clothing (e.g., cotton, silk, denim) and its texture.
    *   **Fit & Style:** Understand the cut and intended fit of the garment.
    *   **Outfit Analysis:** Determine if the clothing item is a single piece (like a shirt or pants) or a full outfit (like a dress or a complete suit).

3.  **Perform the Digital Composite:**
    *   **Placement & Wrapping:** "Drape" the clothing onto the person's body. The garment must realistically wrap around their form, following their curves and pose.
    *   **Outfit Replacement Logic:** If the Clothing Image shows a complete outfit (e.g., a dress), you MUST replace the person's entire current attire with the new outfit. If it's a single item (e.g., a jacket), place it over their existing clothes where appropriate.
    *   **Natural Folds & Creases:** Generate realistic wrinkles, folds, and creases in the fabric that correspond logically to the person's pose.
    *   **Lighting & Shadow Integration:** This is critical. Replicate the exact lighting from the Person Image onto the clothing. The shadows and highlights on the garment must match the person's lighting perfectly to make it look like it's in the same environment. Cast subtle shadows from the clothing onto the person where appropriate.
    *   **Maintain Background:** The background from the original Person Image must be preserved perfectly.

**Strict Output Requirements:**
- **Image Only:** Your output MUST be the final generated image and nothing else.
- **No Text:** Do not include any text, descriptions, or commentary in your response.`,
        },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });
    return {mergedImageDataUri: media.url!};
  }
);
