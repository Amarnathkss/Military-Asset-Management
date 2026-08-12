import { useEffect, useState } from "react";
import {
    ArrowDownLeft,
    ArrowDownRight,
    ArrowUpRight,
    Boxes,
    PackageCheck,
    PackageMinus,
    TrendingUp,
} from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Dashboard = () => {
    const { user } = useAuth();

    const [metrics, setMetrics] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        baseId:
            user?.role === "BASE_COMMANDER"
                ? String(user.baseId)
                : "",
        equipmentTypeId: "",
        startDate: "",
        endDate: "",
    });
    const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);

    const fetchMetrics = async () => {
        try {
            setIsLoading(true);

            const params = {};

            if (filters.baseId) {
                params.baseId = filters.baseId;
            }

            if (filters.equipmentTypeId) {
                params.equipmentTypeId = filters.equipmentTypeId;
            }

            if (filters.startDate) {
                params.startDate = filters.startDate;
            }

            if (filters.endDate) {
                params.endDate = filters.endDate;
            }

            const response = await api.get("/assets/dashboard", {
                params,
            });

            setMetrics(response.data);
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Failed to load dashboard.";

            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMetrics();
    }, [filters]);

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    if (!metrics) {
        return (
            <div className="p-8">
                <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
                    <p className="text-slate-500">
                        Unable to load dashboard data.
                    </p>

                    <button
                        onClick={fetchMetrics}
                        className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Dashboard
                        </h1>

                        <p className="text-slate-500 mt-1">
                            Monitor assets, inventory movements and
                            operational activity.
                        </p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3">
                        <p className="text-xs text-slate-500 uppercase tracking-wide">
                            Logged in as
                        </p>

                        <p className="font-semibold text-slate-900">
                            {user?.username}
                        </p>

                        <p className="text-xs text-slate-500">
                            {user?.role?.replaceAll("_", " ")}
                            {user?.baseId
                                ? ` • Base #${user.baseId}`
                                : " • Global Access"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="font-semibold text-slate-900">
                            Filters
                        </h2>

                        <p className="text-sm text-slate-500">
                            Filter inventory metrics by base, equipment and period.
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            setFilters({
                                baseId: "",
                                equipmentTypeId: "",
                                startDate: "",
                                endDate: "",
                            })
                        }
                        className="text-sm text-slate-600 hover:text-slate-900"
                    >
                        Clear filters
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Base
                        </label>

                        <select
                            value={
                                user?.role === "BASE_COMMANDER"
                                    ? user.baseId
                                    : filters.baseId
                            }
                            disabled={user?.role === "BASE_COMMANDER"}
                            onChange={(e) =>
                                setFilters((current) => ({
                                    ...current,
                                    baseId: e.target.value,
                                }))
                            }
                            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white disabled:bg-slate-100 disabled:text-slate-500"
                        >
                            {user?.role !== "BASE_COMMANDER" && (
                                <option value="">All Bases</option>
                            )}

                            <option value="1">Fort Alpha</option>
                            <option value="2">Fort Bravo</option>
                            <option value="3">Fort Charlie</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Equipment
                        </label>

                        <select
                            value={filters.equipmentTypeId}
                            onChange={(e) =>
                                setFilters((current) => ({
                                    ...current,
                                    equipmentTypeId: e.target.value,
                                }))
                            }
                            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white"
                        >
                            <option value="">All Equipment</option>
                            <option value="1">M4 Rifle</option>
                            <option value="2">5.56mm Ammunition</option>
                            <option value="3">Humvee</option>
                            <option value="4">Pistol</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            From
                        </label>

                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) =>
                                setFilters((current) => ({
                                    ...current,
                                    startDate: e.target.value,
                                }))
                            }
                            className="w-full border border-slate-300 rounded-lg px-3 py-2.5"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            To
                        </label>

                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) =>
                                setFilters((current) => ({
                                    ...current,
                                    endDate: e.target.value,
                                }))
                            }
                            className="w-full border border-slate-300 rounded-lg px-3 py-2.5"
                        />
                    </div>
                </div>
            </div>

            {/* Main Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <MetricCard
                    title="Opening Balance"
                    value={metrics.openingBalance}
                    icon={Boxes}
                    description="Starting inventory"
                />

                <MetricCard
                    title="Net Movement"
                    value={metrics.netMovement}
                    icon={TrendingUp}
                    description="Net asset movement"
                />

                <MetricCard
                    title="Assigned"
                    value={metrics.assigned}
                    icon={PackageCheck}
                    description="Assets assigned"
                />

                <MetricCard
                    title="Expended"
                    value={metrics.expended}
                    icon={PackageMinus}
                    description="Assets expended"
                />
            </div>

            {/* Movement Breakdown */}
            <div className="mt-6 bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Net Movement Breakdown
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                        How inventory changed during the selected period.
                    </p>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <MovementCard
                        title="Purchases"
                        value={metrics.purchases}
                        icon={ArrowDownLeft}
                    />

                    <MovementCard
                        title="Transfers In"
                        value={metrics.transfersIn}
                        icon={ArrowDownLeft}
                    />

                    <MovementCard
                        title="Transfers Out"
                        value={metrics.transfersOut}
                        icon={ArrowUpRight}
                    />
                </div>

                <div
                    onClick={() => setIsMovementModalOpen(true)}
                    className="cursor-pointer hover:shadow-2xl transition hover:bg-gray-100"
                >
                    <div className="border-t border-slate-200 px-6 py-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">
                                    Net Movement
                                </p>

                                <p className="text-xs text-slate-400 mt-1">
                                    Purchases + Transfers In − Transfers Out
                                </p>
                            </div>

                            <p className="text-2xl font-bold text-slate-900">
                                {metrics.netMovement}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Closing Balance */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-950 text-white rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">
                                Closing Balance
                            </p>

                            <p className="text-4xl font-bold mt-2">
                                {metrics.closingBalance}
                            </p>

                            <p className="text-sm text-slate-400 mt-2">
                                Current calculated available inventory
                            </p>
                        </div>

                        <Boxes size={42} className="text-slate-400" />
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                    <h2 className="font-semibold text-slate-900">
                        Inventory Calculation
                    </h2>

                    <div className="mt-4 space-y-3 text-sm">
                        <CalculationRow
                            label="Opening Balance"
                            value={metrics.openingBalance}
                        />

                        <CalculationRow
                            label="+ Net Movement"
                            value={metrics.netMovement}
                        />

                        <CalculationRow
                            label="− Assigned"
                            value={metrics.assigned}
                        />

                        <CalculationRow
                            label="− Expended"
                            value={metrics.expended}
                        />

                        <div className="border-t border-slate-200 pt-3 flex justify-between font-bold">
                            <span>Closing Balance</span>
                            <span>{metrics.closingBalance}</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Net Movement Modal */}
            {isMovementModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                    onClick={() => setIsMovementModalOpen(false)}
                >
                    <div
                        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6"
                        onClick={(event) => event.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    Net Movement
                                </h2>

                                <p className="text-sm text-slate-500 mt-1">
                                    Breakdown of inventory movement
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    setIsMovementModalOpen(false)
                                }
                                className="text-slate-400 hover:text-slate-700 cursor-pointer text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        {/* Breakdown */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-600">
                                    Purchases
                                </span>

                                <span className="font-semibold text-slate-900">
                                    +{metrics.purchases}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-slate-600">
                                    Transfers In
                                </span>

                                <span className="font-semibold text-slate-900">
                                    +{metrics.transfersIn}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-slate-600">
                                    Transfers Out
                                </span>

                                <span className="font-semibold text-slate-900">
                                    -{metrics.transfersOut}
                                </span>
                            </div>

                            {/* Total */}
                            <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
                                <span className="font-semibold text-slate-900">
                                    Total Net
                                </span>

                                <span className="text-xl font-bold text-slate-900">
                                    {metrics.netMovement}
                                </span>
                            </div>
                        </div>

                        {/* Close */}
                        <button
                            onClick={() =>
                                setIsMovementModalOpen(false)
                            }
                            className="w-full mt-6 bg-slate-900 text-white py-2.5 rounded-lg font-semibold hover:bg-slate-800 hover:cursor-pointer"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const MetricCard = ({ title, value, icon: Icon, description }) => {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-slate-500">
                        {title}
                    </p>

                    <p className="text-3xl font-bold text-slate-900 mt-2">
                        {value}
                    </p>
                </div>

                <div className="bg-slate-100 p-3 rounded-xl">
                    <Icon size={20} className="text-slate-700" />
                </div>
            </div>

            <p className="text-xs text-slate-400 mt-4">
                {description}
            </p>
        </div>
    );
};

const MovementCard = ({ title, value, icon: Icon }) => {
    return (
        <div className="border border-slate-200 rounded-xl p-5">
            <div className="flex items-center gap-3">
                <div className="bg-slate-100 p-2.5 rounded-lg">
                    <Icon size={18} />
                </div>

                <p className="text-sm text-slate-500">
                    {title}
                </p>
            </div>

            <p className="text-2xl font-bold text-slate-900 mt-4">
                {value}
            </p>
        </div>
    );
};

const CalculationRow = ({ label, value }) => {
    return (
        <div className="flex justify-between">
            <span className="text-slate-500">
                {label}
            </span>

            <span className="font-medium">
                {value}
            </span>
        </div>
    );
};

const DashboardSkeleton = () => {
    return (
        <div className="p-6 lg:p-8 animate-pulse">
            <div className="h-8 w-48 bg-slate-200 rounded mb-2" />
            <div className="h-4 w-80 bg-slate-200 rounded mb-8" />

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((item) => (
                    <div
                        key={item}
                        className="h-36 bg-white border border-slate-200 rounded-2xl"
                    />
                ))}
            </div>

            <div className="h-72 bg-white border border-slate-200 rounded-2xl mt-6" />
        </div>
    );
};

export default Dashboard;