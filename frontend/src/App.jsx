import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/signIn";
import SignUp from "./pages/SignUp";
// import serverUrl  from "./config";
import CustomeAlert, { showCustomAlert } from "./components/CustomeAlert";
import Shorts from "./pages/Shorts/Shorts";
import GetCurrentUser from "./customHooks/GetCurrentUser";
import MobileProfile from "./components/MobileProfile";
import ForgetPassword from "./pages/ForgetPassword";
import CreateChannel from "./pages/Channel/CreateChannel";
import ViewChannel from "./pages/Channel/ViewChannel";
import GetChannelData from "./customHooks/GetChannelData";
import UpdateChannel from "./pages/Channel/UpdateChannel";
import { useSelector } from "react-redux";
import CreatePage from "./pages/CreatePage";
import CreateVideo from "./pages/Videos/CreateVideo";
import CreatePlaylist from "./pages/Playlist/CreatePlaylist";
import CreatePost from "./pages/Post/CreatePost";
import CreateShorts from "./pages/Shorts/CreateShorts";
import GetAllContentData from "./customHooks/GetAllContentData";

const ProtectRoute = ({ userData, children }) => {
  if (!userData) {
    showCustomAlert("Please sign up first to use this feature!");
    return <Navigate to={"/"} replace />;
  }
  return children;
};

const App = () => {
  GetCurrentUser();
  GetChannelData();
  GetAllContentData();

  const { userData } = useSelector((state) => state.user);
  return (
    <>
      <CustomeAlert />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route
            path="/shorts"
            element={
              <ProtectRoute userData={userData}>
                <Shorts />
              </ProtectRoute>
            }
          />
          <Route
            path="/mobilepro"
            element={
              <ProtectRoute userData={userData}>
                <MobileProfile />
              </ProtectRoute>
            }
          />
          <Route
            path="/viewchannel"
            element={
              <ProtectRoute userData={userData}>
                <ViewChannel />
              </ProtectRoute>
            }
          />
          <Route
            path="/updatechannel"
            element={
              <ProtectRoute userData={userData}>
                <UpdateChannel />
              </ProtectRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectRoute userData={userData}>
                <CreatePage />
              </ProtectRoute>
            }
          />
          <Route
            path="/createvideo"
            element={
              <ProtectRoute userData={userData}>
                <CreateVideo />
              </ProtectRoute>
            }
          />

          <Route
            path="/createshort"
            element={
              <ProtectRoute userData={userData}>
                <CreateShorts />
              </ProtectRoute>
            }
          />
          <Route
            path="/createplaylist"
            element={
              <ProtectRoute userData={userData}>
                <CreatePlaylist />
              </ProtectRoute>
            }
          />
          <Route
            path="/createpost"
            element={
              <ProtectRoute userData={userData}>
                <CreatePost />
              </ProtectRoute>
            }
          />
        </Route>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgetpass" element={<ForgetPassword />} />
        <Route
          path="/createchannel"
          element={
            <ProtectRoute userData={userData}>
              <CreateChannel />
            </ProtectRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
