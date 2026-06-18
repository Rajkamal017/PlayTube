import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { serverUrl } from "../config";
import { setChannelData } from "../redux/userSlice";
import { useEffect } from "react";

const GetChannelData = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/user/getchannel", {
          withCredentials: true,
        });
        dispatch(setChannelData(result.data));
        // console.log(result.data);
      } catch (error) {
        console.log(error);
        dispatch(setChannelData(null));
      }
    };
    fetchChannel();
  }, [dispatch]);
};

export default GetChannelData;
