export interface BaseApi<T> {
  data: T;
  message: string;
  status: string;
  statusCode: number;
}
