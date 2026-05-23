import { useState } from "react";

export const getErrorMessage = (error, fallbackMessage) => (
    error?.response?.data?.message
    || error?.response?.data?.error
    || error?.message
    || fallbackMessage
);

const useAsyncFeedback = () => {
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const clearFeedback = () => {
        setMessage("");
        setError("");
    };

    const setSuccess = (nextMessage) => {
        setError("");
        setMessage(nextMessage);
    };

    const setFailure = (nextError) => {
        setMessage("");
        setError(nextError);
    };

    return {
        message,
        error,
        clearFeedback,
        setSuccess,
        setFailure
    };
};

export default useAsyncFeedback;
