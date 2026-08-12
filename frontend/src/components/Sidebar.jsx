import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    ArrowRightLeft,
    UserRoundCheck,
    FileWarning,
    ClipboardList,
    LogOut,
    Shield,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
    const { user, logout } = useAuth();

    const menuItems = [
        {
            label: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard,
            roles: [
                "ADMIN",
                "BASE_COMMANDER",
                "LOGISTICS_OFFICER",
            ],
        },
        {
            label: "Inventory",
            path: "/inventory",
            icon: Package,
            roles: [
                "ADMIN",
                "BASE_COMMANDER",
                "LOGISTICS_OFFICER",
            ],
        },
        {
            label: "Purchases",
            path: "/purchases",
            icon: ShoppingCart,
            roles: [
                "ADMIN",
                "LOGISTICS_OFFICER",
            ],
        },
        {
            label: "Transfers",
            path: "/transfers",
            icon: ArrowRightLeft,
            roles: [
                "ADMIN",
                "LOGISTICS_OFFICER",
            ],
        },
        {
            label: "Assignments",
            path: "/assignments",
            icon: UserRoundCheck,
            roles: [
                "ADMIN",
                "BASE_COMMANDER",
            ],
        },
        {
            label: "Expenditures",
            path: "/expenditures",
            icon: FileWarning,
            roles: [
                "ADMIN",
                "BASE_COMMANDER",
            ],
        },
        {
            label: "Audit Logs",
            path: "/audit-logs",
            icon: ClipboardList,
            roles: ["ADMIN"],
        },
    ];

    const visibleItems = menuItems.filter((item) =>
        item.roles.includes(user?.role)
    );

    const handleLogout = () => {
        logout();
    };

    return (
        <aside className="w-64 min-h-screen bg-slate-950 text-white flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="bg-white text-slate-950 p-2 rounded-lg">
                        <Shield size={22} />
                    </div>

                    <div>
                        <h1 className="font-bold text-sm">
                            Military Asset
                        </h1>

                        <p className="text-xs text-slate-400">
                            Management System
                        </p>
                    </div>
                </div>
            </div>

            {/* User */}
            <div className="p-4 border-b border-slate-800">
                <p className="text-sm font-medium">
                    {user?.username}
                </p>

                <p className="text-xs text-slate-400 mt-1">
                    {user?.role?.replaceAll("_", " ")}
                </p>

                {user?.baseId && (
                    <p className="text-xs text-slate-500 mt-1">
                        Base #{user.baseId}
                    </p>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {visibleItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${isActive
                                    ? "bg-white text-slate-950"
                                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                }`
                            }
                        >
                            <Icon size={18} />

                            <span>{item.label}</span>
                        </NavLink>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-red-950 hover:text-red-300 transition"
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;