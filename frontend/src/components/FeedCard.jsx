
/* eslint-disable react/prop-types */

import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeFeedItem } from "../utils/feedSlice";

const FeedCard = ({ data }) => {
  const dispatch = useDispatch();
  const currentCard = data?.[0];

  const handleInterested = async (id) => {
    try {
      await axios.post(
        `${BASE_URL}/request/send/interested/${id}`,
        {},
        { withCredentials: true }
      );

      dispatch(removeFeedItem(id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleIgnore = async (id) => {
    try {
      await axios.post(
        `${BASE_URL}/request/send/ignored/${id}`,
        {},
        { withCredentials: true }
      );

      dispatch(removeFeedItem(id));
    } catch (err) {
      console.log(err);
    }
  };

  if (!currentCard) {
    return (
      <>
        <h1 className="text-center text-2xl">No more developers around <br />come again later :)</h1>
      </>
    )
  }

  return (
    <div className="w-[18rem]">
        <div key={currentCard._id}>
          <div className="card bg-base-300 w-72 p-2 h-[32rem]">
            <figure>
              <img src={currentCard.photoUrl} alt="avatar" className="w-full bg-contain" />
            </figure>
            <div className="card-body flex flex-col gap-4 items-center text-center">
              <h2 className="card-title">
                {currentCard.firstName} {currentCard.lastName}
              </h2>
              <p>
                {currentCard.gender}, {currentCard.age} years old
              </p>
              <p className="w-full">{currentCard.about}</p>
              <p>Skills: {currentCard.skills.join(", ")}</p>
              <div className="card-actions flex justify-evenly w-full">
                <button
                  className="btn bg-red-600 text-black hover:bg-red-700 hover:text-white"
                  onClick={() => handleIgnore(currentCard._id)}
                >
                  Ignore
                </button>
                <button
                  className="btn bg-green-600 text-black hover:bg-green-700 hover:text-white"
                  onClick={() => handleInterested(currentCard._id)}
                >
                  Interested
                </button>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default FeedCard;
