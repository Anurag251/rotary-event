// @ts-nocheck

import { useContext } from "react";
import { Link } from "react-router-dom";
import { DataContext } from "../provider/allData.provider";

export const Header = () => {
  const { setLoginPopup, logo } = useContext(DataContext);

  return (
    <header className="header">
      <div className="wrapper">
        <Link to="/">
          <div className="logo">
            {logo !== null ? <img src={logo?.theme_logo} alt="logo" /> : null}
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
