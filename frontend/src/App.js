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
import { AdminPrivateRoute } from "./helpers/AdminPrivateRoute";
import { UserManagement } from "./pages/Admin";
import { ModeratorPrivateRoute } from "./helpers/ModeratorPrivateRoute";
import { InApprovalPosts } from "./pages/Moderator";
// import { Footer } from "./layouts/Footer";

function App() {
  return (
    <div className="App">
      {/* Header */}
      <Appbar />

      {/* Body */}
      <Routes>
        {/* User route */}
        <Route exact path="/" element={<Start />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home/create" element={<CreatePost />} />
        <Route path="/guardians" element={<Guardian />} />
        <Route path="/events" element={<Events />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/:chatId" element={<Chat />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/post/:id" element={<Discussion />} />

        {/* Admin route */}
        <Route
          path="/admin/manage"
          element={
            <AdminPrivateRoute>
              <UserManagement />
            </AdminPrivateRoute>
          }
        />

        {/* Moderator route */}
        <Route
          path="/moderator/approve"
          element={
            <ModeratorPrivateRoute>
              <InApprovalPosts />
            </ModeratorPrivateRoute>
          }
        />
      </Routes>

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
}

export default App;
