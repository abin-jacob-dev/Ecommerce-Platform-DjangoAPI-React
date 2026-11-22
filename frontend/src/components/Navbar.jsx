
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../features/auth/authSlice";

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const { isAuthenticated, user, accessToken, refreshToken } = useSelector((state) => state.auth);

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser({ accessToken, refreshToken })).unwrap();
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <nav>

            <Link to="/">
                <h2>OLX</h2>
            </Link>


            <Link to="/">Home</Link>

            {!isAuthenticated ? (
                <>

                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </>
            ) : (
                <>

                    <Link to="/my_products">My Products</Link>

                    <Link to="/products/create">Create Product</Link>

                    <span>{user?.email}</span>

                    <button onClick={handleLogout}>
                        Logout
                    </button>
                </>
            )}
        </nav>
    );
};

export default Navbar;
