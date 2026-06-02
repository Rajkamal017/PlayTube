import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import logo from "../assets/playtube.webp";
import { FaUserCircle } from "react-icons/fa";
import { showCustomAlert } from "../components/CustomeAlert";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../config";
import ClipLoader from "react-spinners/ClipLoader";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const SignIn = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNext = () => {
    if (step == 1) {
      if (!email) {
        showCustomAlert("Fill all the fields");
        return;
      }
    }
    if (step == 2) {
      if (!password) {
        showCustomAlert("Fill all the fields");
        return;
      }
    }
    setStep(step + 1);
  };

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/signin",
        { email, password },
        { withCredentials: true },
      );
      console.log(result.data);
      dispatch(setUserData(result.data));
      navigate("/");
      setLoading(false);
      showCustomAlert("User SignIn Successfully");
    } catch (error) {
      console.log(error);
      setLoading(false);
      const msg =
        error?.response?.data?.message || error.message || "Sign in failed";
      showCustomAlert(msg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#181818] text-white">
      <div className="bg-[#202124] rounded-2xl p-10 w-full max-w-md shadow-lg">
        <div className="flex items-center mb-6">
          <button
            className="text-gray-300 mr-3 hover:text-white"
            onClick={() => {
              if (step > 1) {
                setStep(step - 1);
              } else {
                navigate("/");
              }
            }}
          >
            <FaArrowLeft size={20} />
          </button>
          <span className="text-white text-2xl font-medium">PlayTube</span>
        </div>

        {/* step-1 */}

        {step == 1 && (
          <>
            <h1 className="text-3xl font-normal text-white mb-7 flex items-center gap-2">
              <img src={logo} alt="logo" className="w-8 h-8" />
              SignIn
            </h1>
            <p className="text-gray-400 text-sm mb-4">
              with your Account to continue to PlayTube
            </p>

            <input
              type="text"
              placeholder="Email"
              className="w-full bg-transparent border border-gray-500 rounded-md px-3 py-3 text-white focus:outline-none focus:border-purple-500 mb-4"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <div className="flex justify-between items-center mt-1">
              <button
                className="text-purple-400 text-sm hover:underline"
                onClick={() => navigate("/signup")}
              >
                Create Account
              </button>
              <button
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-full"
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* step-2 */}

        {step == 2 && (
          <>
            <h1 className="text-3xl font-normal text-white mb-9 flex items-center gap-2">
              <img src={logo} alt="logo" className="w-8 h-8" />
              Welcome
            </h1>
            <div className="flex items-center bg-[#3c4043] text-white px-3 py-2 rounded full w-fit mb-6">
              <FaUserCircle className="mr-0" size={20} />
              {email}
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full bg-transparent border border-gray-500 rounded-md px-3 py-3 text-white focus:outline-none focus:border-purple-500 mb-4"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />

            <div className="flex items-center gap-2 mt-3">
              <input
                type="checkbox"
                id="showpass"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label
                htmlFor="showpass"
                className="text-gray-300 cursor-pointer"
              >
                Show Password
              </label>
            </div>
            <div className="flex justify-between items-center mt-1">
              <button className="text-purple-400 text-sm hover:underline" onClick={()=>navigate("/forgetpass")}>
                Forget Password
              </button>
              <button
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-full"
                onClick={handleSignIn}
                disabled={loading}
              >
                {loading ? <ClipLoader color="black" size={20} /> : "signIn"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SignIn;
