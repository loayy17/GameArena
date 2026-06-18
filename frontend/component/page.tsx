"use client";

import { api } from "@/app/network";
import CustomAnimation from "@/component/animation";
import TButton from "@/component/custom_button";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function OtpPage(props: { email?: string }) {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
    const router = useRouter();

    const handleChange = (i: number, val: string) => {
        if (!/^\d*$/.test(val)) return;
        const next = [...code];
        next[i] = val.slice(-1);
        setCode(next);
        setError("");

        if (val && i < 5) {
            inputsRef.current[i + 1]?.focus();
        }
    };

    const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !code[i] && i > 0) {
            inputsRef.current[i - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (!paste) return;
        const next = [...code];
        paste.split("").forEach((ch, i) => { if (i < 6) next[i] = ch; });
        setCode(next);
        inputsRef.current[Math.min(paste.length, 5)]?.focus();
    };

    const verifyOtp = async () => {
        const otp = code.join("");
        if (otp.length < 6) { setError("Enter the full 6-digit code"); return; }
        setLoading(true);
        try {
            await new Promise((r) => setTimeout(r, 800));
            api.post("api/email-verification/verify", { otp, email: props.email || "" });
            router.replace("/home");
        } catch {
            setError("Invalid code. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            <CustomAnimation title="Verify It's You" pathAnimation="/game.json" />

            <div className="flex-1 lg:w-1/2 flex items-center justify-center p-6">
                <div className="w-full max-w-sm">
                    <h1 className="text-3xl font-bold text-text mb-1">Verify OTP</h1>
                    <p className="text-text-secondary mb-8 text-sm">
                        Enter the 6-digit code sent to your email
                    </p>

                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        {/* OTP Inputs */}
                        <div className="flex items-center justify-center gap-3">
                            {code.map((digit, i) => (
                                <input
                                    key={i}
                                    ref={(el) => { inputsRef.current[i] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(i, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(i, e)}
                                    onPaste={i === 0 ? handlePaste : undefined}
                                    className={`w-14 h-14 text-center text-xl font-bold rounded-xl border bg-surface outline-none transition-all duration-200 text-text
                                        ${error
                                            ? "border-error ring-2 ring-error/20"
                                            : "border-border hover:border-border-light focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        }`}
                                />
                            ))}
                        </div>

                        {error && (
                            <p className="text-xs text-error text-center -mt-2">{error}</p>
                        )}

                        <TButton
                            title={loading ? "Verifying..." : "Verify Code"}
                            disabled={loading}
                            onClick={verifyOtp}
                        />
                    </form>

                    <p className="text-center text-sm text-text-secondary mt-8">
                        Didn&apos;t receive the code?{" "}
                        <button className="text-primary font-medium hover:underline bg-transparent border-none cursor-pointer">
                            Resend
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
