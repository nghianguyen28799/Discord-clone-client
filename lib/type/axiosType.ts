export interface ResponseApi<T> {
  statusCode: number;
  status: string;
  data?: T;
  message?: string;
}
