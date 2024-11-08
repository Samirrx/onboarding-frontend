import React, { useEffect, useState } from "react";
import axios from "axios";

import "./OnBoarding.css";
import { DataGrid } from "@mui/x-data-grid";
import MainCard from "../MainCard";
import { Box, Fab, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { OnboardingModal } from "./OnboardingModal";

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
      <OnboardingModal open={open} setOpen={setOpen} addTenant={addTenant} />
    </>
  );
};

export default OnBoarding;
