// @ts-nocheck

import { HomePage } from "./pages/Home.page";
import "./assets/styles/main.sass";
import { Header } from "./components/Header.component";
import { Register } from "./pages/Register.page";
import { Route, Routes } from "react-router-dom";
import { PDFToExport } from "./components/PDFToExport.component";
import { useContext } from "react";
import { DataContext } from "./provider/allData.provider";
import { UserPage } from "./pages/User.page";
import { SpousePage } from "./pages/Spouse.page";

const App = () => {
  const { message, setMessage } = useContext(DataContext);

  return (
    <div className="App">
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
