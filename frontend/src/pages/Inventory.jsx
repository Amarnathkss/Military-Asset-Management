import { useEffect, useState } from "react";
import {
    Boxes,
    RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import { getInventoryMetrics } from "../services/inventoryService";

const BASES = [
    {
        id: 1,
        name: "Fort Alpha",
    },
    {
        id: 2,
        name: "Fort Bravo",
    },
    {
        id: 3,
        name: "Fort Charlie",
    },
];

const EQUIPMENT_TYPES = [
    {
        id: 1,
        name: "M4 Rifle",
    },
    {
        id: 2,
        name: "5.56mm Ammunition",
    },
    {
        id: 3,
        name: "Humvee",
    },
    {
        id: 4,
        name: "Pistol",
    },
];

const Inventory = () => {
    const { user } = useAuth();

    const [inventory, setInventory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadInventory = async () => {
        try {
            setIsLoading(true);

            const bases =
                user?.role === "BASE_COMMANDER"
                    ? BASES.filter(
                        (base) =>
                            base.id ===
                            Number(user.baseId)
                    )
                    : BASES;

            const requests = [];

            for (const base of bases) {
                for (const equipment of EQUIPMENT_TYPES) {
                    requests.push(
                        getInventoryMetrics({
                            baseId: base.id,
                            equipmentTypeId:
                                equipment.id,
                        }).then((metrics) => ({
                            baseId: base.id,
                            baseName: base.name,
                            equipmentTypeId:
                                equipment.id,
                            equipmentName:
                                equipment.name,
                            available:
                                metrics.closingBalance,
                        }))
                    );
                }
            }

            const results = await Promise.all(
                requests
            );

            setInventory(results);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to load inventory."
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadInventory();
    }, [user]);

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="bg-slate-900 text-white p-3 rounded-xl">
                            <Boxes size={24} />
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">
                                Inventory
                            </h1>

                            <p className="text-slate-500 mt-1">
                                View current calculated inventory by
                                base and equipment type.
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={loadInventory}
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
                    <h2 className="font-semibold text-slate-900">
                        Current Inventory
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                        Calculated from recorded asset movements.
                    </p>
                </div>

                {isLoading ? (
                    <InventorySkeleton />
                ) : inventory.length === 0 ? (
                    <div className="p-10 text-center">
                        <Boxes
                            size={40}
                            className="mx-auto text-slate-300"
                        />

                        <p className="text-slate-500 mt-3">
                            No inventory data available.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                        Base
                                    </th>

                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                        Equipment
                                    </th>

                                    <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                        Available
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {inventory.map(
                                    (item) => (
                                        <tr
                                            key={`${item.baseId}-${item.equipmentTypeId}`}
                                            className="hover:bg-slate-50"
                                        >
                                            <td className="px-6 py-4 font-medium text-slate-900">
                                                {
                                                    item.baseName
                                                }
                                            </td>

                                            <td className="px-6 py-4 text-slate-600">
                                                {
                                                    item.equipmentName
                                                }
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${item.available >
                                                        0
                                                        ? "bg-slate-100 text-slate-800"
                                                        : "bg-slate-50 text-slate-400"
                                                        }`}
                                                >
                                                    {
                                                        item.available
                                                    }
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

const InventorySkeleton = () => {
    return (
        <div className="p-6 space-y-4 animate-pulse">
            {[1, 2, 3, 4, 5].map(
                (item) => (
                    <div
                        key={item}
                        className="h-12 bg-slate-100 rounded-lg"
                    />
                )
            )}
        </div>
    );
};

export default Inventory;