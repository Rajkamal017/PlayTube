import React, { useState } from "react";
import logo from "../assets/PlayTube_Circle.png";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const [step, setStep] = useState(3);
  const [email, setEmail] = useState();
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState()
  const [confirmPassword, setConfirmPassword] = useState("")
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#202124] text-white">
      <header className="flex items-center gap-2 p-4 border-b border-gray-700">
        <img src={logo} alt="" className="w-8 h-8 " />
        <span className="text-white font-bold text-xl tracking-tight font-roboto">
          PlayTube
        </span>
      </header>

      <main className="flex flex-1 items-center justify-center px-4">
        {step === 1 && (
          <div className="bg-[#171717] shadow-lg rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-6">
              Forget your password
            </h2>

            <form action="" className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm mb-1 text-gray-300"
                >
                  Enter your email address
                </label>
                <input
                  type="text"
                  id="email"
                  className="mt-1 w-full px-4 py-3 border border-gray-600 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>

              <button className="w-full bg-purple-600 hover:bg-purple-700 transition py-2 px-4 rounded-md font-medium">
                Send OTP
              </button>
            </form>
            <div
              className="text-sm text-blue-400 text-center mt-4 cursor-pointer"
              onClick={() => navigate("/signin")}
            >
              Back to sign in
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-[#171717] shadow-lg rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-6">Enter OTP</h2>

            <form action="" className="space-y-4">
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm mb-1 text-gray-300"
                >
                  Enter the 4-digit code sent to your email
                </label>
                <input
                  type="text"
                  id="otp"
                  className="mt-1 w-full px-4 py-3 border border-gray-600 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                  onChange={(e) => setOtp(e.target.value)}
                  value={email}
                />
              </div>

              <button className="w-full bg-purple-600 hover:bg-purple-700 transition py-2 px-4 rounded-md font-medium">
                Verify OTP
              </button>
            </form>
            <div
              className="text-sm text-blue-400 text-center mt-4 cursor-pointer"
              onClick={() => navigate("/signin")}
            >
              Back to sign in
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-[#171717] shadow-lg rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-6">Reset your password</h2>
            <p className="text-sm text-gray-400 mb-6">Enter a new password below to regain access tp your account.</p>

            <form action="" className="space-y-4">
              <div>
                <label
                  htmlFor="newpass"
                  className="block text-sm mb-1 text-gray-300"
                >
                  New Password
                </label>
                <input
                  type="text"
                  id="newpass"
                  className="mt-1 w-full px-4 py-3 border border-gray-600 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newPassword}
                />

                <label
                  htmlFor="conpass"
                  className="block text-sm mb-1 text-gray-300 mt-5"
                >
                  Confirm Password
                </label>
                <input
                  type="text"
                  id="conpass"
                  className="mt-1 w-full px-4 py-3 border border-gray-600 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                />

              </div>

              <button className="w-full bg-purple-600 hover:bg-purple-700 transition py-2 px-4 rounded-md font-medium">
                Reset password
              </button>
            </form>
            <div
              className="text-sm text-blue-400 text-center mt-4 cursor-pointer"
              onClick={() => navigate("/signin")}
            >
              Back to sign in
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default ForgetPassword;
