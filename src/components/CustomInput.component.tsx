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
      <label htmlFor={name}>{label}</label>
      {select ? (
        <select name={name} id={name} onChange={handleChange} {...otherProps}>
          {children}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          id={name}
          onChange={handleChange}
          {...otherProps}
        />
      )}
    </div>
  );
};
