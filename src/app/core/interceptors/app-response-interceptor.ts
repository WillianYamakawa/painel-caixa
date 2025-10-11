import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AppActionResult } from '../models/app-action-result';
import { AppError } from '../models/app-error';

export const appResponseInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map(event => {
      if (event.type === 4 && event.body) {
        const body = event.body as any;
        
        if (body && typeof body === 'object' && 'success' in body && 'data' in body && 'errors' in body) {
          const result = body as AppActionResult<any>;
          
          if (!result.success) {
            const appError: AppError = {
              type: 'business',
              errors: result.errors,
              originalResponse: result
            };
            throw appError;
          }
          
          return event.clone({ body: result.data });
        }
      }
      
      return event;
    }),
    catchError((error: HttpErrorResponse) => {
      if (error && (error as any).type === 'business') {
        console.log(error);
      }
      
      const appError: AppError = {
        type: 'http',
        errors: ['Erro ao comunicar com o servidor'],
        statusCode: error.status,
        originalResponse: error
      };
      
      return throwError(() => appError);
    })
  );
};