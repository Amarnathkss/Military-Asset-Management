import { useState } from "react";
import { PackagePlus } from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import { createPurchase } from "../services/purchaseService";

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
        </div>
    );
};

export default Purchases;