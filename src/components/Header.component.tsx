// @ts-nocheck

import { useContext } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/rid_3292_logo.jpg";
import { DataContext } from "../provider/allData.provider";

export const Header = () => {
  const { setLoginPopup } = useContext(DataContext);
  return (
    <header className="header">
      <div className="wrapper">
        <Link to="/">
          <div className="logo">
            <img src={logo} alt="logo" />
          </div>
        </Link>

        {localStorage.getItem("token") ? (
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.reload();
            }}
          >
            Sign Out
          </button>
        ) : (
          <button onClick={() => setLoginPopup(true)} className="big-btn">
            Login
          </button>
        )}
      </div>
    </header>
  );
};
