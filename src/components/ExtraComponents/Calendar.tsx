/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import { useThemeColors } from "../../hooks/useThemeColors";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthScrollRef = useRef<HTMLDivElement | null>(null);
  const datesScrollRef = useRef<HTMLDivElement | null>(null);
  const colors = useThemeColors();

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
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
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
          mb: 2,
        }}
      >
        <IconButton 
          onClick={handlePrevMonth} 
          size="small"
          sx={{
            color: colors.text.secondary,
            '&:hover': {
              backgroundColor: colors.state.hoverLight,
            }
          }}
        >
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
                    ? colors.primary.main
                    : colors.text.secondary,
                fontWeight: index === currentDate.getMonth() ? 700 : 500,
                mx: 2,
                flexShrink: 0,
                transition: "all 0.3s ease",
                cursor: "pointer",
                "&:hover": { 
                  color: colors.primary.main,
                },
                minWidth: "80px",
                textAlign: "center",
                fontSize: "1rem",
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

        <IconButton 
          onClick={handleNextMonth} 
          size="small"
          sx={{
            color: colors.text.secondary,
            '&:hover': {
              backgroundColor: colors.state.hoverLight,
            }
          }}
        >
          <ArrowForwardIos fontSize="small" />
        </IconButton>
      </Box>

      {/* Current Month and Year Display */}
      

      {/* Scrollable Dates Container - Clean design without borders */}
      <Box
        ref={datesScrollRef}
        onWheel={handleWheel}
        sx={{
          display: "flex",
          overflowX: "auto",
          scrollBehavior: "smooth",
          gap: 3,
          px: 1,
          py: 1,
          cursor: "grab",
          "&:active": { cursor: "grabbing" },
          // Hide scrollbar
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
        }}
      >
        {monthDays.map((day) => {
          const isToday =
            day.getDate() === today.getDate() &&
            day.getMonth() === today.getMonth() &&
            day.getFullYear() === today.getFullYear();

          //const isCurrentMonth = day.getMonth() === currentDate.getMonth();

          return (
            <Box
              key={day.getDate()}
              id={`date-${day.getDate()}`}
              sx={{
                width: 60,
                height: 60,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.2s ease",
                cursor: "pointer",
                borderRadius: "50%",
                backgroundColor: isToday ? colors.primary.main : "transparent",
                color: isToday ? colors.text.white : colors.text.secondary,
                "&:hover": {
                  backgroundColor: isToday ? colors.primary.dark : colors.primary.lighter,
                  transform: "scale(1.1)",
                },
              }}
              onClick={() => handleDateClick(day)}
            >
              <Typography 
                variant="h6" 
                fontWeight={isToday ? 700 : 500}
                sx={{
                  fontSize: "1rem",
                  lineHeight: 1,
                }}
              >
                {day.getDate()}
              </Typography>
              <Typography
                variant="caption"
                sx={{ 
                  opacity: 0.8,
                  fontSize: "0.7rem",
                  fontWeight: isToday ? 600 : 400,
                  lineHeight: 1,
                  mt: 0.5,
                }}
              >
                {day.toLocaleString("en-US", { weekday: "short" })}
              </Typography>
            </Box>
          );
        })}
      </Box>
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            color: colors.text.primary,
            fontWeight: 600,
            fontSize: "1.25rem",
          }}
        >
          {currentDate.toLocaleString("en-US", { 
            month: "long", 
            year: "numeric" 
          })}
        </Typography>
      </Box>
    </Box>
  );
};

export default Calendar;