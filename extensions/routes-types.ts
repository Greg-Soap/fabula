export const API_ROUTES = {
  GET: ['/auth/login'] as const,
  POST: ['/auth/login'] as const,
  PUT: [] as const,
  DELETE: [] as const,
}

type ReplaceParam<T extends string> =
  T extends `${infer Start}:${infer _Param}/${infer Rest}`
    ? `${Start}${string}/${ReplaceParam<Rest>}`
    : T extends `${infer Start}:${infer _Param}`
      ? `${Start}${string}`
      : T

type TransformRoutes<T extends readonly string[]> = {
  [K in keyof T]: T[K] | ReplaceParam<T[K]>
}[number]

export type APIRoutes = {
  [K in keyof typeof API_ROUTES]: TransformRoutes<typeof API_ROUTES[K]>
}

export type APIRouteStatic = {
  [K in keyof typeof API_ROUTES]: typeof API_ROUTES[K][number]
}
