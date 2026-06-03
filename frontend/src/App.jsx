import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/signIn";
import SignUp from "./pages/SignUp";
import { serverUrl } from "./config";
import CustomeAlert from "./components/CustomeAlert";
import Shorts from "./pages/Shorts/Shorts";
import GetCurrentUser from "./customHooks/GetCurrentUser";
import MobileProfile from "./components/MobileProfile";
import ForgetPassword from "./pages/ForgetPassword";
import CreateChannel from "./pages/Channel/CreateChannel";
import ViewChannel from "./pages/Channel/ViewChannel";

const App = () => {
  GetCurrentUser()
  return (
    <>
      <CustomeAlert />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="/shorts" element={<Shorts />} />
          <Route path="/mobilepro" element={<MobileProfile />} />
          <Route path="/viewchannel" element={<ViewChannel />} />
        </Route> 
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgetpass" element={<ForgetPassword />} />
        <Route path="/createchannel" element={<CreateChannel />} />
      </Routes>
    </>
  );
};

export default App;
