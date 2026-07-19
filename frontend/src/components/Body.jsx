import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);
  const [isLoading, setIsLoading] = useState(!userData);
  
  useEffect(() => {
    fetchUser();
  }, [userData]);
  
  const fetchUser = async () => {
    if (userData) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const user = await axios.get(BASE_URL + "/profile", {
        withCredentials: true,
      });

      dispatch(addUser(user.data.user));
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate("/login");
      }
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-end">
      <Navbar />
      </div>
      <div className="flex-grow">
        {isLoading ? <div className="p-6 text-center">Loading...</div> : <Outlet />}
      </div>
      <Footer />
    </div>
  );
};

export default Body;
