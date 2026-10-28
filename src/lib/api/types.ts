import { z } from "zod";

export const partnerSchema = z.object({
  brandName: z.string(),
  brandPlacement: z.array(z.string()).default([]),
  sustainabilityPlacement: z.string().default(""),
  productAssumptions: z.array(z.string()).default([]),
  collaborationSummary: z.string().default(""),
  estimatedImpact: z.string().default(""),
  confidenceScore: z.number().default(0),
  combinedReach: z.string().default(""),
  logoUrl: z.string().optional(),
  companyDomain: z.string().optional(),
});

export const collaborationResponseSchema = z.object({
  brand: z.string(),
  plasticType: z.string(),
  location: z.string(),
  needPlastic: z.boolean(),
  partners: z.array(partnerSchema),
});

export const productSchema = z.object({
  name: z.string(),
  type: z.string().default(""),
  description: z.string().default(""),
  pitch: z.string().default(""),
  imageUrl: z.string().optional(),
});

export const productResponseSchema = z.object({
  cached: z.boolean(),
  sourceBrand: z.string(),
  targetBrand: z.string(),
  plasticType: z.string(),
  location: z.string().nullable().optional(),
  products: z.array(productSchema),
});

export const materialRequestSchema = z.object({
  brand: z.string().trim().min(1, "Company name is required."),
  plasticType: z.string().trim().min(1, "Material type is required."),
  location: z.string().trim().min(1, "Factory location is required."),
  needPlastic: z.boolean(),
  targetBrand: z.string().trim().optional(),
});

export type Partner = z.infer<typeof partnerSchema>;
export type CollaborationResponse = z.infer<typeof collaborationResponseSchema>;
export type ProductResponse = z.infer<typeof productResponseSchema>;
export type MaterialRequest = z.infer<typeof materialRequestSchema>;

export type ApiFailure = {
  message?: string;
  fieldErrors?: Record<string, string>;
};
