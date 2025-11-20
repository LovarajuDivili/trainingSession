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
import CategoryIcon from "@mui/icons-material/Category";
import { AssignmentInd, CorporateFare, MoreHoriz } from "@mui/icons-material";
import OrderProgress from "../components/ExtraComponents/OrderProgress";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useThemeColors } from "../hooks/useThemeColors";
import axios from "axios";

const Accountant = () => {
  const colors = useThemeColors();
  const [inventoryCounts, setInventoryCounts] = useState({
    laptops: 0,
    headphones: 0,
    monitors: 0,
    others: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  const getCardStyles = () => ({
    width: 210,
    height: 100,
    borderRadius: 3,
    boxShadow: 3,
    backgroundColor: colors.background.card,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: `1px solid ${colors.border.light}`,
  });

  const [currentTime, setCurrentTime] = useState<string>("");
  const [showInfo, setShowInfo] = useState(false);
  const navigate = useNavigate();

  // Fetch inventory counts
  const fetchInventoryCounts = async () => {
    try {
      setLoading(true);

      // Fetch all inventory items
      const response = await axios.get("/api/inventory");
      const allItems = response.data;

      // Count items by category
      const laptops = allItems.filter((item: { category: string }) =>
        item.category?.toLowerCase().includes("laptop")
      ).length;

      const headphones = allItems.filter((item: { category: string }) =>
        item.category?.toLowerCase().includes("headphone")
      ).length;

      const monitors = allItems.filter((item: { category: string }) =>
        item.category?.toLowerCase().includes("monitor")
      ).length;

      // Count others (items that don't fit the above categories)
      const others = allItems.filter((item: { category: string }) => {
        const category = item.category?.toLowerCase();
        return (
          !category?.includes("laptop") &&
          !category?.includes("headphone") &&
          !category?.includes("monitor")
        );
      }).length;

      setInventoryCounts({
        laptops,
        headphones,
        monitors,
        others,
        total: allItems.length,
      });
    } catch (error) {
      console.error("Error fetching inventory counts:", error);
      // Set fallback values in case of error
      setInventoryCounts({
        laptops: 0,
        headphones: 0,
        monitors: 0,
        others: 0,
        total: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryCounts();
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setCurrentTime(formattedTime);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      sx={{
        minHeight: "88vh",
        backgroundColor: colors.background.white,
        color: colors.text.primary,
      }}
    >
      <Header role={""} />
      <Box sx={{ mt: 10, px: 3, display: "flex", gap: 3 }}>
        <Box sx={{ width: "70%" }}>
          <Grid
            container
            spacing={7}
            alignItems="flex-start"
            justifyContent="flex-start"
          >
            {/* Card 1 - Laptops */}
            <Card sx={getCardStyles}>
              <CardContent
                sx={{ display: "flex", alignItems: "center", gap: 2, p: 2 }}
              >
                <LaptopMacIcon
                  sx={{ fontSize: 35, color: colors.status.error }}
                />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    pr: 0.5,
                    pl: 0.5,
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    color={colors.text.primary1}
                  >
                    {loading ? "..." : inventoryCounts.laptops}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    color={colors.text.primary1}
                    sx={{ pt: 1 }}
                  >
                    Laptops
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Card 2 - Headphones */}
            <Card sx={getCardStyles}>
              <CardContent
                sx={{ display: "flex", alignItems: "center", gap: 2, p: 2 }}
              >
                <HeadphonesIcon
                  sx={{ fontSize: 35, color: colors.status.info }}
                />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    color={colors.text.primary1}
                  >
                    {loading ? "..." : inventoryCounts.headphones}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    color={colors.text.primary1}
                    sx={{ pt: 1 }}
                  >
                    HeadPhones
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Card 3 - Monitors */}
            <Card sx={getCardStyles}>
              <CardContent
                sx={{ display: "flex", alignItems: "center", gap: 2, p: 2 }}
              >
                <MonitorIcon
                  sx={{ fontSize: 35, color: colors.status.success }}
                />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    pr: 0.5,
                    pl: 0.5,
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    color={colors.text.primary1}
                  >
                    {loading ? "..." : inventoryCounts.monitors}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    color={colors.text.primary1}
                    sx={{ pt: 1 }}
                  >
                    Monitors
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Card 4 - Others */}
            <Card
              sx={getCardStyles}
              onClick={() => navigate("/accountant/requestOrder")}
            >
              <CardContent
                sx={{ display: "flex", alignItems: "center", gap: 2, p: 2 }}
              >
                <CategoryIcon sx={{ fontSize: 35, color: "grey" }} />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    pr: 0.5,
                    pl: 0.5,
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    color={colors.text.primary1}
                  >
                    {loading ? "..." : inventoryCounts.total}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    color={colors.text.primary1}
                    sx={{ pt: 1 }}
                  >
                    Others
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Optional: Total Inventory Card - You can add this if you want */}
          </Grid>

          <Box sx={{ mt: 5, alignItems: "center", width: "70%", ml: 15 }}>
            <Calendar />
          </Box>
          <Divider sx={{ borderColor: colors.border.light }} />
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
              <Typography color={colors.text.primary1}>
                <strong>Today Course</strong>
              </Typography>
              <MoreHoriz sx={{ color: colors.text.primary1 }} />
            </Box>

            {/* Employee Card */}
            <Card
              onClick={() => navigate("/accountant/employeedata")}
              sx={{
                height: 60,
                display: "flex",
                alignItems: "center",
                pt: 1,
                cursor: "pointer",
                transition: "0.3s",
                backgroundColor: colors.background.card,
                border: `1px solid ${colors.border.light}`,
                "&:hover": {
                  boxShadow: 6,
                  transform: "scale(1.02)",
                  backgroundColor: colors.primary.lighter,
                },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    borderRadius: "10px",
                    backgroundColor: colors.primary.main,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 70,
                    height: 50,
                  }}
                >
                  <PeopleAltTwoToneIcon
                    sx={{ color: colors.text.white, height: 75, width: 40 }}
                  />
                </Box>
                <Box
                  sx={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    pr: 3,
                    gap: 1.5,
                    minWidth: 120,
                  }}
                >
                  <Typography
                    sx={{ fontSize: "10px", color: colors.text.secondary }}
                  >
                    {currentTime}
                  </Typography>
                  <Typography
                    sx={{ fontSize: "20px", color: colors.primary.main }}
                  >
                    Employees
                  </Typography>
                </Box>
                {/* Description with primary text color */}
                <Typography
                  sx={{
                    color: colors.text.primary1,
                    flex: 1,
                    fontSize: "14px",
                  }}
                >
                  Dedicated professionals who perform specific tasks for
                  compensation under the direction of an employer.{" "}
                </Typography>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: colors.primary.main,
                    color: colors.text.white,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                >
                  20
                </Box>
              </CardContent>
            </Card>

            {/* HR Department Card */}
            <Card
              onClick={() => navigate("/accountant/hrData")}
              sx={{
                height: 60,
                display: "flex",
                alignItems: "center",
                pt: 1,
                cursor: "pointer",
                transition: "0.3s",
                backgroundColor: colors.background.card,
                border: `1px solid ${colors.border.light}`,
                "&:hover": {
                  boxShadow: 6,
                  transform: "scale(1.02)",
                  backgroundColor: colors.primary.lighter,
                },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    borderRadius: "10px",
                    backgroundColor: colors.primary.main,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 70,
                    height: 50,
                  }}
                >
                  <AssignmentInd
                    sx={{ color: colors.text.white, height: 75, width: 40 }}
                  />
                </Box>
                <Box
                  sx={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    pr: 0,
                    gap: 1.5,
                    minWidth: 120,
                  }}
                >
                  <Typography
                    sx={{ fontSize: "10px", color: colors.text.secondary }}
                  >
                    {currentTime}
                  </Typography>
                  <Typography
                    sx={{ fontSize: "20px", color: colors.primary.main }}
                  >
                    HR Department
                  </Typography>
                </Box>
                {/* Description with primary text color */}
                <Typography
                  sx={{
                    color: colors.text.primary1,
                    flex: 1,
                    fontSize: "14px",
                  }}
                >
                  The HR department is in charge of a company's staff, handling
                  things like hiring, paying, and training.{" "}
                </Typography>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: colors.primary.main,
                    color: colors.text.white,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                >
                  15
                </Box>
              </CardContent>
            </Card>

            {/* Share Holders Card */}
            <Card
              onClick={() => {
                setShowInfo(true);
                setTimeout(() => setShowInfo(false), 1500);
              }}
              sx={{
                height: 60,
                display: "flex",
                alignItems: "center",
                pt: 1,
                cursor: "pointer",
                transition: "0.3s",
                backgroundColor: colors.background.card,
                border: `1px solid ${colors.border.light}`,
                "&:hover": {
                  boxShadow: 6,
                  transform: "scale(1.02)",
                  backgroundColor: colors.primary.lighter,
                },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    borderRadius: "10px",
                    backgroundColor: colors.primary.main,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 70,
                    height: 50,
                  }}
                >
                  <CorporateFare
                    sx={{ color: colors.text.white, height: 75, width: 40 }}
                  />
                </Box>
                <Box
                  sx={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    pr: 3,
                    gap: 1.5,
                    minWidth: 120,
                  }}
                >
                  <Typography
                    sx={{ fontSize: "10px", color: colors.text.secondary }}
                  >
                    {currentTime}
                  </Typography>
                  <Typography
                    sx={{ fontSize: "20px", color: colors.primary.main }}
                  >
                    Share Holders
                  </Typography>
                </Box>

                {/* Description with primary text color */}
                <Typography
                  sx={{
                    color: colors.text.primary1,
                    flex: 1,
                    fontSize: "14px",
                  }}
                >
                  A shareholder is a partial owner of a company who holds shares
                  of its stock.{" "}
                </Typography>
                {showInfo && (
                  <Typography
                    sx={{ color: colors.status.error, fontSize: "12px", ml: 1 }}
                  >
                    Info: Under progress...
                  </Typography>
                )}
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: colors.primary.main,
                    color: colors.text.white,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "bold",
                    fontSize: "18px",
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
            backgroundColor: colors.background.white,
            borderRadius: 3,
            boxShadow: 2,
            p: 2,
            border: `1px solid ${colors.border.light}`,
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
