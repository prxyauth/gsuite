"use client";

import React from "react";
import { useRegistration } from "./RegistrationContext";
import { Button } from "../ui/Button";

export default function Step2BusinessAddress() {
  const { data, updateData, setStep } = useRegistration();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.businessAddress.trim()) {
      setStep(3);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[450px] mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-[24px] font-normal text-[#1f1f1f] mb-2">
          What's your business address?
        </h1>
        <p className="text-[16px] text-[#1f1f1f]">
          Enter your business address to get verified.
        </p>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <input
            type="text"
            id="businessAddress"
            value={data.businessAddress}
            onChange={(e) => updateData({ businessAddress: e.target.value })}
            className="block px-3.5 pb-2.5 pt-4 w-full text-[16px] text-[#1f1f1f] bg-transparent rounded-[4px] border border-[#747775] focus:border-[#0b57d0] focus:ring-1 focus:ring-[#0b57d0] appearance-none focus:outline-none peer h-[56px]"
            placeholder=" "
            required
          />
          <label
            htmlFor="businessAddress"
            className="absolute text-[16px] text-[#444746] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-1 peer-focus:px-1 peer-focus:text-[#0b57d0] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2.5"
          >
            Street Address
          </label>
        </div>
      </div>

      <div className="flex justify-between items-center mt-12">
        <Button type="button" variant="text" onClick={() => setStep(1)}>
          Back
        </Button>
        <Button type="submit" disabled={!data.businessAddress.trim()}>
          Next
        </Button>
      </div>
    </form>
  );
}
