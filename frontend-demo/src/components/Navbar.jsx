import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-info">
      <div className="container">
        <Link className="navbar-brand" to="/">Frontend Demo</Link>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item active">
              <Link className="nav-link" to="/">
                Home <span className="visually-hidden">(current)</span>
              </Link>
            </li>

            {user ? (
              <><li className="nav-item">
                <Link className="nav-link" to="/exchange">Crypto Exchange</Link>
              </li></>
              
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/about">About</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/contact">Contact</Link>
                </li>
              </>
            )}
          </ul>

          {user ? (
            <div className="d-flex align-items-center">
              <img
                src={user.avatar || "https://via.placeholder.com/30"}
                alt={user.name}
                className="rounded-circle me-2"
                style={{ width: "30px", height: "30px", objectFit: "cover" }}
              />
              <span className="me-3 text-dark">Hello, {user.name}</span>
              <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-outline-primary btn-sm">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
