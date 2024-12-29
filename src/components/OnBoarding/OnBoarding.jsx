import React, { useEffect, useState } from "react";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Box, Fab } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

import MainCard from "../MainCard";
import "./OnBoarding.css";
import { OnboardingModal } from "./OnboardingModal";

const OnBoarding = () => {
  const [onBoardingList, setOnBoardingList] = useState([]);
  const [columns, setColumns] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getAllUser();
  }, []);

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
      getAllUser();
      return response.data;
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
            headerName: key.toUpperCase(),
            field: key,
            flex: 1,
          };
        });
      setColumns(headers);
    }
  }, [onBoardingList]);

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
            <Box
              display="flex"
              sx={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <img
                src="https://d3bzo30ykdobe9.cloudfront.net/logo/logo.svg"
                style={{ height: 70, width: 70 }}
                alt="logo"
              ></img>
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
