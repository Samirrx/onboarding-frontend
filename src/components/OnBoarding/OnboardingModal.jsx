import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInput from "../TextInput/TextInput";
import { Box, Drawer, Typography } from "@mui/material";
import MainCard from "../MainCard";

export const OnboardingModal = ({ setOpen, open, addTenant }) => {
  const validationSchema = Yup.object({
    name: Yup.string().required("First name is required"),
    tenantId: Yup.string().required("Tenant Id is required"),
    dbUsername: Yup.string().required("Database username is required"),
    dbPassword: Yup.string().required("Database password is required"),
    dbName: Yup.string().required("Database name is required"),
    bucketName: Yup.string().required("Bucket name is required"),
  });
  const closeDrawer = () => {
    setOpen(false);
  };
  return (
    <>
      <Drawer
        open={open}
        onClose={closeDrawer}
        sx={{
          ml: open ? 3 : 0,
          flexShrink: 0,
          zIndex: 1200,
          overflowX: "hidden",
          width: { xs: 600, md: 600 },
          transition: "width 0.6s ease",
          "& .MuiDrawer-paper": {
            height: "calc(100vh - 3px)",
            width: 600,
            position: "fixed",
            border: "none",
            borderRadius: "0px",
            transition: "transform 0.6s ease",
          },
        }}
        variant="temporary"
        anchor="right"
        ModalProps={{ keepMounted: true }}
      >
        <Formik
          initialValues={{
            name: "",
            tenantId: "",
            dbUsername: "",
            dbPassword: "",
            dbName: "",
            bucketName: "",
            isActive: true,
            dbUri: "",
            onboardingDate: new Date(),
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            setTimeout(() => {
              addTenant(values);
              setSubmitting(false);
              resetForm(); // Reset form after submit
              setOpen(false);
            }, 400);
          }}
        >
          {({ isSubmitting, resetForm, setFieldValue }) => (
            <MainCard
              sx={{
                width: "100%",
                backgroundColor: "primary",
                "& .MuiCardContent-root": {
                  height: "calc(100vh - 167px)",
                  padding: "2px",
                },
              }}
              title={
                <Box display="flex" sx={{ justifyContent: "space-between" }}>
                  <Typography
                    sx={{
                      fontSize: "1.25rem",
                      color: "#616161",
                      fontWeight: 600,
                    }}
                  >
                    Onboarding
                  </Typography>
                  <Box display="flex" justifyContent="flex-end">
                    <button
                      type="submit"
                      form="onboardingForm"
                      disabled={isSubmitting}
                      className="submit-btn "
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        resetForm();
                      }}
                      className="clear-btn"
                    >
                      Close
                    </button>
                  </Box>
                </Box>
              }
            >
              <Form className="form" id="onboardingForm">
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
                  onChange={(e) => {
                    const dbName = e.target.value;
                    setFieldValue("dbName", dbName);
                    setFieldValue(
                      "dbUri",
                      `jdbc:mysql://3.6.229.13:3306/${dbName}?useSSL=false&requireSSL=false&serverTimezone=UTC`
                    );
                  }}
                  placeholder="Enter your Database name"
                />
                <TextInput
                  label="Bucket name *"
                  name="bucketName"
                  type="text"
                  placeholder="Enter your Bucket name"
                />
              </Form>
            </MainCard>
          )}
        </Formik>
      </Drawer>
    </>
  );
};
