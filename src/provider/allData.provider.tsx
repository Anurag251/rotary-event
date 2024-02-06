// @ts-nocheck

import { createContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [clubDatas, setClubDatas] = useState(null);
  const [eventDatas, setEventDatas] = useState(null);
  const [positionDatas, setPositionDatas] = useState(null);
  const [districtRoleDatas, setDistrictRoleDatas] = useState(null);
  const [mealData, setMealData] = useState(null);
  const [loginPopup, setLoginPopup] = useState(false);
  const [rerender, setRerender] = useState(false);

  const [formValues, setFormValuse] = useState({
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
    priceIndex: "",
    badgeName: "",
    passwordForMobileAPP: "",
    confirmPassword: "",
    paymentOption: "",
    paymentStatus: "",
    participation: "",

    spouse: false,
    spouseName: "",
    spousePhone: "",
    spouseTshirt: "",
  });

  const [rotarianForm, setRotarianForm] = useState({
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
    participation: "",
  });

  const [message, setMessage] = useState({
    message: false,
    title: "",
    type: "",
    desc: "",
  });

  const location = useLocation();

  useEffect(() => {
    fetch("https://rotarydistrict3292.org.np/api/get/eventregister").then(
      (res) => res.json().then((data) => setEventDatas(data.data))
    );
  }, []);

  useEffect(() => {
    fetch("https://rotarydistrict3292.org.np/api/get/positions").then((res) =>
      res.json().then((data) => setPositionDatas(data.data))
    );
  }, []);

  useEffect(() => {
    fetch("https://rotarydistrict3292.org.np/api/get/clubs").then((res) =>
      res.json().then((data) => setClubDatas(data.data))
    );
  }, []);

  useEffect(() => {
    fetch("https://rotarydistrict3292.org.np/api/get/districtrole").then(
      (res) => res.json().then((data) => setDistrictRoleDatas(data.data))
    );
  }, []);

  useEffect(() => {
    fetch("https://rotarydistrict3292.org.np/api/get/meal").then((res) =>
      res.json().then((data) => setMealData(data.data))
    );
  }, []);

  const resetData = () => {
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
      participation: "",

      spouse: false,
      spouseName: "",
      spousePhone: "",
      spouseTshirt: "",
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
      participation: "",
    });
  };

  return (
    <DataContext.Provider
      value={{
        formValues,
        setFormValuse,
        clubDatas,
        eventDatas,
        positionDatas,
        rotarianForm,
        setRotarianForm,
        districtRoleDatas,
        setDistrictRoleDatas,
        mealData,
        resetData,
        message,
        setMessage,
        loginPopup,
        setLoginPopup,
        rerender,
        setRerender,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
