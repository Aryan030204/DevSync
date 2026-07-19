import Body from "./components/Body";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Store from "./utils/store";
import Feed from "./components/Feed";
import EditProfileForm from "./components/EditProfileForm";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import Signup from "./components/Signup";
import Chat from "./components/Chat";

function App() {
  return (
    <>
      <Provider store={Store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Body />}>
              <Route path="/" element={<Feed />} />
              <Route path="/login" element={<Login />} />
              <Route path="/user/profile" element={<Profile />} />
              <Route path="/user/profile/edit" element={<EditProfileForm />} />
              <Route path="/user/connections" element={<Connections />} />
              <Route path="/user/requests" element={<Requests />} />
              <Route path="/user/feed" element={<Feed />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/chat/:targetId" element={<Chat />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
