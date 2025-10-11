export interface AppActionResult<T> {
  success: boolean;
  data: T;
  errors: string[];
}