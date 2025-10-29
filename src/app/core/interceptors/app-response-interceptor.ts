import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AppActionResult } from '../models/app-action-result';
import { AppError } from '../models/app-error';

export const appResponseInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req).pipe(
        map((event) => {
            if (event.type === 4 && event.body) {
                const body = event.body as any;

                if (
                    body &&
                    typeof body === 'object' &&
                    'success' in body &&
                    'data' in body &&
                    'errors' in body
                ) {
                    const result = body as AppActionResult<any>;

                    if (!result.success) {
                        const appError: AppError = {
                            type: 'business',
                            errors: result.errors,
                            originalResponse: result,
                            error: result.errors.join('. '),
                        };
                        throw appError;
                    }

                    return event.clone({ body: result.data });
                }
            }

            return event;
        }),
        catchError((error: HttpErrorResponse) => {
            console.log(error);

            let appError: AppError;
            if (error.status == 400) {
                appError = error.error as AppError;
                appError.error = appError.errors.join('. ')
            } else {
                appError = {
                    type: 'http',
                    errors: ['Erro ao comunicar com o servidor'],
                    statusCode: error.status,
                    originalResponse: error,
                    error: 'Erro ao comunicar com o servidor',
                };
            }

            return throwError(() => appError);
        })
    );
};
