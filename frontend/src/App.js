import { Routes, Route } from "react-router-dom";
import { Appbar } from "./layouts";
import { Start } from "./pages/Start";
import { Home } from "./pages";
import { SignIn } from "./pages/Auth";
import { SignUp } from "./pages/Auth";
import { Profile } from "./pages/Profile";
import { Guardian } from "./pages/Guardian";
import { Chat } from "./pages/Chat";
import { CreatePost } from "./pages/Discussion";
import { Discussion } from "./pages/Discussion";
import "./App.css";
import { AdminPrivateRoute } from "./helpers/AdminPrivateRoute";
import { UserManagement } from "./pages/Admin";
import { ModeratorPrivateRoute } from "./helpers/ModeratorPrivateRoute";
import { InApprovalPosts } from "./pages/Moderator/pages";
import { NotFound } from "./pages/NotFound";
import { Tag } from "./pages/Tag";
import { Tags } from "./pages/Tag";
import { Reports } from "./pages/Moderator/pages";
import { Test } from "./pages/Test";

function App() {
  return (
    <div className="App">
      <Appbar />

      <Routes>
        {/* User route */}
        <Route exact path="/" element={<Start />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home/create" element={<CreatePost />} />
        <Route path="/guardians" element={<Guardian />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/:chatId" element={<Chat />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/post/:id" element={<Discussion />} />
        <Route path="/tag/:id" element={<Tag />} />
        <Route path="/tags/" element={<Tags />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/test" element={<Test />} />

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
        <Route
          path="/moderator/report"
          element={
            <ModeratorPrivateRoute>
              <Reports />
            </ModeratorPrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
