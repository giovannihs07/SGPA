import { useState } from "react";

export const useSidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => setIsCollapsed(v => !v);

    return { isCollapsed, toggleSidebar };
};
