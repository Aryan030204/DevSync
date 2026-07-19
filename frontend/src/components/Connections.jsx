import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { Link } from "react-router-dom";

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      setConnections(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (loading) {
    return <h1 className="text-center m-5 text-2xl">Loading...</h1>;
  }

  if (connections.length === 0) {
    return (
      <h1 className="m-2 text-center text-2xl">No connections found :(</h1>
    );
  }

  return (
    <>
      <div className="flex items-center justify-center m-5">
        <h1 className="text-3xl font-bold text-white">Connections</h1>
      </div>
      <div className="flex items-center m-5 p-5 gap-2 flex-wrap">
        {connections.map((c) => {
          // console.log(c);

          return (
            <div
              className="card flex bg-base-300 w-72 h-fit shadow-xl"
              key={c._id}
            >
              <img
                src={c.photoUrl}
                alt="avatar"
                className="max-h-[10rem] w-full rounded-t-lg"
              />
              <div className="card-body flex flex-col items-center text-center">
                <h2 className="card-title">
                  {c.firstName} {c.lastName}
                </h2>
                <p>
                  {c.gender}, {c.age} years old
                </p>
                <textarea className="overflow-hidden bg-transparent resize-none text-center">
                  {c.about}
                </textarea>
                <p>Skills: {c.skills.join(", ")}</p>
                <Link to={"/chat/"+c._id}><button className="bg-blue-800 font-mono font-bold p-2 text-lg text-white w-[5rem] mt-2  rounded-lg hover:bg-blue-900">Chat</button></Link>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Connections;
