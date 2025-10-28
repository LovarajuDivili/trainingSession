import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
} from "@mui/material";
import Header from "../components/Header";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import MonitorIcon from "@mui/icons-material/Monitor";
import Calendar from "../components/ExtraComponents/Calendar";
import PeopleAltTwoToneIcon from "@mui/icons-material/PeopleAltTwoTone";
import { AssignmentInd, CorporateFare, MoreHoriz } from "@mui/icons-material";
import OrderProgress from "../components/ExtraComponents/OrderProgress";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Accountant = () => {
  const getCardStyles = () => ({
    width: 260,
    height: 100,
    borderRadius: 3,
    boxShadow: 3,
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });

  const [currentTime, setCurrentTime] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setCurrentTime(formattedTime);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ minHeight: "88vh", backgroundColor: "white" }}>
      <Header role={""} />
      <Box sx={{ mt: 10, px: 3, display: "flex", gap: 3 }}>
        <Box sx={{ width: "70%" }}>
          <Grid
            container
            spacing={7}
            alignItems="flex-start"
            justifyContent="flex-start"
          >
            {/* Card 1 */}
            <Card sx={getCardStyles}>
              <CardContent
                sx={{ display: "flex", alignItems: "center", gap: 2, p: 2 }}
              >
                <LaptopMacIcon sx={{ fontSize: 35, color: "#906aff" }} />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    pr: 0.5,
                    pl: 0.5,
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h5" fontWeight={700}>
                    120
                  </Typography>
                  <Typography variant="subtitle2" color="black" sx={{ pt: 1 }}>
                    Laptops
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Card 2 */}
            <Card sx={getCardStyles}>
              <CardContent
                sx={{ display: "flex", alignItems: "center", gap: 2, p: 2 }}
              >
                <HeadphonesIcon sx={{ fontSize: 35, color: "#906aff" }} />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",

                    alignItems: "center",
                  }}
                >
                  <Typography variant="h5" fontWeight={700}>
                    100
                  </Typography>
                  <Typography variant="subtitle2" color="black" sx={{ pt: 1 }}>
                    HeadPhones
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Card 3 */}
            <Card sx={getCardStyles}>
              <CardContent
                sx={{ display: "flex", alignItems: "center", gap: 2, p: 2 }}
              >
                <MonitorIcon sx={{ fontSize: 35, color: "#906aff" }} />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    pr: 0.5,
                    pl: 0.5,
                  }}
                >
                  <Typography variant="h5" fontWeight={700}>
                    66
                  </Typography>
                  <Typography variant="subtitle2" color="black" sx={{ pt: 1 }}>
                    Monitors
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Box sx={{ mt: 5, alignItems: "center", width: "70%", ml: 15 }}>
            <Calendar />
          </Box>
          <Divider sx={{ fontsize: 2 }} />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              mt: 2,
              gap: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography>
                <strong>Today Course</strong>
              </Typography>
              <MoreHoriz />
            </Box>

            <Card
              onClick={() => navigate("/accountant/employeedata")}
              sx={{
                height: 70,
                display: "flex",
                alignItems: "center",
                pt: 1,
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": { boxShadow: 6, transform: "scale(1.02)" },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    borderRadius: "10px",
                    backgroundColor: "black",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 70,
                    height: 50,
                  }}
                >
                  <PeopleAltTwoToneIcon
                    sx={{ color: "white", height: 75, width: 40 }}
                  />
                </Box>
                <Box
                  sx={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    pr: 3,
                    gap: 1.5,
                  }}
                >
                  <Typography sx={{ fontSize: "10px" }}>
                    {currentTime}
                  </Typography>
                  <Typography sx={{ fontsize: "30px", color: "#906aff" }}>
                    Employees
                  </Typography>
                </Box>
                <Typography>
                  Dedicated professionals who perform specific tasks for
                  compensation under the direction of an employer.{" "}
                </Typography>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: "#906aff",
                    color: "white",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "bold",
                    fontSize: "18px",
                    ml: "auto",
                  }}
                >
                  20
                </Box>
              </CardContent>
            </Card>

            <Card
              onClick={() => navigate("/accountant/hrData")}
              sx={{
                height: 70,
                display: "flex",
                alignItems: "center",
                pt: 1,
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": { boxShadow: 6, transform: "scale(1.02)" },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    borderRadius: "10px",
                    backgroundColor: "black",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 70,
                    height: 50,
                  }}
                >
                  <AssignmentInd
                    sx={{ color: "white", height: 75, width: 40 }}
                  />
                </Box>
                <Box
                  sx={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    pr: 0,
                    gap: 1.5,
                  }}
                >
                  <Typography sx={{ fontSize: "10px" }}>
                    {currentTime}
                  </Typography>
                  <Typography sx={{ fontsize: "30px", color: "#906aff" }}>
                    HR Department
                  </Typography>
                </Box>
                <Typography>
                  The HR department is in charge of a company's staff, handling
                  things like hiring, paying, and training.{" "}
                </Typography>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: "#906aff",
                    color: "white",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "bold",
                    fontSize: "18px",
                    ml: "auto",
                  }}
                >
                  15
                </Box>
              </CardContent>
            </Card>
            <Card
              onClick={() => navigate("/accountant/employeedata")}
              sx={{
                height: 70,
                display: "flex",
                alignItems: "center",
                pt: 1,
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": { boxShadow: 6, transform: "scale(1.02)" },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    borderRadius: "10px",
                    backgroundColor: "black",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 70,
                    height: 50,
                  }}
                >
                  <CorporateFare
                    sx={{ color: "white", height: 75, width: 40 }}
                  />
                </Box>
                <Box
                  sx={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    pr: 3,
                    gap: 1.5,
                  }}
                >
                  <Typography sx={{ fontSize: "10px" }}>
                    {currentTime}
                  </Typography>
                  <Typography sx={{ fontsize: "30px", color: "#906aff" }}>
                    Share Holders
                  </Typography>
                </Box>
                <Typography sx={{ pr: 30 }}>
                  A shareholder is a partial owner of a company who holds shares
                  of its stock.{" "}
                </Typography>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: "#906aff",
                    color: "white",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "bold",
                    fontSize: "18px",
                    ml: "auto",
                  }}
                >
                  9
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
        <Box
          sx={{
            width: "30%",
            backgroundColor: "white",
            borderRadius: 3,
            boxShadow: 2,
            p: 2,
          }}
        >
          <OrderProgress />
        </Box>
      </Box>
      <Outlet />
    </Box>
  );
};

export default Accountant;
