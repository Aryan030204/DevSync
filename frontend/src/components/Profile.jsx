import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((store) => store.user);
  const skills = Array.isArray(user?.skills) ? user.skills.join(", ") : user?.skills;

  if (!user || !user.firstName || !user.lastName) {
    return (
      <div className="flex justify-center m-10">
        <div className="flex flex-col items-center">
          <h1>Loading user data...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center m-10">
      <div className="flex justify-around p-4 w-full items-center">
        <div className="flex flex-col items-center m-10">
          <div className="card bg-base-300 w-[30rem] shadow-xl">
            <div className="flex flex-col card-body">
              <img
                src={user.photoUrl}
                className="rounded-full w-40 h-40 self-center p-4"
                alt="User Avatar"
              />
              <div className="flex justify-between">
              <h1 className="font-bold">Name:</h1>
              <h1>
                {user.firstName} {user.lastName}
              </h1>
              </div>
              <div className="flex justify-between">
              <h1 className="font-bold">Age:</h1>
              <h1>
                {user.age}
              </h1>
              </div>
              <div className="flex justify-between">
              <h1 className="font-bold">Gender:</h1>
              <h1>
                {user.gender}
              </h1>
              </div>
              <div className="flex justify-between my-2">
              <h1 className="font-bold">About:</h1>
              <textarea readOnly value={user.about} className="overflow-hidden bg-transparent text-end resize-none">{user.about}</textarea>
              </div>
              <div className="flex justify-between">
              <h1 className="font-bold">Skills:</h1>
              <h1>
                {skills}
              </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
