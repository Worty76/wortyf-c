import { Routes, Route } from "react-router-dom";
import { Appbar } from "./layouts";
import { Start } from "./pages/Start";
import { Home } from "./pages";
import { SignIn } from "./pages/Auth";
import { SignUp } from "./pages/Auth";
import { Profile } from "./pages/Profile";
import { Guardian } from "./pages/Guardian";
import { Events } from "./pages/Events";
import { Chat } from "./pages/Chat";
import { CreatePost } from "./pages/Discussion";
import { Discussion } from "./pages/Discussion";
import "./App.css";
// import { Footer } from "./layouts/Footer";

function App() {
  return (
    <div className="App">
      {/* Header */}
      <Appbar />

      {/* Body */}
      <Routes>
        <Route exact path="/" element={<Start />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home/create" element={<CreatePost />} />
        <Route path="/guardians" element={<Guardian />} />
        <Route path="/events" element={<Events />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/discussions/:id" element={<Discussion />} />
      </Routes>

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
}

export default App;
