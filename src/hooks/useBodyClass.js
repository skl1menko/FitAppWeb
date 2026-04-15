import { useEffect } from "react";

const bodyClassUsage = new Map();

const useBodyClass = (className) => {
    useEffect(() => {
        if (!className) return undefined;

        const nextCount = (bodyClassUsage.get(className) || 0) + 1;
        bodyClassUsage.set(className, nextCount);
        document.body.classList.add(className);

        return () => {
            const currentCount = bodyClassUsage.get(className) || 0;
            const nextValue = currentCount - 1;

            if (nextValue <= 0) {
                bodyClassUsage.delete(className);
                document.body.classList.remove(className);
                return;
            }

            bodyClassUsage.set(className, nextValue);
        };
    }, [className]);
};

export default useBodyClass;