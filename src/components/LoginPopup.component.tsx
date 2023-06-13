// @ts-nocheck

import { useContext, useState } from "react";
import { DataContext } from "../provider/allData.provider";
import { CustomInput } from "./CustomInput.component";

export const LoginPopup = () => {
  const { setMessage, loginPopup, setLoginPopup } = useContext(DataContext);

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setLoginData({ ...loginData, [name]: value });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    if (loginData.username !== "" && loginData.password !== "") {
      const formData = new FormData();

      formData.append("username", loginData.username);
      formData.append("password", loginData.password);

      try {
        fetch(`https://rotarydistrict3292.org.np/api/login`, {
          method: "POST",

          body: formData,
        })
          .then((res) => {
            if (res.status === 200) {
              setLoading(false);

              setLoginPopup(false);

              setMessage({
                message: true,
                title: "Success",
                type: "success",
                desc: "Success",
              });

              setLoginData({
                ...loginData,
                username: "",
                password: "",
              });
            } else {
              setLoading(false);

              setMessage({
                message: true,
                title: "Error",
                type: "error",
                desc: "Some Things went wrong",
              });
            }

            return res.json();
          })
          .then((data) => {
            // console.log(data);
            localStorage.setItem("token", data.data.token);
            // localStorage.setItem("image", data.data.image);
            // localStorage.setItem("name", data.data.user.firstname);
          });
      } catch (err) {
        console.error(err);
        setLoading(false);

        setMessage({
          message: true,
          title: "Error",
          type: "error",
          desc: "Some Things went wrong",
        });
      }
    } else {
      setMessage({
        message: true,
        title: "Error",
        type: "error",
        desc: "All fields are required",
      });
    }
  };

  return (
    <div className={`login-popup ${loginPopup ? "active" : ""}`}>
      <div className="popup-bg" onClick={() => setLoginPopup(false)}></div>
      <div className="login-box">
        <div className="popup-close" onClick={() => setLoginPopup(false)}>
          <i className="fas fa-times"></i>
        </div>
        <h4 className="login-title">Login</h4>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <CustomInput
            label="Username"
            type="text"
            name="username"
            handleChange={handleChange}
            value={loginData.username}
            required
          />

          <CustomInput
            label="Password"
            type="password"
            name="password"
            handleChange={handleChange}
            value={loginData.password}
            required
          />

          <button className={`submit ${loading ? "loading" : ""}`}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};
