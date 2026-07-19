import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DEFAULT_PHOTO_URL =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [about, setAbout] = useState("");
  const [skills, setSkills] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleCreate = async () => {
    try {
      await axios.post(
        BASE_URL + "/signup",
        {
          emailId,
          password,
          firstName,
          lastName,
          gender,
          age,
          skills,
          about,
          photoUrl,
        },
        { withCredentials: true }
      );

      toast.success("Account created successfully ! redirecting you to login page");

      setTimeout(() => {
        return navigate("/login");
      }, 2000);
    } catch (err) {
      toast.error("Something went wrong !");
    }
  };
  return (
    <div className="flex justify-around p-4 w-full items-center">
      <div className="flex flex-col items-center m-10">
        <div className="card bg-base-300 w-[30rem] shadow-xl">
          <div className="flex flex-col card-body">
            <h2 className="card-title mb-12 text-4xl self-center">
              Create an Account
            </h2>
            <img
              src={photoUrl || DEFAULT_PHOTO_URL}
              className=" rounded-full w-40 h-40 self-center p-4"
              alt="Display"
            />
            <h1>Email</h1>
            <input
              type="text"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              className="input input-primary w-full max-w-xs mb-4"
            />
            <h1>Password</h1>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-primary w-full max-w-xs mb-4"
            />
            <h1>Display Photo</h1>
            <input
              type="text"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="input input-primary w-full max-w-xs mb-4"
            />

            <h1>First Name</h1>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="input input-primary w-full max-w-xs mb-4"
            />
            <h1>Last Name</h1>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="input input-bordered input-primary w-full max-w-xs"
            />
            <h1>Age</h1>
            <input
              type="text"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="input input-primary w-full max-w-xs mb-4"
            />
            <h1>Gender</h1>
            <input
              type="text"
              value={gender}
              placeholder="(male, female, others)"
              onChange={(e) => setGender(e.target.value)}
              className="input input-primary w-full max-w-xs mb-4"
            />
            <h1>About</h1>
            <textarea
              className="w-full h-[10rem] bg-base-200 p-2"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            ></textarea>
            <h1>Skills</h1>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="input input-primary w-full max-w-xs mb-4"
            />
            <div className="card-actions flex flex-col justify-end items-end">
              <button className="btn btn-success m-2" onClick={handleCreate}>
                Create Account
              </button>
              <ToastContainer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
