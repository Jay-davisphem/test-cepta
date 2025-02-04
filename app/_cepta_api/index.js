'use client'

import axios from "redaxios";

export async function attemptSponsor({ amount, currency, email = 'cus@gmail.com' }) {
    const url = "https://dev-adapter.cepta.co/api/v1/pay";
    const currentUrl = new URL(window.location.href);
    const domain = currentUrl.origin;
    console.log(domain, 'domain')
    const data = {
        amount: Number(amount),
        currency,
        description: "Donation",
        pageName: "Donate Page",
        transactionReference: crypto.randomUUID(),
        customerEmail: email,
        customUrl: domain,
        expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
    };

    try {
        const response = await axios.post(url, data, {
            headers: {
                Authorization: process.env.NEXT_PUBLIC_CEPTA_SK_KEY,
                "Content-Type": "application/json",
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error making payment:", error);
        return null;
    }
}

export async function attemptPrepaidPurchase({
    transactionRef,
    customerEmail,
    amount,
    currency,
    ipAddress,
    callbackUrl,
    cardDetails,
    deviceInformation,
  }) {
    const url = "https://dev-adapter.cepta.co/api/v1/pay/purchase";
  
    const data = {
      transactionRef,
      customerEmail,
      amount,
      currency,
      ipAddress,
      callbackUrl,
      cardDetails,
      deviceInformation,
    };
  
    try {
      const response = await axios.post(url, data, {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_CEPTA_SK_KEY,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error making purchase:", error);
      return null;
    }
  }
