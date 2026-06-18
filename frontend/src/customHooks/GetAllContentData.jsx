import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { serverUrl } from "../config";
import { setAllVideosData, setAllShortsData } from "../redux/contentSlice";

const GetAllContentData = () => {
  const dispatch = useDispatch();

  const getAllVideos = async () => {
    try {
      const response = await axios.get(
        `${serverUrl}/api/content/get-all-videos`,
        {
          withCredentials: true,
        },
      );
      dispatch(setAllVideosData(response.data.videos));
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllShorts = async () => {
    try {
      const response = await axios.get(
        `${serverUrl}/api/content/get-all-shorts`,
        {
          withCredentials: true,
        },
      );
      dispatch(setAllShortsData(response.data.shorts));
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllVideos();
    getAllShorts();
  }, []);

  return <div></div>;
};

export default GetAllContentData;
