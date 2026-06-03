import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiLogOut } from "react-icons/fi";
import { MdOutlineSwitchAccount } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { TiUserAddOutline } from "react-icons/ti";
import { SiYoutubestudio } from "react-icons/si";
import { FaHistory, FaList, FaThumbsUp } from "react-icons/fa";
import { GoVideo } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { setUserData } from "../redux/userSlice";
import { showCustomAlert } from "./CustomeAlert";
import axios from "axios";
import { serverUrl } from "../config";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/firebase";

const MobileProfile = () => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignout = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/auth/signout", {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      console.log(result.data);
      showCustomAlert("Signout Successfully");
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
    } catch (error) {
      console.log(error);
      showCustomAlert("Google Auth error");
    }
  };

  return (
    <div className="md:hidden bg-[#0f0f0f] text-white h-full w-full top-[3%] flex flex-col pt-full pt-3">
      {/* Top Profile Section */}

      {userData && (
        <div className="p-7 flex items-center gap-4 border-b border-gray-800">
          <img
            src={userData?.photoUrl}
            alt=""
            className="w-16 h-16 rounded-full objectfit-cover"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-lg">{userData?.userName}</span>
            <span className="text-gray-400 text-sm">{userData?.email}</span>
            <p
              className="text-sm text-blue-400 cursor-pointer hover:underline"
              onClick={() => {
                userData?.channel
                  ? navigate("/viewchannel")
                  : navigate("/createchannel ");
              }}
            >
              {userData?.channel ? "view channel" : "create channel"}
            </p>
          </div>
        </div>
      )}

      {/* Auth button */}
      <div className="flex gap-2 p-4 border-b border-gray-800 overflow-auto">
        <button
          className="bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center"
          onClick={handleGoogleAuth}
        >
          <FcGoogle className="text-xl" />
          Sign in with google account
        </button>
        <button
          className="bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center"
          onClick={() => navigate("/signup")}
        >
          <TiUserAddOutline className="text-xl" />
          Create new account
        </button>
        <button
          className="bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center"
          onClick={() => navigate("/signin")}
        >
          <MdOutlineSwitchAccount className="text-xl" />
          Sign in with other account
        </button>
        <button
          className="bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center"
          onClick={handleSignout}
        >
          <FiLogOut className="text-xl" />
          Sign out
        </button>
      </div>

      <div className="flex flex-col mt-5">
        <ProfileMenuItem icon={<FaHistory />} text={"History"} />
        <ProfileMenuItem icon={<FaList />} text={"Playlists"} />
        <ProfileMenuItem icon={<GoVideo />} text={"Save Videos"} />
        <ProfileMenuItem icon={<FaThumbsUp />} text={"Liked Videos"} />
        <ProfileMenuItem icon={<SiYoutubestudio />} text={"PT Studio"} />
      </div>
    </div>
  );
};

function ProfileMenuItem({ icon, text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-2xl flex items-center gap-3 p-4 active:bg-[#272727] text-left"
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm">{text}</span>
    </button>
  );
}

export default MobileProfile;
