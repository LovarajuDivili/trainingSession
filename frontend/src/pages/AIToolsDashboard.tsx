
import React from "react";
import { Box, Typography } from "@mui/material";
import Header from "../components/Header";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import BoltIcon from "@mui/icons-material/Bolt";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SecurityIcon from "@mui/icons-material/Security";

const itemsTop = [
  {
    title: "Gen AI",
    text:
      "Increase productivity with the safe, customizable Cerebro Generative AI Platform",
    icon: <AutoAwesomeIcon fontSize="large" />,
    link: "https://www.aifalabs.com/cerebro",
  },
  {
    title: "SAP",
    text: "Modernize your SAP operations with SASA, a fast, secure AI solution",
    icon: <BoltIcon fontSize="large" />,
    link: "https://www.aifalabs.com/sap",
  },
  {
    title: "Agentic AI",
    text:
      "Build intelligent agents with AIOps to automate and optimize business processes",
    icon: <PeopleAltIcon fontSize="large" />,
    link: "https://www.aifalabs.com/agentic-ai",
  },
  {
    title: "Edge AI Vision",
    text:
      "Boost efficiency and security with ViSRUPT and our innovative AI cameras",
    icon: <SecurityIcon fontSize="large" />,
    link: "https://www.aifalabs.com/edge-ai-computer-vision",
  },
];

const itemsBottom = [
  {
    title: "Prompt Engineer",
    text: "Prompt engineering is optimizing AI inputs for better outputs",
    icon: <AutoAwesomeIcon fontSize="large" />,
    link: "https://www.aifalabs.com/become-a-prompt-engineer",
  },
  {
    title: "Edge AI Vision",
    text:
      "Boost efficiency and security with ViSRUPT and our innovative AI cameras",
    icon: <SecurityIcon fontSize="large" />,
    link: "https://www.aifalabs.com/edge-ai-computer-vision",
  },
  {
    title: "SAP",
    text: "Modernize your SAP operations with SASA, a fast, secure AI solution",
    icon: <BoltIcon fontSize="large" />,
    link: "https://www.aifalabs.com/sap",
  },
  {
    title: "Agentic AI",
    text:
      "Build intelligent agents with AIOps to automate and optimize business processes",
    icon: <PeopleAltIcon fontSize="large" />,
    link: "https://www.aifalabs.com/agentic-ai",
  },  
];

const AIToolsDashboard: React.FC = () => {
  const renderRow = (items: typeof itemsTop, delayOffset = 0) => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 4,
        flexWrap: "nowrap",
      }}
    >
      {items.map((item, index) => (
        <Box
          key={item.title + index}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            animation: "floatCard 10s ease-in-out infinite",
            animationDelay: `${delayOffset + index * 1.5}s`,
            "@keyframes floatCard": {
              "0%": { transform: "translateY(0px)" },
              "50%": { transform: "translateY(-12px)" },
              "100%": { transform: "translateY(0px)" },
            },
          }}
        >
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: 2,
              backgroundColor: "#906aff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              mb: 1,
              boxShadow: "0 0 16px rgba(144,106,255,0.8)",
            }}
          >
            {item.icon}
          </Box>

          <Box
            sx={{
              width: 2,
              height: 28,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0))",
              mb: 1,
            }}
          />

          <Box
            onClick={() => window.open(item.link, "_blank")}
            sx={{
              width: 220,
              height: 120,
              p: 3,
              borderRadius: 3,
              backgroundColor: "#906aff",
              color: "#fff",
              textAlign: "left",
              backdropFilter: "blur(6px)",
              display: "flex",
              flexDirection: "column",
              cursor: "pointer",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "scale(1.04)",
                boxShadow: "0 12px 30px rgba(144,106,255,0.6)",
              },
            }}
          >
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              {item.title}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
              }}
            >
              {item.text}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );

  return (
    <Box sx={{ width: "100%", overflowX: "hidden" }}>
      <Header onMenuClick={() => {}} />

      <Box sx={{ position: "relative", minHeight: "100vh" }}>

        <Box
          sx={{
            position: "fixed",
            inset: 0,
            backgroundImage: "url('/images/ai-tools-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <Box
          sx={{
            position: "fixed",
            inset: 0,
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(10,10,40,0.55)",
          }}
        />

        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            pt: 14,
            pb: 10,
            px: { xs: "5%", md: "8%" },
            color: "#fff",
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 600, mb: 1 }}>
            Empowering Enterprise Transformation with AI at Every Layer
          </Typography>

          <Typography sx={{ opacity: 0.9, mb: 8 }}>
            Bringing the combined power of Generative AI & Edge AI to unlock
            unlimited possibilities.
          </Typography>

          {renderRow(itemsTop, 0)}

          <Box sx={{ height: 200 }} />

          {renderRow(itemsBottom, 0.8)}
        </Box>
      </Box>
    </Box>
  );
};

export default AIToolsDashboard;

