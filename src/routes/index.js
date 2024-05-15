import React, { useEffect, useState } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Login from '../pages/Login/Login';
import Employee from '../pages/Employee/Employee';
import AppHeader from '../compnents/AppHeader';
import { jwtDecode } from "jwt-decode";
import AccessRestrictedPage from '../pages/AccessRestrictedPage';
import EmployeeProfileEdit from '../pages/Profile/EmployeeProfileEdit';

const Rotuers = () => {
    const [decodedValue, setDecodedValue] = useState('')
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (token !== null && token !== '' && token !== undefined) {
            const decoded = jwtDecode(token);
            setDecodedValue(decoded)
        }
        if (window.location.pathname !== "/") {
            if (token === null) {
                window.location.replace('/')
            }
        }
    }, [token])

    console.log(decodedValue);


    const TopHeader = () => {
        // if (isEmpty(localStorage.getItem(APP_VARIABLES.ACCESS_TOKEN))) {
        //     window.location.replace("/");
        //     return <>Login</>;
        // } else {
        //     const expiryDate = localStorage.getItem(APP_VARIABLES.SESSION_EXPIRY);
        //     if (expiryDate) {
        //         checkSessionExpiry();
        //     } else {
        //         window.location.replace("/");
        //     }
        return (
            <React.Fragment>
                <AppHeader />
                <div className="flex-grow-1 overflow-auto pb-3">
                    <Outlet />
                </div>
            </React.Fragment>
        );
    }

    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route element={<TopHeader />}>
                <Route path="/profile" element={<EmployeeProfileEdit />} />
                {decodedValue?.result?.role !== 'employee' ? (
                    <Route path="/employees" element={<Employee />} />
                ) : (
                    <Route path="/restricted" element={<AccessRestrictedPage />} />
                )}
            </Route>
            <Route path="/restricted" element={<AccessRestrictedPage />} />
            <Route path="*" element={<Navigate to="/restricted" />} />
        </Routes>
    )
}

export default Rotuers;