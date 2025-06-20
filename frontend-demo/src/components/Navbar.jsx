import { Link,useNavigate } from "react-router-dom";
import React from "react";

const Navbar = () => {

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));


    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login")
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Frontend Demo</Link>
                { user ? (
                <>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/exchange">Crypto Exchange</Link>
                        </li>
                        <span>hello {user.name}</span>
                        <button
                        onClick={handleLogout}
                        className="btn btn-outline-danger ms-auto"
                        type="button"
                        >
                        Logout
                        </button>
                    </ul>
                </div>
                </>) : ( 
                    <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/about">About</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/contact">Contact</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/login">Login</Link>
                        </li>
                    </ul>
                </div>
                )}

                
            </div>
        </nav>
    )
}

export default Navbar;