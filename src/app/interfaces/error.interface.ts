export interface IErrorSources {
  path: string;
  message: string;
}

export interface IErrorResposne {
  statusCode?: number;
  success: boolean;
  message: string;
  errorSource?: IErrorSources[];
  error?: unknown;
  stack?: string;
}
