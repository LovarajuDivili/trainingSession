import { useEffect, useState, useRef } from "react";
import { Box, Typography, IconButton, Paper } from "@mui/material";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthScrollRef = useRef<HTMLDivElement | null>(null);
  const datesScrollRef = useRef<HTMLDivElement | null>(null);

  // Get actual days in the current month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return Array.from({ length: daysInMonth }).map((_, i) => {
      const d = new Date(year, month, i + 1);
      return d;
    });
  };

  const [monthDays, setMonthDays] = useState<Date[]>(
    getDaysInMonth(currentDate)
  );

  // Update days when month changes
  useEffect(() => {
    setMonthDays(getDaysInMonth(currentDate));
  }, [currentDate]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Auto-scroll to active month
  useEffect(() => {
    if (monthScrollRef.current) {
      const activeMonth = document.getElementById(
        `month-${currentDate.getMonth()}`
      );
      if (activeMonth && monthScrollRef.current) {
        const scrollContainer = monthScrollRef.current;
        const monthOffset = activeMonth.offsetLeft;
        const containerWidth = scrollContainer.offsetWidth;

        scrollContainer.scrollTo({
          left: monthOffset - containerWidth / 2 + activeMonth.offsetWidth / 2,
          behavior: "smooth",
        });
      }
    }
  }, [currentDate]);

  // Auto-scroll to current date in dates container
  useEffect(() => {
    if (datesScrollRef.current) {
      const today = new Date();
      if (
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear()
      ) {
        const todayElement = document.getElementById(`date-${today.getDate()}`);
        if (todayElement && datesScrollRef.current) {
          const scrollContainer = datesScrollRef.current;
          const dateOffset = todayElement.offsetLeft;
          const containerWidth = scrollContainer.offsetWidth;

          scrollContainer.scrollTo({
            left:
              dateOffset - containerWidth / 2 + todayElement.offsetWidth / 2,
            behavior: "smooth",
          });
        }
      } else {
        // Scroll to first day of the month
        datesScrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
      }
    }
  }, [monthDays]);

  const handlePrevMonth = () => {
    if (monthScrollRef.current) {
      monthScrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const handleNextMonth = () => {
    if (monthScrollRef.current) {
      monthScrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  // Handle date click - update current date and month highlight
  const handleDateClick = (date: Date) => {
    setCurrentDate(date);
  };

  // Handle wheel scroll for dates
  const handleWheel = (e: React.WheelEvent) => {
    if (datesScrollRef.current) {
      e.preventDefault();
      datesScrollRef.current.scrollLeft += e.deltaY;
    }
  };

  const today = new Date();

  return (
    <Box sx={{ mt: 2, px: 2 }}>
      {/* Month Scroll with Arrows */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <IconButton onClick={handlePrevMonth} size="small">
          <ArrowBackIosNew fontSize="small" />
        </IconButton>

        <Box
          ref={monthScrollRef}
          sx={{
            display: "flex",
            overflowX: "auto",
            whiteSpace: "nowrap",
            width: "400px",
            justifyContent: "flex-start",

            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          {months.map((month, index) => (
            <Typography
              key={month}
              id={`month-${index}`}
              variant="subtitle1"
              sx={{
                color:
                  index === currentDate.getMonth()
                    ? "#906aff"
                    : "rgba(0,0,0,0.4)",
                fontWeight: index === currentDate.getMonth() ? 700 : 400,
                mx: 2,
                flexShrink: 0,
                transition: "color 0.3s ease",
                cursor: "pointer",
                "&:hover": { color: "#906aff" },
                minWidth: "80px",
                textAlign: "center",
              }}
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setMonth(index);
                setCurrentDate(newDate);
              }}
            >
              {month}
            </Typography>
          ))}
        </Box>

        <IconButton onClick={handleNextMonth} size="small">
          <ArrowForwardIos fontSize="small" />
        </IconButton>
      </Box>

      {/* Scrollable Dates Container - Actual month days */}
      <Box
        ref={datesScrollRef}
        onWheel={handleWheel}
        sx={{
          display: "flex",

          overflowX: "auto",
          scrollBehavior: "smooth",
          gap: 2,
          px: 1,
          py: 2,
          cursor: "grab",
          "&:active": { cursor: "grabbing" },
          // Custom scrollbar
          "&::-webkit-scrollbar": {
            height: 6,
          },
          "&::-webkit-scrollbar-track": {
            background: "rgba(0,0,0,0.05)",
            borderRadius: 3,
            marginLeft: 50,
            marginRight: 50,
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(0,0,0,0.2)",
            borderRadius: 3,
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "rgba(0,0,0,0.3)",
          },
        }}
      >
        {monthDays.map((day) => {
          const isToday =
            day.getDate() === today.getDate() &&
            day.getMonth() === today.getMonth() &&
            day.getFullYear() === today.getFullYear();

          const isCurrentMonth = day.getMonth() === currentDate.getMonth();

          return (
            <Paper
              key={day.getDate()}
              id={`date-${day.getDate()}`}
              elevation={0}
              sx={{
                width: 70,
                height: 70,
                borderRadius: 4,
                backgroundColor: isToday ? "#906aff" : "#fff",
                color: isToday
                  ? "#fff"
                  : isCurrentMonth
                  ? "#000"
                  : "rgba(0,0,0,0.4)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                
                flexShrink: 0,
                transition: "all 0.3s ease",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
                },
                border: isCurrentMonth ? "none" : "1px dashed rgba(0,0,0,0.2)",
              }}
              onClick={() => handleDateClick(day)}
            >
              <Typography variant="h6" fontWeight={600}>
                {day.getDate()}
              </Typography>
              <Typography
                variant="body2"
                sx={{ opacity: isCurrentMonth ? 0.8 : 0.5 }}
              >
                {day.toLocaleString("en-US", { weekday: "short" })}
              </Typography>
              {!isCurrentMonth && (
                <Typography variant="caption" sx={{ opacity: 0.6, mt: 0.5 }}>
                  {day.toLocaleString("en-US", { month: "short" })}
                </Typography>
              )}
            </Paper>
          );
        })}
      </Box>

      
    </Box>
  );
};

export default Calendar;
