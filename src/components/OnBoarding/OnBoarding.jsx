import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import TextInput from "../TextInput/TextInput";
import "./OnBoarding.css";
import { DataGrid } from "@mui/x-data-grid";
import MainCard from "../MainCard";
import { Box, Drawer, Fab } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

const validationSchema = Yup.object({
  name: Yup.string().required("First name is required"),
  tenantId: Yup.string().required("Tenant Id is required"),
  dbUsername: Yup.string().required("Database username is required"),
  dbPassword: Yup.string().required("Database password is required"),
  dbName: Yup.string().required("Database name is required"),
  bucketName: Yup.string().required("Bucket name is required"),
});

const OnBoarding = () => {
  const [onBoardingList, setOnBoardingList] = useState([]);
  const [columns, setColumns] = useState([]);
  const [open, setOpen] = useState(false);

  const getAllUser = async () => {
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
      setOnBoardingList(data);
      return data;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const addTenant = async (tenantData) => {
    try {
      const response = await axios.post(
        "https://portal.dglide.com/addTenant",
        tenantData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Tenant added successfully:", response.data);
      getAllUser();
      return response.data;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getAllUser();
  }, []);

  useEffect(() => {
    if (onBoardingList?.length > 0) {
      const keysData = Object.keys(onBoardingList[0]);

      const headers = keysData
        ?.filter(
          (key) =>
            key !== "dbUri" &&
            key !== "dbPassword" &&
            key !== "createdBy" &&
            key !== "createdOn" &&
            key !== "updatedBy" &&
            key !== "updatedOn"
        )
        .map((key) => {
          return {
            headerName: key.charAt(0).toUpperCase() + key.slice(1),
            field: key,
            flex: 1,
          };
        });
      setColumns(headers);
    }
  }, [onBoardingList]);

  const closeDrawer = () => {
    setOpen(false);
  };
  useEffect(() => {
    getAllUser();
  }, []);
  return (
    <>
      <div className="p-3">
        <MainCard
          sx={{
            width: "100%",
            backgroundColor: "primary",
            // currentTheme === "Dark" ? colors.darkLevel2 : colors.white,
            "& .MuiCardContent-root": {
              height: "calc(100vh - 167px)",
              padding: "2px",
            },
          }}
          title={
            <Box display="flex" justifyContent="flex-end">
              <Fab
                size="small"
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  "&:hover": {
                    bgcolor: "primary.main",
                    color: "white",
                  },
                  width: "35px",
                  height: "35px",
                  borderRadius: "8px",
                  minHeight: 0,
                }}
                onClick={() => setOpen(true)}
              >
                <AddRoundedIcon fontSize="small" />
              </Fab>
            </Box>
          }
        >
          <DataGrid
            rows={onBoardingList}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
          />
        </MainCard>
      </div>
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
            dbUri:
              "jdbc:mysql://3.6.229.13:3306/nisha?useSSL=false&requireSSL=false&serverTimezone=UTC",
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

              <div className="button-group">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="submit-btn "
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
              </div>
            </Form>
          )}
        </Formik>
      </Drawer>
    </>
  );
};

export default OnBoarding;
