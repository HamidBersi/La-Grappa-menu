"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { BrandLogo } from "@/components/brand-logo";
import { PIN_LENGTH } from "@/lib/admin-auth";

type PinScreenProps = {
  onSuccess: () => void;
  loginUrl?: string;
  authStorageKey?: string;
  subtitle?: string;
};

export function PinScreen({
  onSuccess,
  loginUrl = "/api/owner/login",
  authStorageKey = "owner-auth",
  subtitle = "Accès Administration",
}: PinScreenProps) {
  const [digits, setDigits] = useState<string[]>(() => Array(PIN_LENGTH).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const focusInput = useCallback((index: number) => {
    inputRefs.current[index]?.focus();
  }, []);

  const clearAndFocusFirst = useCallback(() => {
    setDigits(Array(PIN_LENGTH).fill(""));
    requestAnimationFrame(() => focusInput(0));
  }, [focusInput]);

  const validate = useCallback(
    async (code: string) => {
      if (code.length !== PIN_LENGTH || !/^\d{6}$/.test(code) || isSubmitting) {
        return;
      }

      setIsSubmitting(true);
      setError("");
      try {
        const response = await fetch(loginUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ pin: code }),
        });

        if (!response.ok) {
          const data = (await response.json().catch(() => ({}))) as {
            error?: string;
          };
          setError(data.error ?? "Code incorrect");
          clearAndFocusFirst();
          return;
        }

        localStorage.setItem(authStorageKey, "true");
        onSuccess();
      } catch {
        setError("Erreur de connexion");
        clearAndFocusFirst();
      } finally {
        setIsSubmitting(false);
      }
    },
    [authStorageKey, clearAndFocusFirst, isSubmitting, loginUrl, onSuccess],
  );

  useEffect(() => {
    focusInput(0);
  }, [focusInput]);

  useEffect(() => {
    const code = digits.join("");
    if (code.length === PIN_LENGTH && digits.every((digit) => digit !== "")) {
      void validate(code);
    }
  }, [digits, validate]);

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = digit;
    setDigits(nextDigits);
    if (digit && index < PIN_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      if (digits[index]) {
        const nextDigits = [...digits];
        nextDigits[index] = "";
        setDigits(nextDigits);
        return;
      }
      if (index > 0) {
        const nextDigits = [...digits];
        nextDigits[index - 1] = "";
        setDigits(nextDigits);
        focusInput(index - 1);
      }
    }
    if (event.key === "Enter") {
      event.preventDefault();
      void validate(digits.join(""));
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, PIN_LENGTH);
    if (!pasted) return;
    const nextDigits = Array(PIN_LENGTH).fill("");
    pasted.split("").forEach((digit, i) => {
      nextDigits[i] = digit;
    });
    setDigits(nextDigits);
    focusInput(Math.min(pasted.length, PIN_LENGTH - 1));
  };

  return (
    <div className="relative flex min-h-full flex-1 items-center justify-center overflow-hidden bg-[#F7F2E7] p-6">
      <div className="relative w-full max-w-md">
        <div className="rounded-xl border border-[#D9CFB8] bg-white p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 w-fit">
              <BrandLogo size={72} className="size-[72px]" />
            </div>
            <h1 className="font-[family-name:var(--font-cormorant)] text-4xl font-semibold tracking-tight text-[#1B1E19]">
              La Grappa
            </h1>
            <p className="mt-2 text-sm text-[#6b6a5f]">{subtitle}</p>
          </div>

          <div className="space-y-6">
            <div className="flex justify-center gap-2.5 sm:gap-3">
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  maxLength={1}
                  value={digit}
                  onChange={(event) => handleChange(index, event.target.value)}
                  onKeyDown={(event) => handleKeyDown(index, event)}
                  onPaste={handlePaste}
                  aria-label={`Chiffre ${index + 1}`}
                  className={`h-12 w-10 rounded-md border bg-[#FBF8F1] text-center text-lg font-semibold tracking-widest outline-none sm:h-14 sm:w-12 ${
                    digit
                      ? "border-[#1E3A2F]/40 bg-white"
                      : "border-[#D9CFB8]"
                  } focus:border-[#1E3A2F] focus:ring-2 focus:ring-[#1E3A2F]/15`}
                />
              ))}
            </div>
            {error ? (
              <p className="text-center text-sm text-red-700">{error}</p>
            ) : null}
            <button
              type="button"
              className="h-11 w-full rounded-md bg-[#B68A3D] font-semibold text-[#1E3A2F] hover:bg-[#D8B871] disabled:opacity-60"
              onClick={() => void validate(digits.join(""))}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Vérification…" : "Entrer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
