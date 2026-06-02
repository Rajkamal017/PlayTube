import React, { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../config";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const GetCurrentUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/user/getuser", {
          withCredentials: true,
        });
        dispatch(setUserData(result.data));
        console.log(result.data);
      } catch (error) {
        console.log(error);
        dispatch(setUserData(null));
      }
    };
    fetchUser()
  }, []);
};

export default GetCurrentUser;
