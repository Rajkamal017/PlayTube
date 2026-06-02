import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import logo from "../assets/playtube.webp";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { serverUrl } from "../config.js";
import { showCustomAlert } from "../components/CustomeAlert.jsx";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice.js";

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [backendImage, setBackendImage] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleNext = () => {
    if (step == 1) {
      if (!userName || !email) {
        showCustomAlert("Fill all the fields");
        return;
      }
    }
    if (step == 2) {
      if (!Password || !confirmPassword) {
        showCustomAlert("Fill all the fields");
        return;
      }
      if (Password !== confirmPassword) {
        showCustomAlert("Password doesn't match");
        return;
      }
    }
    setStep(step + 1);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSignUp = async () => {
    if (!backendImage) {
      alert("Please choose a profile image");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("email", email);
    formData.append("password", Password);
    formData.append("photoUrl", backendImage);

    try {
      const result = await axios.post(
        serverUrl + "/api/auth/signup",
        formData,
        { withCredentials: true },
      );
      console.log(result.data);
      dispatch(setUserData(result.data))
      navigate("/");
      setLoading(false);
      showCustomAlert("Account Created");
    } catch (error) {
      console.log(error.response?.data);
      setLoading(false);
      showCustomAlert(
        error.response?.data?.message || "An error occurred during signup",
      );
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
          <span className="text-white text-2xl font-medium">
            Create Account
          </span>
        </div>

        {/* step-1 */}

        {step == 1 && (
          <>
            <h1 className="text-3xl font-normal text-white mb-9 flex items-center gap-2">
              <img src={logo} alt="logo" className="w-8 h-8" />
              Basic Info
            </h1>
            <input
              type="text"
              placeholder="UserName"
              className="w-full bg-transparent border border-gray-500 rounded-md px-3 py-3 text-white focus:outline-none focus:border-purple-500 mb-4"
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
            />
            <input
              type="text"
              placeholder="Email"
              className="w-full bg-transparent border border-gray-500 rounded-md px-3 py-3 text-white focus:outline-none focus:border-purple-500 mb-4"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <div className="flex justify-end mt-1">
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
              Security
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
              value={Password}
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full bg-transparent border border-gray-500 rounded-md px-3 py-3 text-white focus:outline-none focus:border-purple-500 mb-4"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
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
            <div className="flex justify-end mt-1">
              <button
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-full"
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* step-3 */}

        {step == 3 && (
          <>
            <h1 className="text-3xl font-normal text-white mb-9 flex items-center gap-2">
              <img src={logo} alt="logo" className="w-8 h-8" />
              Choose Avatar
            </h1>
            <div className="flex items-center gap-6 mb-6">
              <div className="w-28 h-28 rounded-full border-3 border-purple-500 overflow-hidden  shadow-lg">
                {frontendImage ? (
                  <img src={frontendImage} />
                ) : (
                  <FaUserCircle className="text-purple-500 w-full h-full p-2" />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="" className="text-purple-300 font-medium">
                  Choose Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm
                        text-purple-400file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer"
                  onChange={handleImage}
                />
              </div>
            </div>

            <div className="flex justify-end mt-1">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full"
                onClick={handleSignUp}
                disabled={loading}
              >
                {loading ? (
                  <ClipLoader color="black" size={20} />
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SignUp;
