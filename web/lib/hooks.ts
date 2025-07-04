import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { useActiveSectionContext } from "./active-section-context";
import type { SectionName } from "./types";

export function useSectionInView(sectionName: SectionName, threshold: number = 0.75) {
    const { ref, inView } = useInView({
        threshold
    });

    const { setActiveSection, timeOfLastClick } = useActiveSectionContext();

    useEffect(() => {
        if (inView && Date.now() - timeOfLastClick > 1000) {
            setActiveSection(sectionName);
        }
    }, [inView, setActiveSection, timeOfLastClick, sectionName]);

    return {
        ref
    };
}