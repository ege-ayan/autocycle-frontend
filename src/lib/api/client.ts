import {
  type ApiFailure,
  type CollaborationResponse,
  type MaterialRequest,
  type ProductResponse,
  collaborationResponseSchema,
  productResponseSchema,
} from "@/lib/api/types";

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function errorMessage(body: unknown, fallback: string): string {
  if (!body || typeof body !== "object") {
    return fallback;
  }
  const failure = body as ApiFailure;
  const fieldError = failure.fieldErrors
    ? Object.values(failure.fieldErrors).find((value) => value.length > 0)
    : undefined;
  return failure.message || fieldError || fallback;
}

async function post<T>(
  path: string,
  body: unknown,
  parse: (value: unknown) => T,
): Promise<T> {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(
      errorMessage(payload, "The request failed."),
      response.status,
    );
  }
  return parse(payload);
}

export function createCollaboration(
  input: MaterialRequest,
): Promise<CollaborationResponse> {
  return post(
    "/backend/api/collaborations",
    {
      brand: input.brand,
      plasticType: input.plasticType,
      location: input.location,
      needPlastic: input.needPlastic,
    },
    (value) => collaborationResponseSchema.parse(value),
  );
}

export function createProducts(
  input: MaterialRequest & { targetBrand: string },
): Promise<ProductResponse> {
  return post(
    "/backend/api/products",
    {
      sourceBrand: input.brand,
      plasticType: input.plasticType,
      location: input.location,
      targetBrand: input.targetBrand,
    },
    (value) => productResponseSchema.parse(value),
  );
}
