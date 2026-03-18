export class ApiError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

export async function apiRequest<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage =
      typeof body?.error?.message === "string" ? body.error.message : "Request failed.";
    const errorCode = typeof body?.error?.code === "string" ? body.error.code : "request_failed";
    throw new ApiError(errorMessage, errorCode, response.status);
  }

  return body as T;
}
