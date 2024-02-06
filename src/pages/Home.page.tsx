// @ts-nocheck
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../provider/allData.provider";
import ReactHtmlParser from "react-html-parser";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

import { Autoplay } from "swiper";

import bannerImage from "../assets/images/processed-5e0b33bb-1dac-4fcd-9cd7-8c47534c8bd1_bHqodyS9.jpeg";

export const HomePage = () => {
  const { eventDatas } = useContext(DataContext);

  const navigate = useNavigate();

  return (
    <div className="homepage">
      <div
        className="banner"
        style={{ backgroundImage: `url(${bannerImage})` }}
      >
        {eventDatas !== null ? (
          <div className="wrapper">
            <div className="events-list">
              {eventDatas.map((eventData, idx) => {
                let newString = eventData.description;

                return (
                  <div key={idx}>
                    <div className="content">
                      <h2>{eventData.title}</h2>
                      <h6>
                        {eventData.start_date !== eventData.end_date
                          ? `${eventData.start_date} To ${eventData.end_date}`
                          : `${eventData.start_date}`}
                      </h6>

                      <p>{ReactHtmlParser(newString)}</p>

                      <div className="button-group">
                        <button
                          onClick={() =>
                            navigate(`/register/${eventData.id}`, {
                              state: {
                                id: eventData.id,
                                title: eventData.title,
                                description: newString,
                                registrationFee: eventData.price,
                                location: eventData.location,
                                startDate: eventData.start_date,
                                endDate: eventData.end_date,
                                bankDetails: eventData.bank_details,
                                QRImage: eventData.qrimage,
                                tshirtSize: eventData.tshirt,
                              },
                            })
                          }
                        >
                          Click Here To Register
                        </button>

                        {/* <button>Click Here To Book Your Hotel</button> */}
                      </div>

                      <div className="location">
                        <div className="name">
                          <i className="fas fa-map-marker-alt"></i>
                          Location
                        </div>

                        <div className="city">{eventData.location}</div>
                      </div>

                      {/* <ul className="terms">
                <li>
                  <a href="#">Terms Of Service</a>
                </li>

                <li>
                  <a href="#">Privacy Policy</a>
                </li>

                <li>
                  <a href="#">Refund Policy & Cancellation Policy</a>
                </li>
              </ul> */}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="contact-details">
              <div className="name">Contact Details</div>
              <div className="person-name"> Mahesh Bir Bajracharya</div>
              <div className="person-name">
                Phone No: <a href="tel:015355344">+015355344</a>
              </div>
              <div className="person-email">
                Email: <a href="mailto:rotary@ntc.net.np">rotary@ntc.net.np</a>
              </div>
            </div>
          </div>
        ) : (
          "Loading..."
        )}
      </div>
    </div>
  );
};
