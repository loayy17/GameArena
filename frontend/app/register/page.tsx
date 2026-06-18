"use client";

import CustomTextField from "@/component/custom_text_field";
import TButton from "@/component/custom_button";
import CustomAnimation from "@/component/animation";
import CustomDivider from "@/component/custom_divider";
import SignInAnther from "@/component/sign_in_anther";
import { useState } from "react";
import { api } from "../network";
import { useRouter } from "next/navigation";
import OtpPage from "../../component/page";


export default function Register() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");

    const [showOtp, setShowOtp] = useState(false);
    const router = useRouter();
    const register = async () => {
        try {
            if (!email || !password || !firstName || !lastName || !username) {
                return;
            }
            setLoading(true);
            console.log(email, password, firstName, lastName, username);
            await api.post("api/auth/register", {
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName,
                username: username
            });
            setShowOtp(true);
        } catch (error) {
            console.error("Registration failed:", error);
        } finally {
            setLoading(false);
        }
    };

    if (showOtp) {
        return <OtpPage email={email} />;
    } else
        return (
            <div className="min-h-screen flex">
                <CustomAnimation title="Join Us Today" />

                <div className="flex-1 lg:w-1/2 flex items-center justify-center p-6">
                    <div className="w-full max-w-sm">

                        <h1 className="text-3xl font-bold text-text mb-1">
                            Create account
                        </h1>
                        <p className="text-text-secondary mb-8 text-sm">
                            Fill in your details to get started
                        </p>


                        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                            <CustomTextField label="First Name" type="text" placeholder="Enter your first name" onChange={(e) => setFirstName(e.target.value)} />
                            <CustomTextField label="Last Name" type="text" placeholder="Enter your last name" onChange={(e) => setLastName(e.target.value)} />
                            <CustomTextField label="Username" type="text" placeholder="Enter your username" onChange={(e) => setUsername(e.target.value)} />
                            <CustomTextField label="Email" type="email" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
                            <CustomTextField label="Password" type="password" placeholder="Create a password" onChange={(e) => setPassword(e.target.value)} />

                            <TButton title={loading ? "Creating account..." : "Create account"} disabled={loading} onClick={register} />
                        </form>

                        <p className="text-center text-sm text-text-secondary mt-8">
                            Already have an account?{" "}
                            <a href="/login" className="text-primary font-medium hover:underline">
                                Sign in
                            </a>
                        </p>
                        <CustomDivider />
                        {SignInAnther()}
                    </div>
                </div>
            </div>
        );
}

