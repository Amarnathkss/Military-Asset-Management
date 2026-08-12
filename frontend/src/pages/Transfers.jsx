import { useState } from "react";
import {
    ArrowRightLeft,
    ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import { createTransfer } from "../services/transferService";

const Transfers = () => {
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        sourceBaseId: "",
        destinationBaseId: "",
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

        const {
            sourceBaseId,
            destinationBaseId,
            equipmentTypeId,
            quantity,
        } = formData;

        if (
            !sourceBaseId ||
            !destinationBaseId ||
            !equipmentTypeId ||
            !quantity
        ) {
            toast.error("Please fill in all fields.");
            return;
        }

        if (sourceBaseId === destinationBaseId) {
            toast.error(
                "Source and destination bases must be different."
            );
            return;
        }

        if (Number(quantity) <= 0) {
            toast.error(
                "Quantity must be greater than zero."
            );
            return;
        }

        try {
            setIsSubmitting(true);

            const result = await createTransfer({
                sourceBaseId: Number(sourceBaseId),
                destinationBaseId: Number(destinationBaseId),
                equipmentTypeId: Number(equipmentTypeId),
                quantity: Number(quantity),
            });

            toast.success(
                result.message ||
                "Transfer completed successfully!"
            );

            setFormData({
                sourceBaseId: "",
                destinationBaseId: "",
                equipmentTypeId: "",
                quantity: "",
            });
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Transfer failed.";

            toast.error(message);
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
                        <ArrowRightLeft size={24} />
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Transfers
                        </h1>

                        <p className="text-slate-500 mt-1">
                            Transfer military assets between bases.
                        </p>
                    </div>
                </div>
            </div>

            {/* Transfer Form */}
            <div className="max-w-3xl bg-white border border-slate-200 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-slate-900">
                    Create Transfer
                </h2>

                <p className="text-sm text-slate-500 mt-1 mb-6">
                    Select the source, destination, equipment and
                    quantity.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    {/* Source and Destination */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Source Base
                            </label>

                            <select
                                name="sourceBaseId"
                                value={formData.sourceBaseId}
                                onChange={handleChange}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white"
                            >
                                <option value="">
                                    Select source base
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

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Destination Base
                            </label>

                            <select
                                name="destinationBaseId"
                                value={
                                    formData.destinationBaseId
                                }
                                onChange={handleChange}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white"
                            >
                                <option value="">
                                    Select destination base
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

                    {/* Transfer Preview */}
                    {formData.sourceBaseId &&
                        formData.destinationBaseId && (
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                                <div className="flex items-center justify-center gap-4 text-sm">
                                    <span className="font-medium">
                                        {getBaseName(
                                            formData.sourceBaseId
                                        )}
                                    </span>

                                    <ArrowRight
                                        size={18}
                                        className="text-slate-500"
                                    />

                                    <span className="font-medium">
                                        {getBaseName(
                                            formData.destinationBaseId
                                        )}
                                    </span>
                                </div>
                            </div>
                        )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 disabled:opacity-50"
                    >
                        {isSubmitting
                            ? "Processing Transfer..."
                            : "Complete Transfer"}
                    </button>
                </form>
            </div>
        </div>
    );
};

const getBaseName = (baseId) => {
    const bases = {
        1: "Fort Alpha",
        2: "Fort Bravo",
        3: "Fort Charlie",
    };

    return bases[baseId] || "Unknown Base";
};

export default Transfers;