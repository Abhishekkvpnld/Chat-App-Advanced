import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectRoute from './components/auth/ProtectRoute';
import { LayoutLoader } from './components/layout/LayoutLoader';
import axios from "axios";
import { server } from './constants/config';
import { useDispatch, useSelector } from "react-redux";
import { userExists, userNotExists } from '../redux/reducers/auth';
import { Toaster } from "react-hot-toast";
import {SocketProvider} from "./socket";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Chat = lazy(() => import("./pages/Chat"));
const Groups = lazy(() => import("./pages/Groups"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin Dashboard
const AdminLogin = lazy(() => import("./pages/Admin/AdminLogin"));
const DashBoard = lazy(() => import("./pages/Admin/DashBoard"));
const MessageManagement = lazy(() => import("./pages/Admin/MessageManagement"));
const ChatManagement = lazy(() => import("./pages/Admin/ChatManagement"));
const UserManagement = lazy(() => import("./pages/Admin/UserManagement"));


function App() {

  const { user, loader } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {

    axios.get(`${server}/api/v1/user/profile`, { withCredentials: true })
    .then(({ data }) =>
      dispatch(userExists(data.user))
    ).catch((err) =>
      dispatch(userNotExists())
    );

  }, [dispatch]);



  return loader ? <LayoutLoader /> : (
    <BrowserRouter>
      <Suspense fallback={<LayoutLoader />}>
        <Routes>
          <Route element={<SocketProvider><ProtectRoute user={user} /></SocketProvider>}>
            <Route path='/' element={<Home />} />
            <Route path='/chat/:chatId' element={<Chat />} />
            <Route path='/groups' element={<Groups />} />
          </Route>

          <Route path='/admin' element={<AdminLogin />} />
          <Route path='/admin/dashboard' element={<DashBoard />} />
          <Route path='/admin/users' element={<UserManagement />} />
          <Route path='/admin/chats' element={<ChatManagement />} />
          <Route path='/admin/messages' element={<MessageManagement />} />

          <Route path='/login' element={<ProtectRoute user={!user} redirect="/" > <Login /> </ProtectRoute>} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster position='bottom-right' />
    </BrowserRouter>
  );
};

export default App;