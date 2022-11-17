import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getError, setError } from '../../store/app';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

export function useErrorView() {
    const appError = useAppSelector(getError);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const clearError = useCallback(() => {
        dispatch(setError(undefined));
    }, [dispatch]);

    useEffect(() => {
        clearError();
    }, [clearError, dispatch, location]);

    const onActionClick = () => {
        if (appError) {
            clearError();
            navigate(appError.action, { replace: true });
        }
    };

    return {
        appError,
        onActionClick,
    };
}
