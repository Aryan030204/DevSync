import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect } from "react";
import FeedCard from "./FeedCard";

const Feed = () => {
  const dispatch = useDispatch();
  const feedData = useSelector((store) => store.feed);
  
  
  const getfeed = async () => {
    if (feedData) return;
    try {
      const res = await axios.get(BASE_URL + "/user/feed", {
        withCredentials: true,
      });

      dispatch(addFeed(res.data.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getfeed();
  }, []);

  if (!feedData) {
    return <div className="mt-10 text-center">Loading feed...</div>;
  }

  return (
    <div className="flex justify-center items-center mt-10 shadow-md">
      <FeedCard data={feedData} />
    </div>
  );
};

export default Feed;
