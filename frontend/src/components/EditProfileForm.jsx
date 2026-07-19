import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DEFAULT_PHOTO_URL =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

const EditProfileForm = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [age, setAge] = useState(user?.age || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [about, setAbout] = useState(user?.about || "");
  const [skills, setSkills] = useState(
    Array.isArray(user?.skills) ? user.skills.join(", ") : user?.skills || ""
  );
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || "");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setAge(user.age || "");
      setGender(user.gender || "");
      setAbout(user.about || "");
      setSkills(Array.isArray(user.skills) ? user.skills.join(", ") : user.skills || "");
      setPhotoUrl(user.photoUrl || "");
    }
  }, [user]);

  const handleUpdate = async () => {

    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        { firstName, lastName, age, gender, about, skills, photoUrl },
        {
          withCredentials: true,
        }
      );

      setTimeout(() => {
        dispatch(addUser(res.data.user));
        toast.success("Profile updated successfully!");
        navigate("/");
      }, 2000);
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-100 p-10">
      <div className=" max-w-3xl">
        <div className="card bg-base-300 shadow-xl p-6 md:p-10">
          <ToastContainer />
          <h2 className="card-title text-4xl mb-8 text-center">Edit Profile</h2>

          <div className="flex flex-col items-center mb-8">
            <img
              src={photoUrl || DEFAULT_PHOTO_URL}
              className="rounded-full w-32 h-32 object-cover mb-4"
              alt="Display"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="input input-primary w-full md:w-1/2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="input input-primary w-full"
              />
            </div>

            <div>
              <label className="label">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="input input-primary w-full"
              />
            </div>

            <div>
              <label className="label">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="input input-primary w-full"
              />
            </div>

            <div>
              <label className="label">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="select select-primary w-full"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="others">Other</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="label">About</label>
            <textarea
              className="textarea textarea-primary w-full h-32"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />
          </div>

          <div className="mt-6">
            <label className="label">Skills</label>
            <input
              type="text"
              placeholder="e.g., JavaScript, React, Node.js"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="input input-primary w-full"
            />
          </div>

          <div className="flex justify-end mt-8">
            <button className="btn btn-success" onClick={handleUpdate}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileForm;
