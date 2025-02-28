import { Loader2, Mail, MessageSquare } from "lucide-react"
import AuthImagePattern from "../components/AuthImagePattern"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

function ForgotPage() {

  const [formData, setFormData] = useState({
      email: "",
    });
    const navigate = useNavigate();
    const { forgot, isCheckingForgot } = useAuthStore();
  
    const handleSubmit = async (e: any) => {
      e.preventDefault();
      try {
        await forgot(formData);
        navigate("/forgot/verify");
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
              <div
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
              transition-colors"
              >
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Did you forgot your password</h1>
              <p className="text-base-content/60">enter your email to get back your account</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isCheckingForgot}>
              {isCheckingForgot ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Send Code"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              <Link to="/" className="link link-primary">
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
  )
}

export default ForgotPage
