import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiLogOut } from "react-icons/fi";
import { MdOutlineSwitchAccount } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { TiUserAddOutline } from "react-icons/ti";
import { SiYoutubestudio } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../config";
import { showCustomAlert } from "./CustomeAlert";
import { setUserData } from "../redux/userSlice";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/firebase";

const Profile = ({ onClose }) => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Ignore clicks on elements with the 'profile-btn' class to avoid double toggling
        const isProfileBtn = event.target.closest('.profile-btn') || event.target.tagName === 'svg' || event.target.tagName === 'IMG';
        if (!isProfileBtn) {
          onClose?.();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleSignout = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/auth/signout", {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      console.log(result.data);
      showCustomAlert("Signout Successfully");
      onClose?.();
    } catch (error) {
      console.log(error);
      showCustomAlert("Signout Error");
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      console.log(response);
      let user = response.user;
      let userName = user.displayName;
      let email = user.email;
      let photoUrl = user.photoURL;

      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("email", email);
      formData.append("photoUrl", photoUrl);

      const result = await axios.post(
        serverUrl + "/api/auth/googleauth",
        formData,
        { withCredentials: true },
      );
      dispatch(setUserData(result.data));
      console.log(result.data);
      showCustomAlert("Google Authentication Successfully");
      onClose?.();
    } catch (error) {
      console.log(error);
      showCustomAlert("Google Auth error");
    }
  };

  return (
    <div ref={dropdownRef}>
      <div className="absolute right-5 top-10 mt-2 w-72 bg-[#212121] text-white rounded-xl shadow-lg z-50 hidden md:block">
        {userData && (
          <div className="flex items-center gap-3 p-4 border-b border-gray-700">
            <img
              src={userData?.photoUrl}
              alt=""
              className="w-12 h-12 flex items-center justify-center rounded-full object-fit-cover border border-gray-700"
            />
            <div>
              <h3 className="font-semibold">{userData?.userName}</h3>
              <p className="text-sm text-gray-400">{userData?.email}</p>
              <p
                className="text-sm text-blue-400 cursor-pointer hover:underline"
                onClick={() => {
                  userData?.channel
                    ? navigate("/viewchannel")
                    : navigate("/createchannel ");
                  onClose?.();
                }}
              >
                {userData?.channel ? "view channel" : "create channel"}
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col py-2">
          {!userData && (
            <>
              <button
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 cursor-pointer"
                onClick={handleGoogleAuth}
              >
                <FcGoogle className="text-xl" />
                SignIn with the google account
              </button>
              <button
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 cursor-pointer"
                onClick={() => {
                  navigate("/signup");
                  onClose?.();
                }}
              >
                <TiUserAddOutline className="text-xl" />
                Create new account
              </button>
              <button
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 cursor-pointer"
                onClick={() => {
                  navigate("/signin");
                  onClose?.();
                }}
              >
                <MdOutlineSwitchAccount className="text-xl" />
                SignIn with other account
              </button>
            </>
          )}
          {userData?.channel && (
            <button 
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 cursor-pointer"
              onClick={() => onClose?.()}
            >
              <SiYoutubestudio className="w-5 h-5 text-purple-500" />
              PT Studio
            </button>
          )}
          {userData && (
            <button
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 cursor-pointer"
              onClick={handleSignout}
            >
              <FiLogOut className="text-xl" />
              Signout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
