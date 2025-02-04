"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "redaxios";
import { encryptCardDetails } from "../_utils/encryption"; // Ensure this handles the encryption

export default function BuyPrepaidPage() {
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [pin, setPin] = useState('')
  const [currency, setCurrency] = useState("NGN"); // Default currency
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const dates = expiryDate.split('/')
    // Combine all card details into a single object
    const cardDetails = {
        expiryYear: dates[1],
        expiryMonth: dates[0],
        cardNumber,
        cvv,
        pin
    };

    // AES encryption using 16-byte key and IV
    const key = process.env.NEXT_PUBLIC_CEPTA_AES_KEY
    const iv = process.env.NEXT_PUBLIC_CEPTA_AES_IV;
    const encryptedCard = await encryptCardDetails(cardDetails, key, iv);
    const data = {
        transactionRef: `TX${Date.now()}`, // Transaction reference
        customerEmail: email,
        amount,
        currency, // Currency from state
        ipAddress: "192.168.1.1", // Can be dynamically obtained
        callbackUrl: "",
        cardDetails: encryptedCard, // Encrypted card details
        deviceInformation: {
          httpBrowserLanguage: "en-US",
          httpBrowserJavaEnabled: true,
          httpBrowserJavaScriptEnabled: true,
          httpBrowserColorDepth: "24",
          httpBrowserScreenHeight: "1080",
          httpBrowserScreenWidth: "1920",
          httpBrowserTimeDifference: "-60", 
          userAgentBrowserValue: navigator.userAgent,
          deviceChannel: "Web",
        },
      }

    
    try {
      const response = await axios.post("https://dev-adapter.cepta.co/api/v1/pay/purchase", data, {
        headers: {
            Authorization: process.env.NEXT_PUBLIC_CEPTA_SK_KEY,
        "Content-Type": "application/json",
        }
      });

      if (response.data?.paymentUrl) {
        window.location.href = response.data.paymentUrl; // Redirect user to payment page
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("There was an issue processing your payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-6 py-16 sm:px-8 sm:py-20">
        <main className="flex flex-col items-center justify-center">
          <form onSubmit={handleSubmit} className="w-96 p-4 border rounded shadow">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Buy Prepaid Code</h2>
            <label className="block mb-2 text-gray-700">
              Amount ({currency})
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full p-2 border rounded text-gray-800"
              />
            </label>
            <label className="block mb-2 text-gray-700">
              Email Address
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 border rounded text-gray-800"
              />
            </label>
            
            <label className="block mb-2 text-gray-700">
              Card Number
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
                className="w-full p-2 border rounded text-gray-800"
                placeholder="Enter card number"
              />
            </label>
            <label className="block mb-2 text-gray-700">
              Expiry Date (MM/YY)
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                required
                className="w-full p-2 border rounded text-gray-800"
                placeholder="MM/YY"
              />
            </label>
            <label className="block mb-2 text-gray-700">
              CVV
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                required
                className="w-full p-2 border rounded text-gray-800"
                placeholder="CVV"
              />
            </label>
            {/* Card details form */}
            <label className="block mb-2 text-gray-700">
              Card Pin
              <input
                type="text"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
                className="w-full p-2 border rounded text-gray-800"
                placeholder="Card PIN"
              />
            </label>
            {/* Currency dropdown */}
            <label className="block mb-4">
              Currency
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-2 border rounded text-gray-800"
              >
                <option value="NGN">NGN</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </label>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              {loading ? "Processing..." : "Submit Payment"}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
