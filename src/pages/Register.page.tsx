// @ts-nocheck
import React, { useRef, useContext, useEffect, useState } from "react";

import { CustomInput } from "../components/CustomInput.component";
import { PDFToExport } from "../components/PDFToExport.component";
import { DataContext } from "../provider/allData.provider";
import cashIcon from "../assets/images/cash-icon.png";
import ReactToPrint from "react-to-print";

import QRpayment from "../assets/images/processed-0ff204d3-914b-458a-98da-d64dda1e3579_nesQwO8B.jpeg";
import { Form, useLocation } from "react-router-dom";
import { render } from "react-dom";
import ReactHtmlParser from "react-html-parser";
import { KhaltiComponent } from "../components/Khalti.component";

export const Register = () => {
  const {
    formValues,
    setFormValuse,
    clubDatas,
    eventDatas,
    positionDatas,
    districtRoleDatas,
    rotarianForm,
    setRotarianForm,
    resetData,
    setMessage,
  } = useContext(DataContext);

  const [eventDataValue, setEventDataValue] = useState(null);
  const [whichFrom, setWhichFrom] = useState("");
  const [filteredData, setFilteredData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState();
  const [imageName, setImageName] = useState(null);
  const [isRotarian, setIsRotarian] = useState(false);
  const [border, setBorder] = useState();

  const [positionsId, setPositionsId] = useState("");
  const [districtRoleId, setDistrictRoleId] = useState("");

  const [testing, setTesting] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [token, setToken] = useState(null);

  const location = useLocation();
  const componentRef = useRef();

  useEffect(() => {
    if (eventDatas !== null) {
      eventDatas.forEach((data) => {
        if (data.id == location.pathname.split("/")[2]) {
          setSelectedEvent(data);

          setEventDataValue({
            id: data.id,
            title: data.title,
            description: data.description,
            registrationFee: data.price,
            location: data.location,
            startDate: data.start_date,
            endDate: data.end_date,
            bankDetails: data.bank_details,
            QRImage: data.qrimage,
            tshirtSize: data.tshirt,
          });
        }
      });
    }
  }, [location, eventDatas]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormValuse({ ...formValues, [name]: value });
  };

  const handleChangeRotarianForm = (event) => {
    const { name, value } = event.target;

    setRotarianForm({ ...rotarianForm, [name]: value });
  };

  useEffect(() => {
    if (
      formValues.paymentStatus === "Paid" ||
      rotarianForm.paymentStatus === "Paid"
    ) {
      const input = document.querySelectorAll(".inputButon");
      const inputToClick = document.querySelectorAll(".inputToClick");

      input.forEach((inp, idx) => {
        inp?.addEventListener("click", () => {
          inputToClick[idx].click();
        });
      });
    }

    if (image) {
      var preview = document.querySelector("#previewImage");
      var file = image.target.files[0];
      var reader = new FileReader();

      reader.onloadend = function () {
        preview.src = reader.result;
        preview.style.display = "block";
      };

      reader.onload = () => {
        setImageName(reader.result);
      };

      if (file) {
        reader.readAsDataURL(file);
      } else {
        preview.src = "";
        preview.style.display = "none";
      }
    }
  }, [formValues.paymentStatus, rotarianForm.paymentStatus, image]);

  useEffect(() => {
    if (formValues.user !== "") {
      let sentences = formValues.user.split(", ");
      setFormValuse({
        ...formValues,
        userId: sentences[0],
        callName: sentences[1].split(" ")[0],
        email: sentences[2],
        mobileNo: sentences[3],
        positions: sentences[4],
        districtRole: sentences[5],
      });
    }
  }, [formValues.user]);

  useEffect(() => {
    if (formValues.user !== "") {
      positionDatas
        .filter((data) =>
          data.name === formValues.positions ? data : setPositionsId("")
        )
        .forEach((data) => {
          setPositionsId(data.id);
        });

      districtRoleDatas
        .filter((data) =>
          data.name === formValues.districtRole ? data : setDistrictRoleId("")
        )
        .forEach((data) => {
          setDistrictRoleId(data.id);
        });
    }
  }, [formValues.user, testing, formValues.positions, formValues.districtRole]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const clubSelectInput = document.querySelector("#clubSelectInput");

    setLoading(true);

    const formData = new FormData();

    formData.append("event_id", eventDataValue.id);
    formData.append("club_id", formValues.club);
    formData.append("position_id", positionsId);
    formData.append("districtrole_id", districtRoleId);
    formData.append("user_id", formValues.user.split(", ")[0]);
    formData.append("first_name", formValues.user.split(", ")[1].split(" ")[0]);
    formData.append(
      "middle_name",
      formValues.user.split(", ")[1].split(" ")[1]
    );
    formData.append("last_name", formValues.user.split(", ")[1].split(" ")[2]);
    formData.append("name", formValues.callName);
    formData.append("salutation", "");
    formData.append("address", "");
    formData.append("spouse", formValues.spouse === true ? 1 : 0);
    formData.append("spouse_name", formValues.spouseName);
    formData.append("spouse_phone", formValues.spousePhone);
    formData.append("spouse_tshirt", formValues.spouseTshirt);
    formData.append(
      "registration_fee",
      `${formValues.registrationCategories.split(",")[1]} ${
        formValues.registrationCategories.split(",")[2]
      }`
    );
    formData.append(
      "price_index",
      formValues.registrationCategories.split(",")[0]
    );
    formData.append("image", image !== undefined ? image.target.files[0] : "");
    formData.append("email", formValues.email);
    formData.append("phone", formValues.mobileNo);
    formData.append("tshirt", formValues.tshirtSize);
    formData.append("payment_status", "Pending");
    formData.append("participation", "Confirmed");

    try {
      fetch("https://rotarydistrict3292.org.np/api/eventregistration", {
        method: "POST",
        // headers: {
        //   "Content-Type": "application/json",
        // },
        body: formData,
      })
        .then((res) => {
          if (res.status === 200) {
            setLoading(false);

            setWhichFrom("");
            clubSelectInput.value = "";

            setFormValuse({
              ...formValues,
              fName: "",
              lName: "",
              callName: "",
              club: "",
              positions: "",
              user: "",
              email: "",
              mobileNo: "",
              districtRole: "",
              tshirtSize: "",
              registrationCategories: "",
              badgeName: "",
              passwordForMobileAPP: "",
              confirmPassword: "",
              paymentOption: "",
              paymentStatus: "",

              spouse: false,
              spouseName: "",
              spousePhone: "",
              spouseTshirt: "",
            });
            setImage();

            return res.json();
          } else {
            setLoading(false);

            setMessage({
              message: true,
              title: "Error",
              type: "error",
              desc: "The email has already been taken.",
            });
          }
          return res.json();
        })
        .then((data) => {
          if (data.data) {
            window.location = data.data.payment_url;
          } else {
            setMessage({
              message: true,
              title: "Error",
              type: "error",
              desc: "Phone number should be either a valid mobile number (e.g. 98xxxxxxxx) or a valid landline number",
            });
          }
        })
        .catch((err) => {
          setLoading(false);

          setMessage({
            message: true,
            title: "Error",
            type: "error",
            desc: "Something Went Wrong",
          });
        });
    } catch (err) {
      console.error(err);
      setLoading(false);

      setMessage({
        message: true,
        title: "Error",
        type: "error",
        desc: "Something Went Wrong",
      });
    }
  };

  const handleSubmitAdmin = async (event) => {
    event.preventDefault();

    setLoading(true);
    const clubSelectInput = document.querySelector("#clubSelectInput");

    const formData = new FormData();

    formData.append("event_id", eventDataValue.id);
    formData.append("club_id", formValues.club);
    formData.append("position_id", positionsId);
    formData.append("districtrole_id", districtRoleId);
    formData.append("user_id", formValues.user.split(", ")[0]);
    formData.append("first_name", formValues.user.split(", ")[1].split(" ")[0]);
    formData.append(
      "middle_name",
      formValues.user.split(", ")[1].split(" ")[1]
    );
    formData.append("last_name", formValues.user.split(", ")[1].split(" ")[2]);
    formData.append("name", formValues.callName);
    formData.append("salutation", "");
    formData.append("address", "");
    formData.append("spouse", formValues.spouse === true ? 1 : 0);
    formData.append("spouse_name", formValues.spouseName);
    formData.append("spouse_phone", formValues.spousePhone);
    formData.append("spouse_tshirt", formValues.spouseTshirt);
    formData.append(
      "registration_fee",
      `${formValues.registrationCategories.split(",")[1]} ${
        formValues.registrationCategories.split(",")[2]
      }`
    );

    formData.append("image", image !== undefined ? image.target.files[0] : "");
    formData.append("email", formValues.email);
    formData.append("phone", formValues.mobileNo);
    formData.append("tshirt", formValues.tshirtSize);
    formData.append("payment_status", "DO");
    formData.append("participation", "Confirmed");

    try {
      fetch(
        "https://rotarydistrict3292.org.np/api/eventregistration-loggedin",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      )
        .then((res) => {
          if (res.status === 200) {
            setLoading(false);

            setWhichFrom("");
            clubSelectInput.value = "";

            setMessage({
              message: true,
              title: "Success",
              type: "success",
              desc: "Thank you for your registration, Please check your email for more details!",
            });

            setFormValuse({
              ...formValues,
              fName: "",
              lName: "",
              callName: "",
              club: "",
              positions: "",
              user: "",
              email: "",
              mobileNo: "",
              districtRole: "",
              tshirtSize: "",
              registrationCategories: "",
              badgeName: "",
              passwordForMobileAPP: "",
              confirmPassword: "",
              paymentOption: "",
              paymentStatus: "",

              spouse: false,
              spouseName: "",
              spousePhone: "",
              spouseTshirt: "",
            });
            setImage();
          } else if (res.status === 500) {
            setLoading(false);
            setMessage({
              message: true,
              title: "Error",
              type: "error",
              desc: "Internal Server Error.",
            });
          } else {
            setLoading(false);

            setMessage({
              message: true,
              title: "Error",
              type: "error",
              desc: "The email has already been taken.",
            });
          }
          return res.json();
        })
        .then((data) => {
          if (data?.error?.email?.length) {
            setMessage({
              message: true,
              title: "Error",
              type: "error",
              desc: data.error.email[0],
            });
          }
        })
        .catch((err) => console.error(err));
    } catch (err) {
      console.error(err);
      setLoading(false);

      setMessage({
        message: true,
        title: "Error",
        type: "error",
        desc: "Something Went Wrong",
      });
    }
  };

  const handleSubmitNew = (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();

    formData.append("event_id", eventDataValue.id);
    formData.append("club_id", rotarianForm.club);
    formData.append("position_id", "");
    formData.append("districtrole_id", "");
    formData.append("first_name", rotarianForm.fName);
    formData.append("middle_name", rotarianForm.mName);
    formData.append("last_name", rotarianForm.lName);
    formData.append("name", rotarianForm.badgeName);
    formData.append("salutation", rotarianForm.salutation);
    formData.append("address", rotarianForm.address);
    formData.append("spouse", 0);
    formData.append("spouse_name", "");
    formData.append("spouse_phone", "");
    formData.append("spouse_tshirt", "");
    formData.append(
      "registration_fee",
      `${rotarianForm.registrationCategories.split(",")[1]} ${
        rotarianForm.registrationCategories.split(",")[2]
      }`
    );
    formData.append(
      "price_index",
      rotarianForm.registrationCategories.split(",")[0]
    );
    formData.append("image", image !== undefined ? image.target.files[0] : "");
    formData.append("email", rotarianForm.email);
    formData.append("phone", rotarianForm.phoneNo);
    formData.append("tshirt", rotarianForm.tshirtSize);
    formData.append("payment_status", "Pending");
    formData.append("participation", "Confirmed");

    try {
      fetch("https://rotarydistrict3292.org.np/api/eventregistration", {
        method: "POST",
        // headers: {
        //   "Content-Type": "application/json",
        // },
        body: formData,
      })
        .then((res) => {
          if (res.status === 200) {
            setLoading(false);

            setRotarianForm({
              ...rotarianForm,
              salutation: "",
              fName: "",
              mName: "",
              lName: "",
              address: "",
              club: "",
              email: "",
              phoneNo: "",
              registrationCategories: "",
              badgeName: "",
              tshirtSize: "",
              passwordForMobileAPP: "",
              confirmPassword: "",
              paymentOption: "",
              paymentStatus: "",
            });

            setImage();

            return res.json();
          } else {
            setLoading(false);

            setMessage({
              message: true,
              title: "Error",
              type: "error",
              desc: "The email has already been taken.",
            });
          }
          return res.json();
        })
        .then((data) => {
          if (data.data) {
            window.location = data.data.payment_url;
          } else {
            setMessage({
              message: true,
              title: "Error",
              type: "error",
              desc: "Phone number should be either a valid mobile number (e.g. 98xxxxxxxx) or a valid landline number",
            });
          }
        })
        .catch((err) => console.error(err));
    } catch (err) {
      console.error(err);
      setLoading(false);

      setMessage({
        message: true,
        title: "Error",
        type: "error",
        desc: "Something Went Wrong",
      });
    }
  };

  const handleSubmitNewAdmin = (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();

    formData.append("event_id", eventDataValue.id);
    formData.append("club_id", rotarianForm.club);
    formData.append("position_id", "");
    formData.append("districtrole_id", "");
    formData.append("first_name", rotarianForm.fName);
    formData.append("middle_name", rotarianForm.mName);
    formData.append("last_name", rotarianForm.lName);
    formData.append("name", rotarianForm.badgeName);
    formData.append("salutation", rotarianForm.salutation);
    formData.append("address", rotarianForm.address);
    formData.append("spouse", 0);
    formData.append("spouse_name", "");
    formData.append("spouse_phone", "");
    formData.append("spouse_tshirt", "");
    formData.append(
      "registration_fee",
      `${rotarianForm.registrationCategories.split(",")[1]} ${
        rotarianForm.registrationCategories.split(",")[2]
      }`
    );
    formData.append("image", image !== undefined ? image.target.files[0] : "");
    formData.append("email", rotarianForm.email);
    formData.append("phone", rotarianForm.phoneNo);
    formData.append("tshirt", rotarianForm.tshirtSize);
    formData.append("payment_status", "DO");
    formData.append("participation", "Confirmed");

    try {
      fetch(
        "https://rotarydistrict3292.org.np/api/eventregistration-loggedin",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      )
        .then((res) => {
          if (res.status === 200) {
            setLoading(false);

            setMessage({
              message: true,
              title: "Success",
              type: "success",
              desc: "Thank you for your registration, Please check your email for more details!",
            });

            setRotarianForm({
              ...rotarianForm,
              salutation: "",
              fName: "",
              mName: "",
              lName: "",
              address: "",
              club: "",
              email: "",
              phoneNo: "",
              registrationCategories: "",
              badgeName: "",
              tshirtSize: "",
              passwordForMobileAPP: "",
              confirmPassword: "",
              paymentOption: "",
              paymentStatus: "",
            });

            setImage();
          } else {
            setLoading(false);

            setMessage({
              message: true,
              title: "Error",
              type: "error",
              desc: "The email has already been taken.",
            });
          }
          return res.json();
        })
        .then((data) => {
          if (data.error.email.length) {
            setMessage({
              message: true,
              title: "Error",
              type: "error",
              desc: data.error.email[0],
            });
          }
        })
        .catch((err) => console.error(err));
    } catch (err) {
      console.error(err);
      setLoading(false);

      setMessage({
        message: true,
        title: "Error",
        type: "error",
        desc: "Something Went Wrong",
      });
    }
  };

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [localStorage]);

  useEffect(() => {
    if (clubDatas !== null) {
      const newdata = clubDatas
        .filter((item) => item.club)
        .sort((a, b) => (a.club > b.club ? 1 : -1));

      setFilteredData(newdata);
    }
  }, [clubDatas]);

  return (
    <div className="register-page">
      {eventDataValue !== null ? (
        <div className="wrapper">
          {/* <ReactToPrint
          trigger={() => (
            <button className="view-pdf" onClick={() => setBorder(true)}>
              <i className="fas fa-file-pdf"></i>
              DOWNLOAD NAME CARD
            </button>
          )}
          content={() => componentRef.current}
          documentTitle={`Rotary District 3292`}
        /> */}

          <div style={{ display: "none" }}>
            <PDFToExport
              excelId="table-to-xls"
              ref={componentRef}
              border={border}
              clicked={true}
            />
          </div>

          {/* <Link to="/">
          <div className="logo">
            <img className="logo-img" src={logo} alt="" />
          </div>
        </Link> */}

          <div className="form-switch-button">
            <h4>Are you a Rotarian/ Rotaract?</h4>
            <div className="switch-btn">
              <button
                onClick={() => {
                  setIsRotarian(false);
                  setWhichFrom("");
                  resetData();
                  setImage();
                }}
                className={`button ${isRotarian === false ? "active" : ""}`}
              >
                Yes
              </button>

              <button
                onClick={() => {
                  setIsRotarian(true);
                  setWhichFrom("");
                  resetData();
                  setImage();
                }}
                className={`button ${isRotarian === true ? "active" : ""}`}
              >
                No
              </button>
            </div>

            <div
              className="indicator"
              onClick={() => {
                setIsRotarian(!isRotarian);
                setWhichFrom("");
                resetData();
                setImage();
              }}
            >
              <button className={`arrow-btn ${isRotarian ? "active" : ""}`}>
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>

          {isRotarian ? (
            <div className="form-area">
              <h3 className="form-title">{eventDataValue.title}</h3>

              <p className="desc">
                {eventDataValue.startDate !== eventDataValue.endDate
                  ? `
                  Start: ${eventDataValue.startDate} End: ${eventDataValue.endDate} |
                  Location: ${eventDataValue.location}
                  `
                  : `Date: ${eventDataValue.startDate}`}{" "}
                | Location: {eventDataValue.location}
              </p>
              <p className="desc">
                {ReactHtmlParser(eventDataValue.description)}
              </p>

              <form
                action=""
                onSubmit={(e) => {
                  if (token === null) {
                    handleSubmitNew(e);
                  } else {
                    handleSubmitNewAdmin(e);
                  }
                }}
                encType="multipart/form-data"
              >
                <div className="input-group">
                  <CustomInput
                    label="Salutation"
                    type="text"
                    name="salutation"
                    handleChange={handleChangeRotarianForm}
                    placeholder="Mr/Mrs..."
                    value={rotarianForm.salutation}
                  />

                  <CustomInput
                    label="First Name.*"
                    type="text"
                    name="fName"
                    handleChange={handleChangeRotarianForm}
                    placeholder=""
                    value={rotarianForm.fName}
                    required
                  />
                </div>

                <div className="input-group">
                  <CustomInput
                    label="Middle Name"
                    type="text"
                    name="mName"
                    handleChange={handleChangeRotarianForm}
                    placeholder=""
                    value={rotarianForm.mName}
                  />

                  <CustomInput
                    label="Last Name.*"
                    type="text"
                    name="lName"
                    handleChange={handleChangeRotarianForm}
                    placeholder=""
                    value={rotarianForm.lName}
                    required
                  />
                </div>

                <div className="input-group">
                  <CustomInput
                    label="Address"
                    type="text"
                    name="address"
                    handleChange={handleChangeRotarianForm}
                    placeholder=""
                    value={rotarianForm.address}
                  />

                  <CustomInput
                    label="Club"
                    type="text"
                    name="club"
                    handleChange={handleChangeRotarianForm}
                    placeholder=""
                    value={rotarianForm.club}
                    select
                  >
                    <option value=""></option>
                    {clubDatas !== null ? (
                      clubDatas.map((data, idx) => (
                        <option key={idx} value={data.id}>
                          {data.club}
                        </option>
                      ))
                    ) : (
                      <option value="">Loading...</option>
                    )}
                  </CustomInput>
                </div>

                <div className="input-group">
                  <CustomInput
                    label="Email*"
                    type="email"
                    name="email"
                    handleChange={handleChangeRotarianForm}
                    placeholder=""
                    value={rotarianForm.email}
                    required
                  />

                  <CustomInput
                    label={
                      localStorage.getItem("token") ? "Phone No." : "Phone No.*"
                    }
                    type="number"
                    name="phoneNo"
                    handleChange={handleChangeRotarianForm}
                    placeholder=""
                    value={rotarianForm.phoneNo}
                    minLength="4"
                    required={localStorage.getItem("token") ? false : true}
                  />
                </div>

                <div className="input-group">
                  <CustomInput
                    label="Registration Categories*"
                    type="text"
                    name="registrationCategories"
                    handleChange={handleChangeRotarianForm}
                    placeholder=""
                    value={rotarianForm.registrationCategories}
                    select
                    required
                  >
                    <option value=""></option>
                    {eventDataValue.registrationFee !== null ? (
                      eventDataValue.registrationFee.map((data, idx) => (
                        <option
                          key={idx}
                          value={`${idx},${data.label},${data.value}`}
                        >
                          {data.label} {data.value}
                        </option>
                      ))
                    ) : (
                      <option value="">No data</option>
                    )}
                  </CustomInput>

                  <CustomInput
                    label="Badge Name.*"
                    type="text"
                    name="badgeName"
                    handleChange={handleChangeRotarianForm}
                    placeholder=""
                    value={rotarianForm.badgeName}
                    required
                  />
                </div>

                {eventDataValue.tshirtSize !== 0 ? (
                  <CustomInput
                    label="Tshirt Size"
                    type="text"
                    name="tshirtSize"
                    handleChange={handleChangeRotarianForm}
                    placeholder=""
                    value={rotarianForm.tshirtSize}
                    select
                  >
                    <option value=""></option>
                    <option value="Small">Small (S)</option>
                    <option value="Medium">Medium (M)</option>
                    <option value="Large">Large (L)</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                    <option value="XXXL">XXXL</option>
                  </CustomInput>
                ) : null}

                {/* <div className="payment-option">
                <h4 className="name">
                  Pay Now by clicking on the Submit button!!
                </h4>

                <div className="list-image">
                  <img
                    className={`${
                      formValues.paymentOption === "Esewa" ? "active" : ""
                    }`}
                    src="https://cdn.esewa.com.np/ui/images/esewa_og.png?111"
                    alt=""
                    onClick={() => {
                      setFormValuse({
                        ...formValues,
                        paymentOption: "Esewa",
                      });
                    }}
                  />
                  <img
                    className={`${
                      formValues.paymentOption === "Cash" ? "active" : ""
                    }`}
                    src={cashIcon}
                    alt=""
                    onClick={() => {
                      setFormValuse({ ...formValues, paymentOption: "Cash" });
                    }}
                  />
                  <img
                    className={`${
                      formValues.paymentOption === "Khalti" ? "active" : ""
                    }`}
                    src="https://dao578ztqooau.cloudfront.net/static/img/logo1.png"
                    alt=""
                    onClick={() => {
                      setFormValuse({
                        ...formValues,
                        paymentOption: "Khalti",
                      });
                    }}
                  />
                </div>
              </div> */}

                {/* <div className="bank-details">
                <h4 className="name">
                  Payment Opiton (When payment is done make sure you screenshot)
                </h4>

                <div className="pay-option">
                  <h5>Scan QR Code (Screenshot your payment)</h5>
                  <img className="qr-image" src={QRpayment} alt="" />

                  <h5>Bank Details (Screenshot your payment)</h5>
                  <ul>
                    <li>
                      <strong>Account Name:</strong> “16th District Conference
                      RI District 3292”
                    </li>
                    <li>
                      <strong>Account No.:</strong> 99800100593687000001
                    </li>
                    <li>
                      <strong>Bank Name:</strong> Shine Resunga development bank
                      Ltd
                    </li>
                    <li>
                      <strong>Bank Branch:</strong> Corporate Branch
                    </li>
                  </ul>
                </div>
              </div> */}

                {eventDataValue.QRImage !== null ||
                eventDataValue.bankDetails !== null ? (
                  <React.Fragment>
                    <div className="bank-details">
                      <h4 className="name">
                        Payment Opiton (When payment is done make sure you
                        screenshot)
                      </h4>

                      <div className="pay-option">
                        {eventDataValue.QRImage !== null ? (
                          <React.Fragment>
                            <h5>Scan QR Code (Screenshot your payment)</h5>
                            <img
                              className="qr-image"
                              src={eventDataValue.QRImage}
                              alt=""
                            />
                          </React.Fragment>
                        ) : null}

                        {eventDataValue.bankDetails !== null ? (
                          <React.Fragment>
                            <h5>Bank Details (Screenshot your payment)</h5>

                            <p>{ReactHtmlParser(eventDataValue.bankDetails)}</p>
                          </React.Fragment>
                        ) : null}
                      </div>
                    </div>

                    <div className="pay-done">
                      <h4 className="name">Payment Status*</h4>

                      <ul>
                        <li
                          className={`${
                            rotarianForm.paymentStatus === "Paid"
                              ? "active"
                              : ""
                          }`}
                          onClick={() => {
                            setRotarianForm({
                              ...rotarianForm,
                              paymentStatus: "Paid",
                            });
                          }}
                        >
                          Paid
                          <input
                            className="hide-input"
                            type="text"
                            name="paymentStatus"
                            value={rotarianForm.paymentStatus}
                            onChange={handleChangeRotarianForm}
                            required
                          />
                        </li>

                        {/* <li
                    className={`${
                      rotarianForm.paymentStatus === "Pay on spot"
                        ? "active"
                        : ""
                    }`}
                    onClick={() => {
                      setRotarianForm({
                        ...rotarianForm,
                        paymentStatus: "Pay on spot",
                      });
                    }}
                  >
                    Pay on spot
                  </li> */}
                      </ul>
                    </div>
                  </React.Fragment>
                ) : // <div className="pay-done">
                //   <h4 className="name">My participation is*</h4>

                //   <ul>
                //     <li
                //       className={`${
                //         rotarianForm.paymentStatus === "Unpaid" ? "active" : ""
                //       }`}
                //       onClick={() => {
                //         setRotarianForm({
                //           ...rotarianForm,
                //           paymentStatus: "Unpaid",
                //           participation: "Confirmed",
                //         });
                //       }}
                //     >
                //       Confirm
                //       <input
                //         className="hide-input"
                //         type="text"
                //         name="paymentStatus"
                //         value={rotarianForm.paymentStatus}
                //         onChange={handleChange}
                //         required
                //       />
                //     </li>

                //     {/* <li
                //       className={`${
                //         formValues.paymentStatus === "Pay on spot"
                //           ? "active"
                //           : ""
                //       }`}
                //       onClick={() => {
                //         setFormValuse({
                //           ...formValues,
                //           paymentStatus: "Pay on spot",
                //         });
                //       }}
                //     >
                //       Pay on spot
                //     </li> */}
                //   </ul>
                // </div>
                null}

                {rotarianForm.paymentStatus === "Paid" ? (
                  <div className="upload-image">
                    <h4 className="name">Upload ScreenShot</h4>

                    <div
                      className="image-upload-box inputButon"
                      id="inputButon"
                    >
                      <input
                        type="file"
                        name="image"
                        onChange={(e) => setImage(e)}
                        id="inputToClick"
                        className="inputToClick"
                        hidden
                      />

                      {image ? (
                        <img
                          className="preview-image"
                          src=""
                          alt=""
                          id="previewImage"
                        />
                      ) : (
                        <p className="info">Click to upload Image</p>
                      )}
                    </div>
                  </div>
                ) : null}

                <button className={`submit ${loading ? "loading" : ""}`}>
                  {localStorage.getItem("token")
                    ? "Get Registered"
                    : "Proceed to payment"}
                </button>
              </form>
            </div>
          ) : (
            <div className="form-area">
              <h3 className="form-title">{eventDataValue.title}</h3>
              <p className="desc">
                {eventDataValue.startDate !== eventDataValue.endDate
                  ? `
                  Start: ${eventDataValue.startDate} End: ${eventDataValue.endDate} |
                  Location: ${eventDataValue.location}
                  `
                  : `Date: ${eventDataValue.startDate}`}{" "}
                | Location: {eventDataValue.location}
              </p>

              <p className="desc">
                {ReactHtmlParser(eventDataValue.description)}
              </p>

              <div className="group">
                <select
                  id="clubSelectInput"
                  name="club"
                  onChange={(e) => {
                    setWhichFrom(e.target.value);
                    setFormValuse({ ...formValues, club: e.target.value });
                  }}
                  required
                >
                  <option value=""></option>
                  {filteredData !== null ? (
                    filteredData.map((clubData, idx) => {
                      return (
                        <option key={idx} value={clubData.id}>
                          {clubData.club}
                        </option>
                      );
                    })
                  ) : (
                    <option value="">Loading...</option>
                  )}
                </select>
                <label
                  htmlFor=""
                  className={formValues.club !== "" ? "shrink" : ""}
                >
                  Rotary Club*
                </label>
              </div>

              {whichFrom !== "" ? (
                <div className="group">
                  <select
                    name="user"
                    onChange={(e) => {
                      setFormValuse({ ...formValues, user: e.target.value });

                      setTimeout(() => {
                        setTesting(!testing);
                      }, 1);
                    }}
                  >
                    <option value=""></option>
                    {clubDatas
                      .filter((data) => whichFrom == data.id)
                      .map((userLists) => {
                        const newdata = userLists.users
                          .filter((item) => item.user_firstname)
                          .sort((a, b) =>
                            a.user_firstname > b.user_firstname ? 1 : -1
                          );

                        return newdata.map((userList, idx) => (
                          <option
                            key={idx}
                            value={`${userList.id}, ${userList.user_firstname} ${userList.user_middlename} ${userList.user_lastname}, ${userList.user_email}, ${userList.user_phone_no}, ${userList.user_clubroles}, ${userList.user_districtrole}`}
                          >
                            {userList.user_firstname} {userList.user_middlename}{" "}
                            {userList.user_lastname}
                          </option>
                        ));
                      })}
                  </select>

                  <label
                    htmlFor=""
                    className={formValues.user !== "" ? "shrink" : ""}
                  >
                    Rotarian
                  </label>
                </div>
              ) : null}

              {whichFrom !== "" ? (
                <form
                  action=""
                  onSubmit={(e) => {
                    if (token === null) {
                      handleSubmit(e);
                    } else {
                      handleSubmitAdmin(e);
                    }
                  }}
                  encType="multipart/form-data"
                >
                  <div className="input-group">
                    <CustomInput
                      label="Call Name*"
                      type="text"
                      name="callName"
                      handleChange={handleChange}
                      placeholder=""
                      value={formValues.callName}
                      required
                    />

                    <CustomInput
                      label="Club Position"
                      type="text"
                      name="positions"
                      handleChange={handleChange}
                      placeholder=""
                      value={formValues.positions}
                      select
                    >
                      <option value=""></option>
                      {positionDatas !== null
                        ? positionDatas.map((data, idx) => (
                            <option key={idx} value={data.name}>
                              {data.name}
                            </option>
                          ))
                        : null}
                    </CustomInput>
                  </div>

                  <div className="input-group">
                    <CustomInput
                      label="Email*"
                      type="email"
                      name="email"
                      handleChange={handleChange}
                      placeholder=""
                      value={formValues.email}
                      required
                    />

                    <CustomInput
                      label={
                        localStorage.getItem("token")
                          ? "Mobile No."
                          : "Mobile No.*"
                      }
                      type="number"
                      name="mobileNo"
                      handleChange={handleChange}
                      placeholder=""
                      value={formValues.mobileNo}
                      minLength={8}
                      required={localStorage.getItem("token") ? false : true}
                    />
                  </div>

                  <div className="input-group">
                    <CustomInput
                      label="District Role"
                      type="text"
                      name="districtRole"
                      handleChange={handleChange}
                      placeholder=""
                      value={formValues.districtRole}
                      select
                    >
                      <option value=""></option>

                      {districtRoleDatas !== null ? (
                        districtRoleDatas.map((data, idx) => (
                          <option key={idx} value={data.name}>
                            {data.name}
                          </option>
                        ))
                      ) : (
                        <option value="">No data or maybe loading</option>
                      )}
                    </CustomInput>

                    {eventDataValue.tshirtSize !== 0 ? (
                      <CustomInput
                        label="T-shirt size"
                        type="text"
                        name="tshirtSize"
                        handleChange={handleChange}
                        placeholder=""
                        value={formValues.tshirtSize}
                        select
                      >
                        <option value=""></option>
                        <option value="Small">Small (S)</option>
                        <option value="Medium">Medium (M)</option>
                        <option value="Large">Large (L)</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                        <option value="XXXL">XXXL</option>
                      </CustomInput>
                    ) : null}
                  </div>

                  <CustomInput
                    label="Registration Fee*"
                    type="text"
                    name="registrationCategories"
                    handleChange={handleChange}
                    placeholder=""
                    value={formValues.registrationCategories}
                    select
                    required
                  >
                    <option value=""></option>
                    {eventDataValue.registrationFee !== null ? (
                      eventDataValue.registrationFee.map((data, idx) => (
                        <option
                          key={idx}
                          value={`${idx},${data.label},${data.value}`}
                        >
                          {data.label} {data.value}
                        </option>
                      ))
                    ) : (
                      <option value="">No data</option>
                    )}
                  </CustomInput>

                  <div className="pay-done">
                    <h4 className="name">
                      Is your spouse joining this event?*
                    </h4>

                    <ul>
                      <li
                        className={`${
                          formValues.spouse === true ? "active" : ""
                        }`}
                        onClick={() => {
                          setFormValuse({ ...formValues, spouse: true });
                        }}
                      >
                        Yes
                      </li>

                      <li
                        className={`${
                          formValues.spouse === false ? "active" : ""
                        }`}
                        onClick={() => {
                          setFormValuse({
                            ...formValues,
                            spouse: false,
                          });
                        }}
                      >
                        No
                      </li>
                    </ul>
                  </div>

                  {/* <div className="pay-done">
                  <h4 className="name">Pay using khalti*</h4>

                  <div className="input-group">
                    <CustomInput
                      label="Khalti Id"
                      type="number"
                      name="mobileNo"
                      handleChange={handleChange}
                      placeholder=""
                      value={formValues.mobileNo}
                    />

                    <CustomInput
                      label="Khalti Password"
                      type="number"
                      name="mobileNo"
                      handleChange={handleChange}
                      placeholder=""
                      value={formValues.mobileNo}
                    />
                  </div>
                </div> */}

                  {formValues.spouse ? (
                    <React.Fragment>
                      <div className="input-group">
                        <CustomInput
                          label="Spouse Name*"
                          type="text"
                          name="spouseName"
                          handleChange={handleChange}
                          placeholder=""
                          value={formValues.spouseName}
                        />

                        <CustomInput
                          label="Spouse Phone*"
                          type="text"
                          name="spousePhone"
                          handleChange={handleChange}
                          placeholder=""
                          value={formValues.spousePhone}
                        />
                      </div>

                      {eventDataValue.tshirtSize !== 0 ? (
                        <CustomInput
                          label="Spouse Tshirt Size*"
                          type="text"
                          name="spouseTshirt"
                          handleChange={handleChange}
                          placeholder=""
                          value={formValues.spouseTshirt}
                          select
                        >
                          <option value=""></option>
                          <option value="Small">Small (S)</option>
                          <option value="Medium">Medium (M)</option>
                          <option value="Large">Large (L)</option>
                          <option value="XL">XL</option>
                          <option value="XXL">XXL</option>
                          <option value="XXXL">XXXL</option>
                        </CustomInput>
                      ) : null}
                    </React.Fragment>
                  ) : null}

                  {/* <div className="payment-option">
                  <h4 className="name">
                    Pay Now by clicking on the Submit button!!
                  </h4>

                  <div className="list-image">
                    <img
                      className={`${
                        formValues.paymentOption === "Esewa" ? "active" : ""
                      }`}
                      src="https://cdn.esewa.com.np/ui/images/esewa_og.png?111"
                      alt=""
                      onClick={() => {
                        setFormValuse({
                          ...formValues,
                          paymentOption: "Esewa",
                        });
                      }}
                    />
                    <img
                      className={`${
                        formValues.paymentOption === "Cash" ? "active" : ""
                      }`}
                      src={cashIcon}
                      alt=""
                      onClick={() => {
                        setFormValuse({ ...formValues, paymentOption: "Cash" });
                      }}
                    />
                    <img
                      className={`${
                        formValues.paymentOption === "Khalti" ? "active" : ""
                      }`}
                      src="https://dao578ztqooau.cloudfront.net/static/img/logo1.png"
                      alt=""
                      onClick={() => {
                        setFormValuse({
                          ...formValues,
                          paymentOption: "Khalti",
                        });
                      }}
                    />
                  </div>
                </div> */}

                  {eventDataValue.QRImage !== null ||
                  eventDataValue.bankDetails !== null ? (
                    <React.Fragment>
                      <div className="bank-details">
                        <h4 className="name">
                          Payment Opiton (When payment is done make sure you
                          screenshot)
                        </h4>

                        <div className="pay-option">
                          {eventDataValue.QRImage !== null ? (
                            <React.Fragment>
                              <h5>Scan QR Code (Screenshot your payment)</h5>
                              <img
                                className="qr-image"
                                src={eventDataValue.QRImage}
                                alt=""
                              />
                            </React.Fragment>
                          ) : null}

                          {eventDataValue.bankDetails !== null ? (
                            <React.Fragment>
                              <h5>Bank Details (Screenshot your payment)</h5>

                              <p>
                                {ReactHtmlParser(eventDataValue.bankDetails)}
                              </p>
                            </React.Fragment>
                          ) : null}
                        </div>
                      </div>

                      <div className="pay-done">
                        <h4 className="name">Payment Status*</h4>

                        <ul>
                          <li
                            className={`${
                              formValues.paymentStatus === "Paid"
                                ? "active"
                                : ""
                            }`}
                            onClick={() => {
                              setFormValuse({
                                ...formValues,
                                paymentStatus: "Paid",
                              });
                            }}
                          >
                            Paid
                            <input
                              className="hide-input"
                              type="text"
                              name="paymentStatus"
                              value={formValues.paymentStatus}
                              onChange={handleChange}
                              required
                            />
                          </li>

                          {/* <li
                      className={`${
                        formValues.paymentStatus === "Pay on spot"
                          ? "active"
                          : ""
                      }`}
                      onClick={() => {
                        setFormValuse({
                          ...formValues,
                          paymentStatus: "Pay on spot",
                        });
                      }}
                    >
                      Pay on spot
                    </li> */}
                        </ul>
                      </div>

                      <div className="upload-image">
                        <h4 className="name">Upload ScreenShot</h4>

                        <div
                          className="image-upload-box inputButon"
                          id="inputButon"
                        >
                          <input
                            type="file"
                            onChange={(e) => setImage(e)}
                            id="inputToClick"
                            className="inputToClick"
                            name="image"
                            hidden
                          />

                          {image ? (
                            <img
                              className="preview-image"
                              src=""
                              alt=""
                              id="previewImage"
                            />
                          ) : (
                            <p className="info">Click to upload Image</p>
                          )}
                        </div>
                      </div>
                    </React.Fragment>
                  ) : // <div className="pay-done">
                  //   <h4 className="name">My participation is*</h4>

                  //   <ul>
                  //     <li
                  //       className={`${
                  //         formValues.paymentStatus === "Unpaid" ? "active" : ""
                  //       }`}
                  //       onClick={() => {
                  //         setFormValuse({
                  //           ...formValues,
                  //           paymentStatus: "Unpaid",
                  //           participation: "Confirmed",
                  //         });
                  //       }}
                  //     >
                  //       Confirm
                  //       <input
                  //         className="hide-input"
                  //         type="text"
                  //         name="paymentStatus"
                  //         value={formValues.paymentStatus}
                  //         onChange={handleChange}
                  //         required
                  //       />
                  //     </li>

                  //     {/* <li
                  //     className={`${
                  //       formValues.paymentStatus === "Pay on spot"
                  //         ? "active"
                  //         : ""
                  //     }`}
                  //     onClick={() => {
                  //       setFormValuse({
                  //         ...formValues,
                  //         paymentStatus: "Pay on spot",
                  //       });
                  //     }}
                  //   >
                  //     Pay on spot
                  //   </li> */}
                  //   </ul>
                  // </div>
                  null}

                  {/* <KhaltiComponent /> */}

                  <button className={`submit ${loading ? "loading" : ""}`}>
                    {localStorage.getItem("token")
                      ? "Get Registered"
                      : "Proceed to payment"}
                  </button>
                </form>
              ) : null}
            </div>
          )}
        </div>
      ) : (
        "Loading..."
      )}
    </div>
  );
};
