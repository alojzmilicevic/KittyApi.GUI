type ErrorType =
    | 'User.NotFound'
    | 'User.AlreadyExists'
    | 'User.AlreadyInStream'
    | 'Stream.NotFound'
    | 'Stream.AlreadyLive'
    | 'Server.Error';

export const ErrorMap = {
    'User.NotFound': 'Invalid username or password',
    'User.AlreadyExists': 'User already exists',
    'User.AlreadyInStream': 'User is already in a stream',
    'Stream.NotFound': 'Stream not found',
    'Stream.AlreadyLive': 'Stream is already live',
    'Stream.NotLive': 'This Stream is not live',
    'Server.Error': 'Oops something went wrong... Server error',
};

export type ErrorResponse = {
    status: number;
    errors: ErrorType;
    title: string;
    traceId: string;
    type: string;
};

export type SimpleErrorResponse = {
    message: string;
    type: string;
};

export const generateErrorMessage = (
    errorCode: ErrorType
): SimpleErrorResponse => {
    if (errorCode in ErrorMap) {
        return { message: ErrorMap[errorCode], type: errorCode };
    }

    throw new Error(`Something went wrong... ${errorCode} not found`);
};
