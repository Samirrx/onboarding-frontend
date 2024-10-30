import React from "react";
import { useField } from "formik";
import "./TextInput.css";

const TextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <div className="form-group">
      <label htmlFor={props.id || props.name}>{label}</label>
      <input className="text-input" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default TextInput;
