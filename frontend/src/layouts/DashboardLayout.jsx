import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-slate-100 flex">
            <Sidebar />

            <main className="flex-1 min-w-0">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;