export interface PayloadAPI {
  create: (args: {
    collection: string
    data: unknown
  }) => Promise<unknown>
}

export interface PayloadRequest {
  payload: PayloadAPI
}
