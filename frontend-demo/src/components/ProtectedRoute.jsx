import React, { Children } from 'react';
import { Navigate } from 'react-router-dom';
import Toaster from 'react-hot-toast';

const protectedRoutes = ({Children}) =>{

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if(!user || !token ){
        Toaster.error('You need to login first');
        return <Navigate to="/login" replace />;
    }
    return Children
}

export default protectedRoutes;