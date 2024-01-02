// @ts-nocheck

import { HomePage } from "./pages/Home.page";
import "./assets/styles/main.sass";
import { Header } from "./components/Header.component";
import { Register } from "./pages/Register.page";
import { Route, Routes, useLocation } from "react-router-dom";
import { PDFToExport } from "./components/PDFToExport.component";
import { useContext, useEffect } from "react";
import { DataContext } from "./provider/allData.provider";
import { UserPage } from "./pages/User.page";
import { SpousePage } from "./pages/Spouse.page";
import { LoginPopup } from "./components/LoginPopup.component";
import { ReportPage } from "./pages/Report.page";

const App = () => {
  const { message, setMessage } = useContext(DataContext);

  const location = useLocation();

  useEffect(() => {
    if (location.search.split("=")[1] === "success") {
      setMessage({
        message: true,
        title: "Success",
        type: "success",
        desc: "Thank you for your registration, Please check your email for more details!",
      });
    } else if (location.search.split("=")[1] === "failed") {
      setMessage({
        message: true,
        title: "Error",
        type: "error",
        desc: "Your payemnt got cancel please Try Again!",
      });
    }
  }, []);

  return (
    <div className="App">
      {localStorage.getItem("token") ? null : <LoginPopup />}

      <div className={`popup-message ${message.message ? "active" : ""}`}>
        <div
          className={`message-bg`}
          onClick={() => {
            setMessage({
              message: false,
              title: "",
              type: "",
              desc: "",
            });
          }}
        ></div>
        <div className={`box ${message.type === "error" ? "error" : ""}`}>
          <div className="message-icon">
            {message.type === "success" ? (
              <i className="fas fa-check"></i>
            ) : (
              <i className="fas fa-times"></i>
            )}
          </div>
          <div className="message-title">{message.title}</div>
          <p>{message.desc}</p>
          <button
            className="message-button"
            onClick={() => {
              setMessage({
                message: false,
                title: "",
                type: "",
                desc: "",
              });
            }}
          >
            {message.type === "success" ? "Continue" : "Try Again"}
          </button>
        </div>
      </div>

      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register/:id" element={<Register />} />
        <Route path="/pdf" element={<PDFToExport />} />
        {/* <Route path="/report" element={<ReportPage />} /> */}
        <Route
          path="/vieweventregistrationdetails/:id"
          element={<UserPage />}
        />

        <Route
          path="/viewspouseeventregistrationdetails/:id"
          element={<SpousePage />}
        />
      </Routes>
    </div>
  );
};

export default App;
