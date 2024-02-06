// @ts-nocheck
import React from "react";

export const CustomInput = ({
  name,
  label,
  handleChange,
  type,
  select,
  children,
  ...otherProps
}) => {
  return (
    <div className="group">
      {select ? (
        <React.Fragment>
          <select name={name} id={name} onChange={handleChange} {...otherProps}>
            {children}
          </select>
          <label
            htmlFor={name}
            className={`${otherProps.value.length ? "shrink" : ""}`}
          >
            {label}
          </label>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <input
            type={type}
            name={name}
            id={name}
            onChange={handleChange}
            {...otherProps}
          />

          <label
            htmlFor={name}
            className={`${otherProps.value.length ? "shrink" : ""}`}
          >
            {label}
          </label>
        </React.Fragment>
      )}
    </div>
  );
};
