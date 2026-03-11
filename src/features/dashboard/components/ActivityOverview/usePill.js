import { useRef, useState, useEffect } from "react";

const usePill = (activeIndex) => {
    const refs = useRef([]);
    const [style, setStyle] = useState({});

    useEffect(() => {
        const btn = refs.current[activeIndex];
        if (btn) setStyle({ left: btn.offsetLeft, width: btn.offsetWidth });
    }, [activeIndex]);

    return { refs, style };
};

export default usePill;
