import axios from "axios";
import { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);
  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests", {
        withCredentials: true,
      });
      dispatch(addRequests(res.data.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (id) => {
    try {
      await axios.post(
        BASE_URL + `/request/review/accepted/${id}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.post(
        BASE_URL + `/request/review/rejected/${id}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(id));
    } catch (err) {
      console.log(err);
    }
  };

  if (requests.length === 0) {
    return <h1 className="text-center m-5 text-2xl">No requests yet...</h1>;
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold m-5 self-center">Requests</h1>
      <div className="flex justify-start flex-wrap">
        {requests.map((r) => (
          <div className="flex flex-wrap m-5" key={r._id}>
            <div className="card bg-base-300 w-72 max-h-96 shadow-xl">
              <img
                src={r.fromUserId.photoUrl}
                alt="avatar"
                className="h-[5.5rem] w-full rounded-t-lg"
              />
              <div className="card-body flex flex-col items-center text-center">
                <h2 className="card-title text-orange-400">
                  {r.fromUserId.firstName} {r.fromUserId.lastName}
                </h2>
                <p>
                  {r.fromUserId.gender}, {r.fromUserId.age} years old
                </p>
                <textarea className="w-fit bg-transparent overflow-hidden resize-none text-center">
                  {r.fromUserId.about}
                </textarea>
                <p>Skills: {r.fromUserId.skills.join(", ")}</p>
              </div>
              <div className="card-actions flex justify-around w-full mb-2">
                <button
                  className="btn bg-red-600 text-black hover:bg-red-700 hover:text-white"
                  onClick={() => handleReject(r._id)}
                >
                  Reject
                </button>
                <button
                  className="btn bg-green-600 text-black hover:bg-green-700 hover:text-white"
                  onClick={() => handleAccept(r._id)}
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Requests;
