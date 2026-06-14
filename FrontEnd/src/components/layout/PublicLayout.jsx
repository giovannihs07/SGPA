import { Outlet } from "react-router-dom";
import { PublicHeader } from "./PublicHeader";
import { Footer } from "./Footer";
import { surface } from "../ui/themeTokens";

export const PublicLayout = () => (
    <div className={`min-h-screen flex flex-col ${surface.page}`}>
        <PublicHeader />
        <main className="flex-1">
            <Outlet />
        </main>
        <Footer />
    </div>
);
