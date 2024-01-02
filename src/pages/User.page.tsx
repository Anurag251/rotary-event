// @ts-nocheck

import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../provider/allData.provider";

export const UserPage = () => {
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [mealTime, setMealTime] = useState("");
  const [dataStatus, setDataStatus] = useState(false);

  const [searchValues, setSearchValues] = useState("");
  const [emailId, setEmailId] = useState("");

  const [currentMember, setCurrentMember] = useState(null);

  const { mealData, setMessage, rerender, setRerender } =
    useContext(DataContext);

  useEffect(() => {
    fetch(
      `https://rotarydistrict3292.org.np/api/vieweventregistrationdetails/${
        location.pathname.split("/")[2]
      }`
    ).then((res) => res.json().then((data) => setCurrentMember(data)));
  }, [rerender]);

  const handleSubmit = () => {
    if (mealTime !== "") {
      setLoading(true);

      const formData = new FormData();

      formData.append("meal_status", mealTime);

      fetch(
        `https://rotarydistrict3292.org.np/api/eventregistrations/${
          emailId !== "" ? emailId : location.pathname.split("/")[2]
        }/update-meal-status`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      ).then((res) => {
        if (res.status === 200) {
          setRerender(!rerender);

          setLoading(false);

          setMealTime("");

          // setEmailId("");

          setMessage({
            message: true,
            title: "Success",
            type: "success",
            desc: "Meal Set",
          });
        }
      });
    } else {
      setMessage({
        message: true,
        title: "Error",
        type: "error",
        desc: "Choose Meal",
      });
    }
  };

  useEffect(() => {
    if (mealData !== null && currentMember !== null) {
      mealData.filter((data) =>
        setDataStatus(data.event_title === currentMember.event_name)
      );
    }
  }, [mealData, currentMember, rerender]);

  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();

    if (searchValues !== "") {
      setLoading2(true);

      fetch(
        `https://rotarydistrict3292.org.np/api/event-registration/email?email=${searchValues}`
      )
        .then((res) => res.json())
        .then((data) => {
          setLoading2(false);
          setEmailId(data.id);
          setCurrentMember(data);
          // navigate(`${data.id}`);
          window.location.href = `https://events.rotarydistrict3292.org.np/vieweventregistrationdetails/${data.id}`;
        });
    }
  };

  return (
    <div className="register-page">
      <div className="wrapper">
        {currentMember !== null ? (
          <React.Fragment>
            <div className="search-by-email">
              <form onSubmit={handleSearch} encType="multipart/form-data">
                <div className="search-group" style={{ marginBottom: "15px" }}>
                  <label htmlFor="">
                    Search by email if data didn't matched
                  </label>

                  <div className="box-group">
                    <input
                      type="email"
                      name="email"
                      placeholder="Search..."
                      onChange={(e) => setSearchValues(e.target.value)}
                      required
                    />
                    <button className={`submit ${loading2 ? "loading" : ""}`}>
                      Search
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="form-area">
              <h3 className="form-title">{currentMember.event_name}</h3>

              <ul className="user-details">
                <li>{currentMember.name}</li>

                <li>Rotary club of {currentMember.club_name}</li>

                <li>{currentMember.role}</li>

                <li>{currentMember.district_role}</li>
              </ul>

              {localStorage.getItem("token") ? (
                <React.Fragment>
                  <br />
                  <h3 className="form-title">Available Drinks and Meal</h3>
                  <div className="button-list">
                    {dataStatus ? (
                      mealData !== null ? (
                        mealData
                          .filter(
                            (data) =>
                              data.event_title === currentMember.event_name &&
                              !currentMember.meal_status.includes(
                                data.meal_types + data.event_date
                              )
                          )
                          .map((data, idx) => (
                            <button
                              key={idx}
                              className={`${
                                mealTime === data.meal_types + data.event_date
                                  ? "active"
                                  : ""
                              }`}
                              onClick={() =>
                                setMealTime(data.meal_types + data.event_date)
                              }
                            >
                              {data.meal_types + data.event_date}
                            </button>
                          ))
                      ) : null
                    ) : (
                      <h4>Sorry No meal for you. You already eat.</h4>
                    )}
                  </div>
                </React.Fragment>
              ) : null}

              {dataStatus ? (
                localStorage.getItem("token") ? (
                  <button
                    className={`submit ${loading ? "loading" : ""}`}
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                ) : null
              ) : null}
            </div>
          </React.Fragment>
        ) : (
          "Loading..."
        )}
      </div>
    </div>
  );
};
