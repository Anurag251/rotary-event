// @ts-nocheck
import { useContext, useState } from "react";
import { CustomInput } from "../components/CustomInput.component";
import { DataContext } from "../provider/allData.provider";

export const ReportPage = () => {
  const { loading } = useContext(DataContext);

  const [formValues, setFormValuse] = useState({
    select: "",
    club: "",
    user: "",
    callName: "",
    positions: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormValuse({ ...formValues, [name]: value });
  };

  return (
    <div className="report-page">
      <div className="register-page">
        <div className="wrapper">
          <div className="form-area">
            <h3 className="form-title">{"location.state.title"}</h3>

            <p className="desc"></p>

            <div className="group">
              <select
                id="clubSelectInput"
                name="select"
                onChange={(e) => {
                  handleChange(e);
                }}
                value={formValues.select}
                required
              >
                <option value=""></option>

                <option value="1">Loading...</option>
              </select>
              <label
                htmlFor=""
                className={formValues.select !== "" ? "shrink" : ""}
              >
                Rotary Club*
              </label>
            </div>

            <div className="group">
              <select
                name="user"
                onChange={(e) => handleChange(e)}
                value={formValues.user}
              >
                <option value=""></option>
                <option value="Hello">Hello</option>
                <option value="Hello">Hello</option>
                <option value="Hello">Hello</option>
              </select>

              <label
                htmlFor=""
                className={formValues.user !== "" ? "shrink" : ""}
              >
                Rotarian
              </label>
            </div>

            <form action="" onSubmit={(e) => {}} encType="multipart/form-data">
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
                  <option value="">Select</option>
                  <option value="world1">world1</option>
                </CustomInput>
              </div>

              <button className={`submit ${loading ? "loading" : ""}`}>
                {localStorage.getItem("token")
                  ? "Get Registered"
                  : "Proceed to payment"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
