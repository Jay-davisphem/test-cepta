"use client"; 

import { useState } from "react";
import { useRouter } from "next/navigation";
import { attemptSponsor } from "../_cepta_api";

export default function DonatePage() {
    const [amount, setAmount] = useState("");
    const [currency, setCurrency] = useState("NGN"); // Default currency
    const [email, setEmail] = useState(""); // Email field
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const response = await attemptSponsor({ amount, currency, email });

        setLoading(false);
        console.log(response, "my response");
        const paymentUrl = response?.data?.paymentUrl;
        if (paymentUrl) {
            window.open(paymentUrl, "_blank");
        } else {
            alert("Payment failed. Try again.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">Make a Donation</h2>
            <form onSubmit={handleSubmit} className="w-full max-w-sm p-6 border border-gray-300 rounded-md bg-white shadow-sm">
                <label className="block mb-4">
                    <span className="text-gray-700">Amount ({currency})</span>
                    <input
                        type="number"
                        className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none text-gray-800"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </label>

                <label className="block mb-4">
                    <span className="text-gray-700">Email Address</span>
                    <input
                        type="email"
                        className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none text-gray-800"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>

                <label className="block mb-6">
                    <span className="text-gray-700">Currency</span>
                    <select
                        className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none text-gray-800"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        required
                    >
                        <option value="NGN">NGN - Nigerian Naira</option>
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                    </select>
                </label>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 outline-none"
                >
                    {loading ? "Processing..." : "Donate Now"}
                </button>
                <button
                    type="button"
                    className="w-full mt-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 outline-none"
                    onClick={() => router.push('/')}
                >
                    Return to Home Page
                </button>
            </form>
        </div>
    );
}
