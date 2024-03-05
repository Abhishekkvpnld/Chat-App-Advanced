import React from 'react';
import {Navigate, Outlet} from "react-router-dom"

const ProtectRoute = ({chidren,user,redirect="/login"}) => {

 if(!user) return <Navigate to={redirect}/>

 return chidren ? chidren : <Outlet/>
}

export default ProtectRoute