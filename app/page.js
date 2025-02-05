"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "redaxios";
import { Header } from "./_components/Header";
import { ActionButtons } from "./_components/ActionBtns";

// Separate Client Component for search params and API call
function TransactionVerifier() {
  const searchParams = useSearchParams();
  const transactionRef = searchParams.get("transactionRef");
  const [verificationStatus, setVerificationStatus] = useState(null);

  useEffect(() => {
    if (transactionRef) {
      axios
        .get(`https://dev-adapter.cepta.co/api/v1/pay/verify-payment?TransactionRef=${transactionRef}`)
        .then((response) => {
          setVerificationStatus(response.data.status);
        })
        .catch((error) => {
          console.error("Verification error:", error);
          setVerificationStatus("error");
        });
    }
  }, [transactionRef]);

  if (!transactionRef) return null; // Don't render if there's no transactionRef

  return (
    <div className="mt-4 p-4 border rounded bg-white shadow">
      {verificationStatus === null ? (
        <p>Verifying transaction...</p>
      ) : verificationStatus === "success" ? (
        <p className="text-green-600">Transaction verified successfully!</p>
      ) : verificationStatus === "failed" ? (
        <p className="text-red-600">Transaction verification failed.</p>
      ) : verificationStatus === "error" ? (
        <p className="text-red-600">An error occurred during verification.</p>
      ) : (
        <p>{verificationStatus}</p>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-6 py-16 sm:px-8 sm:py-20">
        <main className="flex flex-col items-center justify-center">
          <Header />
          <ActionButtons />
          <TransactionVerifier /> {/* Moved useSearchParams() here */}
        </main>
      </div>
    </div>
  );
}
