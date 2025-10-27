import { Box, Card, CardContent, Typography, Grid } from "@mui/material";
import Header from "../components/Header";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import MonitorIcon from "@mui/icons-material/Monitor";
import Calendar from "../components/ExtraComponents/Calendar";
import PeopleAltTwoToneIcon from "@mui/icons-material/PeopleAltTwoTone";
import { AssignmentInd, CorporateFare, MoreHoriz } from "@mui/icons-material";

const Accountant = () => {
  const getCardStyles = () => ({
    width: 200,
    height: 100,
    borderRadius: 3,
    boxShadow: 3,
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });

  return (
    <Box sx={{ minHeight: "88vh", backgroundColor: "white" }}>
      <Header role={""} />
      <Box sx={{ mt: 10, px: 3 }}>
        <Box sx={{ mt: 10, px: 3, width: "50%" }}>
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
                <Typography
                  variant="body2"
                  color="#906aff"
                  sx={{ ml: "auto", fontWeight: 600 }}
                >
                  10%
                </Typography>
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
                <Typography
                  variant="body2"
                  color="#906aff"
                  sx={{ ml: "auto", fontWeight: 600 }}
                >
                  20%
                </Typography>
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
                <Typography
                  variant="body2"
                  color="#906aff"
                  sx={{ ml: "auto", fontWeight: 600 }}
                >
                  5%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Box sx={{ mt: 5 }}>
            <Calendar />
          </Box>
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
              sx={{ height: 70, display: "flex", alignItems: "center", pt: 1 }}
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
                  <Typography sx={{ fontSize: "10px" }}>08:30-10:30</Typography>
                  <Typography sx={{ fontsize: "30px", color: "#906aff" }}>
                    Employees
                  </Typography>
                </Box>
                <Typography>
                  Dedicated professionals who perform specific tasks for
                  compensation under the direction of an employer.{" "}
                </Typography>
                <Typography sx={{ fontSize: "25px", color: "#906aff" }}>
                  <strong>20</strong>
                </Typography>
              </CardContent>
            </Card>

            <Card
              sx={{ height: 70, display: "flex", alignItems: "center", pt: 1 }}
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
                    pr: 3,
                    gap: 1.5,
                  }}
                >
                  <Typography sx={{ fontSize: "10px" }}>
                    10:30 - 11:30
                  </Typography>
                  <Typography sx={{ fontsize: "30px", color: "#906aff" }}>
                    HR Department
                  </Typography>
                </Box>
                <Typography>
                  The HR department is in charge of a company's staff, handling
                  things like hiring, paying, and training.{" "}
                </Typography>
                <Typography sx={{ fontSize: "25px", color: "#906aff" }}>
                  <strong>15</strong>
                </Typography>
              </CardContent>
            </Card>
            <Card
              sx={{ height: 70, display: "flex", alignItems: "center", pt: 1 }}
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
                    width: 50,
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
                    11:30 - 12:30
                  </Typography>
                  <Typography sx={{ fontsize: "30px", color: "#906aff" }}>
                    Share Holders
                  </Typography>
                </Box>
                <Typography>
                  A shareholder is a partial owner of a company who holds shares
                  of its stock.{" "}
                </Typography>
                <Typography sx={{ fontSize: "25px", color: "#906aff" }}>
                  <strong>9</strong>
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Accountant;
