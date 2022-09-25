type ErrorType =
    'User.NotFound'
    | 'User.AlreadyExists'
    | 'User.AlreadyInStream'
    | 'Stream.NotFound'
    | 'Stream.AlreadyLive';

export const ErrorMap = {
    'User.NotFound': 'Invalid username or password',
    'User.AlreadyExists': 'User already exists',
    'User.AlreadyInStream': 'User is already in a stream',
    'Stream.NotFound': 'Stream not found',
    'Stream.AlreadyLive': 'Stream is already live',
    'Stream.NotLive': 'This Stream is not live',
};

export type ErrorResponse = {
    status: number;
    errors: ErrorType;
    title: string;
    traceId: string;
    type: string;
}
export const generateErrorMessage = (errorCode: ErrorType) => {
    if (errorCode in ErrorMap) return ErrorMap[errorCode];

    throw new Error(`Error code ${errorCode} not found`);
};
