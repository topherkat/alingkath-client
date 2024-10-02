import { Navigate } from 'react-router-dom';
import UserContext from "../context/UserContext";
import {useEffect, useContext} from "react";

export default function Logout() {

    const {setUser, unsetUser} = useContext(UserContext);

    unsetUser();
    // localStorage.clear(); // this is commented because unsetUser has the same job/purpose

    useEffect(()=>{
        setUser({
            id: null,
            email: null,
            firstName: null,
            lastName: null,
            mobileNo: null,
            isAdmin: null
        })
    })


    // Redirect back to login
    return (
        <Navigate to='/login' />
    )

}