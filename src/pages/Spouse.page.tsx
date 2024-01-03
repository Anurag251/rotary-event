// @ts-nocheck

import { useContext, useEffect, useState } from "react";
import { DataContext } from "../provider/allData.provider";

export const SpousePage = () => {
  const [loading, setLoading] = useState(false);
  const [mealTime, setMealTime] = useState("");
  const [dataStatus, setDataStatus] = useState(false);
  const [currentSpouse, setCurrentSpouse] = useState(null);

  const { mealData, setLoginPopup, setMessage, rerender, setRerender } =
    useContext(DataContext);

  useEffect(() => {
    fetch(
      `https://rotarydistrict3292.org.np/api/viewspouseeventregistrationdetails/${
        location.pathname.split("/")[2]
      }`
    ).then((res) => res.json().then((data) => setCurrentSpouse(data)));
  }, [rerender]);

  const handleSubmit = () => {
    if (mealTime !== "") {
      setLoading(true);

      const formData = new FormData();

      formData.append("spousemeal_status", mealTime);

      fetch(
        `https://rotarydistrict3292.org.np/api/eventregistrations/${
          location.pathname.split("/")[2]
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
    if (mealData !== null && currentSpouse !== null) {
      mealData.filter((data) => {
        setDataStatus(data.event_title === currentSpouse.event_name);
      });
    }
  }, [mealData, currentSpouse, rerender]);

  return (
    <div className="register-page">
      <div className="wrapper">
        {currentSpouse !== null ? (
          <div className="form-area">
            <h3 className="form-title">{currentSpouse.event_name}</h3>

            <ul className="user-details">
              <li>{currentSpouse.spouse_name}</li>

              <li>{currentSpouse.spouse_phone}</li>

              <li>{currentSpouse.role}</li>

              <li>{currentSpouse.district_role}</li>
            </ul>

            {localStorage.getItem("token") ? (
              <>
                <br />
                <h3 className="form-title">Available Drinks and Meal</h3>
                <div className="button-list allButtons">
                  {dataStatus ? (
                    mealData !== null ? (
                      mealData
                        .filter(
                          (data) =>
                            data.event_title === currentSpouse.event_name &&
                            !currentSpouse.spousemeal_status.includes(
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
              </>
            ) : null}

            {dataStatus ? (
              localStorage.getItem("token") ? (
                <button
                  className={`submit ${loading ? "loading" : ""}`}
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              ) : (
                <button onClick={() => setLoginPopup(true)} className="big-btn">
                  Submit
                </button>
              )
            ) : null}
          </div>
        ) : (
          "Loading..."
        )}
      </div>
    </div>
  );
};
