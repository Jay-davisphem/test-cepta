import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const secretKey = process.env.CEPTA_SECRET_KEY;
    const merchantId = process.env.CEPTA_MERCHANT_ID;

    if (!secretKey || !merchantId) {
      return NextResponse.json({ error: "Missing Cepta credentials" }, { status: 500 });
    }

    // Read headers
    const hashKey = req.headers.get("hash-key");
    if (!hashKey) {
      return NextResponse.json({ error: "Missing hash-key header" }, { status: 400 });
    }

    // Read payload
    const body = await req.json();

    // Validate signature
    const concatenatedString = `${secretKey}|${merchantId}`;
    const calculatedHash = crypto.createHash("sha512").update(concatenatedString).digest("hex");

    if (calculatedHash !== hashKey) {
      return NextResponse.json({ error: "Invalid signature hash" }, { status: 403 });
    }

    // Process event
    const { eventType, data } = body;
    console.log("Received event:", eventType, data);

    // Ensure transaction is successful before proceeding
    if (data.status !== "SUCCESSFUL") {
      return NextResponse.json({ message: "Transaction not successful" }, { status: 200 });
    }
    
    // ToDO: Implement business logic (e.g., update order status, notify user, etc.)
    
    return NextResponse.json({ message: "Webhook received successfully" }, { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
