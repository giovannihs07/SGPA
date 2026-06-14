import { Outlet } from "react-router-dom";
import { PublicHeader } from "./PublicHeader";
import { PublicFooter } from "./PublicFooter";
import { surface } from "../ui/themeTokens";

export const PublicLayout = () => (
    <div className="min-h-screen flex flex-col">
        <PublicHeader />
        <main className={`flex-1 ${surface.page}`}>
            <Outlet />
        </main>
        <PublicFooter />
    </div>
);
