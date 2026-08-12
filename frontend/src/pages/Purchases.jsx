import { useState, useEffect } from "react";
import { PackagePlus } from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import { createPurchase, getPurchases } from "../services/purchaseService";

const Purchases = () => {
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        baseId:
            user?.role === "BASE_COMMANDER"
                ? String(user.baseId)
                : "",
        equipmentTypeId: "",
        quantity: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [purchases, setPurchases] = useState([]);
    const [isHistoryLoading, setIsHistoryLoading] = useState(true);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (
            !formData.baseId ||
            !formData.equipmentTypeId ||
            !formData.quantity
        ) {
            toast.error("Please fill in all fields.");
            return;
        }

        if (Number(formData.quantity) <= 0) {
            toast.error("Quantity must be greater than zero.");
            return;
        }

        try {
            setIsSubmitting(true);

            await createPurchase({
                baseId: Number(formData.baseId),
                equipmentTypeId: Number(
                    formData.equipmentTypeId
                ),
                quantity: Number(formData.quantity),
            });

            await loadPurchases();

            toast.success(
                "Purchase recorded successfully!"
            );

            setFormData({
                baseId:
                    user?.role === "BASE_COMMANDER"
                        ? String(user.baseId)
                        : "",
                equipmentTypeId: "",
                quantity: "",
            });
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to record purchase."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const loadPurchases = async () => {
        try {
            setIsHistoryLoading(true);

            const data = await getPurchases();

            setPurchases(data.purchases || []);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to load purchase history."
            );
        } finally {
            setIsHistoryLoading(false);
        }
    };

    useEffect(() => {
        loadPurchases();
    }, []);

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3">
                    <div className="bg-slate-900 text-white p-3 rounded-xl">
                        <PackagePlus size={24} />
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Purchases
                        </h1>

                        <p className="text-slate-500 mt-1">
                            Record newly purchased military assets.
                        </p>
                    </div>
                </div>
            </div>

            {/* Purchase Form */}
            <div className="max-w-2xl bg-white border border-slate-200 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-slate-900">
                    Record Purchase
                </h2>

                <p className="text-sm text-slate-500 mt-1 mb-6">
                    Enter the equipment and quantity purchased.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    {/* Base */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Base
                        </label>

                        <select
                            name="baseId"
                            value={formData.baseId}
                            onChange={handleChange}
                            disabled={
                                user?.role ===
                                "BASE_COMMANDER"
                            }
                            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white disabled:bg-slate-100"
                        >
                            <option value="">
                                Select base
                            </option>

                            <option value="1">
                                Fort Alpha
                            </option>

                            <option value="2">
                                Fort Bravo
                            </option>

                            <option value="3">
                                Fort Charlie
                            </option>
                        </select>
                    </div>

                    {/* Equipment */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Equipment Type
                        </label>

                        <select
                            name="equipmentTypeId"
                            value={
                                formData.equipmentTypeId
                            }
                            onChange={handleChange}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white"
                        >
                            <option value="">
                                Select equipment
                            </option>

                            <option value="1">
                                M4 Rifle
                            </option>

                            <option value="2">
                                5.56mm Ammunition
                            </option>

                            <option value="3">
                                Humvee
                            </option>

                            <option value="4">
                                Pistol
                            </option>
                        </select>
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Quantity
                        </label>

                        <input
                            type="number"
                            name="quantity"
                            min="1"
                            value={formData.quantity}
                            onChange={handleChange}
                            placeholder="Enter quantity"
                            className="w-full border border-slate-300 rounded-lg px-3 py-2.5"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 disabled:opacity-50"
                    >
                        {isSubmitting
                            ? "Recording..."
                            : "Record Purchase"}
                    </button>
                </form>
            </div>

            <div className="mt-8 bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Purchase History
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                        Previously recorded asset purchases.
                    </p>
                </div>

                {isHistoryLoading ? (
                    <div className="p-6 space-y-3">
                        <div className="h-10 bg-slate-100 rounded animate-pulse" />
                        <div className="h-10 bg-slate-100 rounded animate-pulse" />
                        <div className="h-10 bg-slate-100 rounded animate-pulse" />
                    </div>
                ) : purchases.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                        No purchase records found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                                        ID
                                    </th>

                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                                        Base
                                    </th>

                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                                        Equipment
                                    </th>

                                    <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                                        Quantity
                                    </th>

                                    <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                                        Date
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {purchases.map((purchase) => (
                                    <tr
                                        key={purchase.id}
                                        className="hover:bg-slate-50"
                                    >
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            #{purchase.id}
                                        </td>

                                        <td className="px-6 py-4 text-slate-600">
                                            {purchase.base_id === 1
                                                ? "Fort Alpha"
                                                : purchase.base_id === 2
                                                    ? "Fort Bravo"
                                                    : purchase.base_id === 3
                                                        ? "Fort Charlie"
                                                        : `Base #${purchase.base_id}`}
                                        </td>

                                        <td className="px-6 py-4 text-slate-600">
                                            {purchase.equipment_type_id === 1
                                                ? "M4 Rifle"
                                                : purchase.equipment_type_id === 2
                                                    ? "5.56mm Ammunition"
                                                    : purchase.equipment_type_id === 3
                                                        ? "Humvee"
                                                        : purchase.equipment_type_id === 4
                                                            ? "Pistol"
                                                            : `Equipment #${purchase.equipment_type_id}`}
                                        </td>

                                        <td className="px-6 py-4 text-right font-semibold text-slate-900">
                                            {purchase.quantity}
                                        </td>

                                        <td className="px-6 py-4 text-right text-slate-500">
                                            {new Date(
                                                purchase.created_at
                                            ).toLocaleDateString()}
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

export default Purchases;