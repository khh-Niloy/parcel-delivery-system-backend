/* eslint-disable @typescript-eslint/no-explicit-any */

import { TErrorSources, TGenericErrorResponse } from "../interface/error.types"

export const handlerZodError = (err: any): TGenericErrorResponse => {
    const errorSources: TErrorSources[] = [];

    err.issues.forEach((issue: any) => {
        errorSources.push({
            path: issue.path.join('.'),
            message: issue.message
        });
    });

    return {
        statusCode: 400,
        message: errorSources.length > 0 ? errorSources.map(e => `${e.path}: ${e.message}`).join('; ') : 'Validation error',
        errorSources
    };
};