import { useEffect, useState } from "react";
import {
    ShieldCheck,
    RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

import { getAuditLogs } from "../services/auditService";

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadLogs = async () => {
        try {
            setIsLoading(true);

            const data = await getAuditLogs();

            setLogs(data.logs || []);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to load audit logs."
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadLogs();
    }, []);

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="bg-slate-900 text-white p-3 rounded-xl">
                        <ShieldCheck size={24} />
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Audit Logs
                        </h1>

                        <p className="text-slate-500 mt-1">
                            Review system activity and recorded operations.
                        </p>
                    </div>
                </div>

                <button
                    onClick={loadLogs}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50"
                >
                    <RefreshCw
                        size={17}
                        className={
                            isLoading
                                ? "animate-spin"
                                : ""
                        }
                    />

                    Refresh
                </button>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Activity History
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                        Recorded actions performed by system users.
                    </p>
                </div>

                {isLoading ? (
                    <div className="p-6 space-y-3">
                        <div className="h-10 bg-slate-100 rounded animate-pulse" />
                        <div className="h-10 bg-slate-100 rounded animate-pulse" />
                        <div className="h-10 bg-slate-100 rounded animate-pulse" />
                    </div>
                ) : logs.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                        No audit logs found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                                        User
                                    </th>

                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                                        Role
                                    </th>

                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                                        Action
                                    </th>

                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                                        Details
                                    </th>

                                    <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                                        Date
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {logs.map((log) => (
                                    <tr
                                        key={log.id}
                                        className="hover:bg-slate-50"
                                    >
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            {log.username ||
                                                `User #${log.user_id}`}
                                        </td>

                                        <td className="px-6 py-4 text-slate-600">
                                            {log.role ||
                                                "Unknown"}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                                                {log.action}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-slate-600 max-w-xl">
                                            {log.details}
                                        </td>

                                        <td className="px-6 py-4 text-right text-sm text-slate-500 whitespace-nowrap">
                                            {new Date(
                                                log.created_at
                                            ).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuditLogs;