import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import eye from "../assets/eye.png";

const Login = () => {
  let [emailId, setEmailId] = useState("");
  let [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        {
          emailId,
          password,
        },
        { withCredentials: true }
      );

      toast.success("Login success !");
      setTimeout(() => {
        dispatch(addUser(res.data.data));
        return navigate("/");
      }, 2000);
    } catch (err) {
      toast.error("Incorrect email or password !");
    }
  };
  return (
    <div className="flex flex-col items-center m-10">
      <ToastContainer />
      <div className="card bg-base-300 w-96 shadow-xl">
        <div className="flex flex-col card-body">
          <h2 className="card-title mb-12 text-4xl self-center">Login</h2>
          <h1>Email</h1>
          <input
            type="text"
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
            placeholder="enter your email"
            className="input input-primary w-full max-w-xs mb-4"
          />
          <h1>Password</h1>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="enter your password"
            className="input input-bordered input-primary w-full max-w-xs"
          />
          <img
            src={eye}
            className="w-5 absolute top-[17.5rem] left-[20rem] cursor-pointer"
            onMouseDown={() => setShowPassword(true)}
            onMouseUp={() => setShowPassword(false)}
            onMouseLeave={() => setShowPassword(false)}
          />
          <div className="card-actions flex justify-between items-center">
            <h1 className="text-[13px]">
              Don't have an account ?{" "}
              <Link to={"/signup"} className="text-blue-400 hover:underline">
                Signup
              </Link>
            </h1>
            <button className="btn btn-success m-2" onClick={handleLogin}>
              login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
