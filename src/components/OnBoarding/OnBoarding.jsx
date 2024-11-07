import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from 'axios';
import TextInput from "../TextInput/TextInput";
import "./OnBoarding.css";

const validationSchema = Yup.object({
  name: Yup.string().required("First name is required"),
  tenantId: Yup.string().required("Tenant Id is required"),
  dbUsername: Yup.string().required("Database username is required"),
  dbPassword: Yup.string().required("Database password is required"),
  dbName: Yup.string().required("Database name is required"),
  bucketName: Yup.string().required("Bucket name is required"),
});


const OnBoarding = () => {
  const [viewAll,setViewAll]= useState(false)

  const handleClick =async()=>{
    setViewAll(true)
    try {
      const response = await fetch("https://portal.dglide.com/getAllTenant", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to add tenant");
      }
  
      const data = await response.json();
      console.log("Tenant added successfully:", data);
      return data;
    } catch (error) {
      console.error("Error:", error);
    }
  }


  const addTenant = async (tenantData) => {

    try {
      const response = await axios.post("https://portal.dglide.com/addTenant", tenantData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Tenant added successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  return (
    <>
    <Formik
      initialValues={{
        name: "asa",
        tenantId: "212",
        dbUsername: "sa",
        dbPassword: "sas",
        dbName: "asa",
        bucketName: "sasa",
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        setTimeout(() => {
          console.log("Form data:", values);
          addTenant(values)
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
          resetForm(); // Reset form after submit
        }, 400);
      }}
    >
      {({ isSubmitting, resetForm }) => (
        <Form className="form">
          <h2>Onboarding Information</h2>
          <TextInput
            label="Name *"
            name="name"
            type="text"
            placeholder="Enter your name"
          />
          <TextInput
            label="Tenant Id *"
            name="tenantId"
            type="text"
            placeholder="Enter your Tenant Id"
          />
          <TextInput
            label="Database username *"
            name="dbUsername"
            type="text"
            placeholder="Enter your Database username"
          />
          <TextInput
            label="Database password *"
            name="dbPassword"
            type="password"
            placeholder="Enter your Database password"
          />
          <TextInput
            label="Database name *"
            name="dbName"
            type="text"
            placeholder="Enter your Database name"
          />
          <TextInput
            label="Bucket name *"
            name="bucketName"
            type="text"
            placeholder="Enter your Bucket name"
          />

          <div className="button-group">
            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-btn"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
            <button
              type="button"
              onClick={() => resetForm()}
              className="clear-btn"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleClick}
              className="clear-btn"
            >
              View All 
            </button>
          </div>
        </Form>
      )}
    </Formik>
    {viewAll && 
     <div className="">

     </div>
    }
    </>
  );
};

export default OnBoarding;
