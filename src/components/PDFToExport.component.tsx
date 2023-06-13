// @ts-nocheck
import React, { useContext } from "react";
import logo from "../assets/images/rid_3292_logo.jpg";
import { DataContext } from "../provider/allData.provider";

export const PDFToExport = React.forwardRef((props, ref) => {
  const { formValues } = useContext(DataContext);

  return (
    <div
      ref={ref}
      className="pdf-to-export"
      style={{
        maxWidth: "340.16px",
        marginRight: "auto",
        marginTop: "2.5rem",
      }}
    >
      <div className="wrapper">
        <div
          className="logo"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={logo}
            alt="logo"
            style={{
              width: "200px",
              height: "50px",
              objectFit: "contain",
            }}
          />
        </div>

        <h4
          style={{
            textAlign: "center",
            fontSize: "13px",
            marginBottom: "1rem",
          }}
        >
          ROTARY INTERNATIONAL DISTRICT 3292
        </h4>

        <h2
          style={{
            fontSize: "16px",
            textAlign: "center",
            fontWeight: "500",
            lineHeight: "1.4rem",
            marginBottom: ".4rem",
          }}
        >
          ASSISTANT GOVERNOR TRAINING SEMINAR DISTRICT TEAM TRAINING SEMINAR
        </h2>

        <h3
          style={{
            fontSize: "12px",
            textAlign: "center",
            fontWeight: "400",
          }}
        >
          3-4 FEBRUARY, 2023 | POKHARA, NEPAL
        </h3>

        <div
          className="more-infos"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2.5fr",
            gridGap: "5px",
            margin: "1rem 0 1rem",
            paddingTop: "1rem",
            borderTop: "1px solid #000",
          }}
        >
          <div className="main-info">
            <div
              className="name-title"
              style={{
                fontSize: "18px",
                fontWeight: "500",
              }}
            >
              Rotary
            </div>

            <div
              className="area"
              style={{
                fontSize: "12px",
              }}
            >
              District 3292
            </div>
          </div>

          <div
            className="other-details"
            style={{
              fontSize: "12px",
              padding: ".3rem",
              border: "1px solid $dark",
              borderRadius: "10px",
              marginBottom: "0",
            }}
          >
            mor Training Seminar (AGTS) and District Team Training Seminar
            (DTTS) 2023
          </div>
        </div>

        <div
          className="other-infos"
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gridGap: "10px",
          }}
        >
          <div className="info-side">
            <div
              className="name"
              style={{
                fontSize: "18px",
              }}
            >
              Rtn. {formValues.callName}
            </div>

            <div
              className="role"
              style={{
                fontSize: "12px",
                marginBottom: "5px",
              }}
            >
              {formValues.positions}
            </div>

            <div
              className="club"
              style={{
                fontSize: "12px",
                marginBottom: "5px",
              }}
            >
              Rotary Club of {formValues.club}
            </div>

            <div
              className="phone"
              style={{
                fontSize: "12px",
                marginBottom: "5px",
              }}
            >
              {formValues.mobileNo}
            </div>

            <div
              className="email"
              style={{
                fontSize: "12px",
                marginBottom: "5px",
              }}
            >
              {formValues.email}
            </div>
          </div>

          <div className="qr-side">
            <img
              style={{
                height: "70px",
                width: "100%",
                objectFit: "contain",
              }}
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
});
