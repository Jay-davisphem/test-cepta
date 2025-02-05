"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "redaxios";
import { encryptCardDetails } from "../_utils/encryption";

export default function BuyPrepaidPage() {
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [pin, setPin] = useState('');
  const [currency, setCurrency] = useState("NGN");
  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState({});
  const [ot, setOt] = useState(''); 
  const router = useRouter();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const dates = expiryDate.split('/')
    const cardDetails = {
        expiryYear: dates[1],
        expiryMonth: dates[0],
        cardNumber,
        cvv,
        pin
    };

    const key = process.env.NEXT_PUBLIC_CEPTA_AES_KEY;
    const iv = process.env.NEXT_PUBLIC_CEPTA_AES_IV;
    const encryptedCard = await encryptCardDetails(cardDetails, key, iv);
    const data = {
        transactionRef: crypto.randomUUID(),
        customerEmail: email,
        amount,
        currency,
        ipAddress: "192.168.1.1",
        callbackUrl: "",
        cardDetails: encryptedCard,
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
    };
    
    try {
      const response = await axios.post("https://dev-adapter.cepta.co/api/v1/pay/purchase", data, {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_CEPTA_SK_KEY,
          "Content-Type": "application/json",
        }
      });
      
      if (response.data.status) {
        setShowOtpModal(true);
        setOtp({
          transactionRef: response.data.data.transactionRef,
          paymentId: response.data.data.transactionId,
          md: encryptedCard
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("There was an issue processing your payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    try {
      const response = await axios.post("https://dev-adapter.cepta.co/api/v1/pay/validate-otp", {...otp, otp: ot}, {headers: {
        Authorization: process.env.NEXT_PUBLIC_CEPTA_SK_KEY,
        "Content-Type": "application/json",
      }});
      if (response.data.status) {
        alert("Payment successful!");
        await confirmPayment()
        setShowOtpModal(false);
      } else {
        alert("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      alert("Failed to verify OTP. Try again.");
    }
  };

  const confirmPayment = async () => {
    try {
      const response = await axios.get(`https://dev-adapter.cepta.co/api/v1/pay/confirm-status?TransactionRef=${otp.transactionRef}`, {headers: {
        Authorization: process.env.NEXT_PUBLIC_CEPTA_SK_KEY,
        "Content-Type": "application/json",
      }});
      if (response.data.data.status == 'Completed') {
        alert("Payment confirmed!");
        setShowOtpModal(false);
      } else {
        alert("Payment not confirmed");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      alert("Failed to confirm payment.");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-6 py-16 sm:px-8 sm:py-20">
          <main className="flex flex-col items-center justify-center">
            <form onSubmit={handleSubmit} className="w-96 p-4 border rounded shadow">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">Buy Prepaid Code</h2>
              <label className="block mb-2 text-gray-700">
                Amount ({currency})
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required className="w-full p-2 border rounded text-gray-800" />
              </label>
              <label className="block mb-2 text-gray-700">
                Email Address
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-2 border rounded text-gray-800" />
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

              <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                {loading ? "Processing..." : "Submit Payment"}
              </button>
              <button
                    type="button"
                    className="w-full mt-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 outline-none"
                    onClick={() => router.push('/')}
                >
                    Return to Home Page
                </button>
            </form>
          </main>
        </div>
      </div>
      {showOtpModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-80 text-center">
            <h2 className="text-xl font-bold mb-4 text-gray-500">Enter OTP</h2>
            <input type="text" value={ot} onChange={(e) => setOt(e.target.value)} className="w-full p-2 border rounded text-gray-800" placeholder="Enter OTP" />
            <div className="flex justify-between mt-4">
              <button onClick={handleOtpSubmit} className="w-1/2 bg-blue-500 text-white py-2 rounded hover:bg-green-600">Submit</button>
              <button onClick={async () => {
                setShowOtpModal(false)
                await confirmPayment()
                }} className="w-1/2 bg-red-500 text-white py-2 rounded hover:bg-red-600 ml-2">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
