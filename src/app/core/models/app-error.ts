export interface AppError {
  type: 'business' | 'http';
  errors: string[];
  statusCode?: number;
  originalResponse?: any;
}