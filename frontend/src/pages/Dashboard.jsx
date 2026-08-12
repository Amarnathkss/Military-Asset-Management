import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Dashboard = () => {
    const { user } = useAuth();

    const [metrics, setMetrics] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await api.get(
                    "/assets/dashboard"
                );

                setMetrics(response.data);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load dashboard."
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    if (isLoading) {
        return (
            <div className="p-8">
                Loading dashboard...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-red-600">
                {error}
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold">
                Dashboard
            </h1>

            <p className="text-slate-500 mt-2">
                Welcome, {user?.username}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                <MetricCard
                    title="Opening Balance"
                    value={metrics.openingBalance}
                />

                <MetricCard
                    title="Net Movement"
                    value={metrics.netMovement}
                />

                <MetricCard
                    title="Assigned"
                    value={metrics.assigned}
                />

                <MetricCard
                    title="Expended"
                    value={metrics.expended}
                />
            </div>

            <div className="mt-8 bg-white rounded-xl border p-6">
                <h2 className="text-xl font-semibold">
                    Inventory Summary
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <SummaryItem
                        label="Purchases"
                        value={metrics.purchases}
                    />

                    <SummaryItem
                        label="Transfers In"
                        value={metrics.transfersIn}
                    />

                    <SummaryItem
                        label="Transfers Out"
                        value={metrics.transfersOut}
                    />
                </div>

                <div className="border-t mt-6 pt-6">
                    <div className="flex justify-between text-lg font-bold">
                        <span>Closing Balance</span>
                        <span>{metrics.closingBalance}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MetricCard = ({ title, value }) => (
    <div className="bg-white border rounded-xl p-5">
        <p className="text-sm text-slate-500">
            {title}
        </p>

        <p className="text-3xl font-bold mt-2">
            {value}
        </p>
    </div>
);

const SummaryItem = ({ label, value }) => (
    <div>
        <p className="text-sm text-slate-500">
            {label}
        </p>

        <p className="text-2xl font-semibold mt-1">
            {value}
        </p>
    </div>
);

export default Dashboard;