import { useState } from "react";

const useActionKey = () => {
    const [activeActionKey, setActiveActionKey] = useState("");

    const startAction = (actionKey) => {
        setActiveActionKey(actionKey);
    };

    const finishAction = () => {
        setActiveActionKey("");
    };

    const isActionActive = (actionKey) => activeActionKey === actionKey;

    return {
        activeActionKey,
        startAction,
        finishAction,
        isActionActive
    };
};

export default useActionKey;
