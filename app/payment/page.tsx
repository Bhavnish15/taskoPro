"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function paymentPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Payment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            {/* Amount Summary */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Amount to Pay</p>
              <p className="text-3xl font-bold">₹1,250.00</p>
            </div>

            {/* Cardholder Name */}
            <div className="space-y-1">
              <Label htmlFor="card-name">Cardholder Name</Label>
              <Input
                id="card-name"
                placeholder="John Doe"
                className="w-full"
              />
            </div>

            {/* Card Number */}
            <div className="space-y-1">
              <Label htmlFor="card-number">Card Number</Label>
              <Input
                id="card-number"
                placeholder="1234 5678 9012 3456"
                className="w-full"
              />
            </div>

            {/* Expiry & CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="expiry-date">Expiry Date</Label>
                <Input
                  id="expiry-date"
                  placeholder="MM/YY"
                  className="w-full"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" placeholder="123" type="password" className="w-full" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button className="w-full py-3" size="lg">
            Pay Now
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
