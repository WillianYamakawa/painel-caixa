export interface AppError {
  type: 'business' | 'http';
  errors: string[];
  error: string;
  statusCode?: number;
  originalResponse?: any;
}