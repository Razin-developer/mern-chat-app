import { Link, useNavigate } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import { Loader2, MessageSquare } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

function ForgotVerifyPage() {
  const { isVerifyingForgot, verifyForgot, forgot, forgotEmail } = useAuthStore();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const navigate = useNavigate();

  const email = forgotEmail

  // Handle input change
  const handleChange = (index: number, value: string) => {
    const newCode = [...code];

    if (value.length === 6) {
      // If full code is pasted, update all inputs
      const pastedCode = value.slice(0, 6).split("");
      setCode(pastedCode);

      // Focus last field after pasting
      inputRefs.current[5]?.focus();
    } else {
      // Normal single input update
      newCode[index] = value.slice(-1); // Only take the last character
      setCode(newCode);

      // Move to the next field on input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Auto-submit when all fields are filled
  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit(new Event("submit"));
    }
  }, [code]);

  // Submit handler
  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const verificationCode = code.join("");
    try {      
      await verifyForgot(verificationCode);
      navigate("/reset");
      toast.success("Email verified successfully");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Did you forget your password?</h1>
              <p className="text-base-content/60">Enter your code to reset your password</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={(e) => handleSubmit(e.nativeEvent)} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium mb-1.5" style={{ marginBottom: "6px" }}>Verification Code</span>
              </label>
              <div className="flex gap-4 justify-space-between" style={{ justifyContent: "space-around" }}>
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      (inputRefs.current[index] = el)}
                    }
                    type="text"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    style={{ backgroundColor: "#e5e7eb" }}
                    className="w-12 pt-1.5 h-12 text-center text-2xl font-bold bg-gray-200 text-black border-2 border-gray-400 rounded-lg hover:border-green-500 focus:border-green-500 focus:outline-none"
                  />
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isVerifyingForgot}>
              {isVerifyingForgot ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              <button onClick={async () => {
                await forgot({email})
              }} className="link link-primary">
                Resend Code
              </button>
            </p>
            <p className="text-base-content/60">
              <Link to="/forgot" className="link link-primary">
                Go Back
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern
        title={"Welcome back!"}
        subtitle={"Sign in to continue your conversations and catch up with your messages."}
      />
    </div>
  );
}

export default ForgotVerifyPage;
