"use client"
export const dynamic = "force-dynamic";


import React, { useState, useEffect } from "react";
import {
  Card, CardHeader, CardTitle, CardContent, CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/hooks/useAuth";
import { createVipPayment } from "@/lib/db";
import { useSearchParams } from "next/navigation";
import QrCode from "../../styles/QRCode.jpg"
import Image from "next/image";

export default function PaymentPage() {
  const { user } = useAuth();
  const params = useSearchParams();
  const costParam = Number(params.get("cost") ?? "0");
  const levelParam = params.get("level") ?? "1";

  // 1️⃣ Build your price‐matrix: country → currency → cost
  //    For demo I’m using costParam as the base for each
  const priceMatrix: Record<string, Record<string, number>> = {
    // India:   { INR: costParam, USD: +(costParam / 75).toFixed(2) },
    UAE: { AED: costParam, USD: +(costParam / 82).toFixed(2) },
    // Oman:    { OMR: +(costParam / 200).toFixed(2) },
    Oman: { OMR: costParam },
    Indonesia: { IDR: costParam },
  }

  // 2️⃣ State for selections
  const [country, setCountry] = useState<keyof typeof priceMatrix>("Oman");
  const [currency, setCurrency] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // 3️⃣ Derive valid currencies & ensure currency stays in‐sync
  const validCurrencies = Object.keys(priceMatrix[country] || {});
  useEffect(() => {
    // if current currency is no longer valid, pick the first valid one
    if (!validCurrencies.includes(currency)) {
      setCurrency(validCurrencies[0] || "");
    }
  }, [country]);

  // 4️⃣ Look up the actual amount
  const amount = priceMatrix[country]?.[currency] ?? 0;

  // 5️⃣ Disable submit unless currency is valid
  const isValid = Boolean(validCurrencies.includes(currency) && amount > 0);

  const handleSubmit = async () => {
    if (!user) return alert("You must be signed in.");
    if (!isValid) return alert("Please pick a matching country & currency.");
    if (!file) return alert("Please upload a payment proof.");
    if (!file.type.startsWith("image/")) {
      return alert("Only image files are allowed.");
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "taskopro_upload");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/db7hngfzu/image/upload",
        { method: "POST", body: formData }
      );
      const { secure_url } = await res.json();
      if (!secure_url) throw new Error("Upload failed");

      await createVipPayment({
        userId: user.uid,
        email: user.email!,
        country,
        currency,
        amount,
        method: paymentMethod,
        proofUrl: secure_url,
      });

      alert("✅ Payment submitted successfully!");
      setFile(null);
    } catch (err) {
      console.error(err);
      alert("Error uploading proof. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {amount === 0
              ? `Upgrade to VIP ${levelParam} (Free)`
              : `Upgrade to VIP ${levelParam}`}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-center text-sm text-muted-foreground">
            {amount === 0
              ? "Confirm your free upgrade below."
              : "Please make payment to upgrade your VIP level."}
          </p>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">Amount to Pay</p>
            <p className="text-3xl font-bold text-green-600">
              {amount === 0 ? "FREE" : `${amount} ${currency}`}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Country</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.keys(priceMatrix).map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {validCurrencies.map((cur) => (
                    <SelectItem key={cur} value={cur}>{cur}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Choose Payment Method</Label>
            <RadioGroup
              defaultValue="bank"
              onValueChange={setPaymentMethod}
              className="flex space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bank" id="bank" />
                <Label htmlFor="bank">Bank Transfer</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="crypto" id="crypto" />
                <Label htmlFor="crypto">Crypto (USDT)</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            {paymentMethod === "bank" && (
              <Image
                src={QrCode}
                alt="Bank QR Code"
                placeholder="blur"
                // you can override size if you like:
                width={200}
                height={200}
              />
            )}
          </div>

          {/* …bank/crypto details… */}

          <div className="space-y-2">
            <Label>Upload Payment Proof</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button
            className="w-full py-3"
            size="lg"
            disabled={!isValid || uploading}
            onClick={handleSubmit}
          >
            {uploading
              ? "Submitting..."
              : amount === 0
                ? "Confirm Free Upgrade"
                : "Submit Payment Proof"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
