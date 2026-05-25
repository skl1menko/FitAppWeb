import { useCallback, useState } from "react";

export const getErrorMessage = (error, fallbackMessage) => (
    error?.response?.data?.message
    || error?.response?.data?.error
    || error?.message
    || fallbackMessage
);

const useAsyncFeedback = () => {
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const clearFeedback = useCallback(() => {
        setMessage("");
        setError("");
    }, []);

    const setSuccess = useCallback((nextMessage) => {
        setError("");
        setMessage(nextMessage);
    }, []);

    const setFailure = useCallback((nextError) => {
        setMessage("");
        setError(nextError);
    }, []);

    return {
        message,
        error,
        clearFeedback,
        setSuccess,
        setFailure
    };
};

export default useAsyncFeedback;
