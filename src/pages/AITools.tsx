import { Box, Typography, Paper } from "@mui/material";
import Header from "../components/Header";
import PsychologyIcon from "@mui/icons-material/Psychology";

const cardWrapper = {
  position: "relative",
  width: 260,
  textAlign: "center",
  marginTop: "70px",
};

const iconStyle = {
  position: "absolute",
  top: "-100px",
  left: "50%",
  transform: "translateX(-50%)",
  width: 56,
  height: 56,
  borderRadius: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 28,
  color: "#fff",
  background:
    "linear-gradient(145deg, rgba(167,139,250,1), rgba(124,90,245,1))",
  boxShadow: "0 8px 18px rgba(167,139,250,0.6)",
  zIndex: 2,
};

const lineStyle = {
  position: "absolute",
  top: "-47px",
  left: "50%",
  transform: "translateX(-50%)",
  width: "1px",
  height: "40px",
  backgroundColor: "rgba(255, 255, 255, 0.3)",
  zIndex: 1,
};

const cardStyle = {
  minHeight: 150,

  bgcolor: "rgba(70,50,150,0.55)",
  borderRadius: "38px",
  p: 3,
  border: "1px solid rgba(255,255,255,0.15)",
  color: "#fff",
  backdropFilter: "blur(6px)",
  cursor: "pointer",
  transition: "0.25s ease",

  "&:hover": {
    transform: "translateY(-6px) scale(1.02)",
    boxShadow: "0 16px 30px rgba(0,0,0,0.35)",
    borderColor: "#a78bfa",
  },
};

const cardsData = [
  {
    title: "Gen AI",
    desc: "Increase productivity with the safe, customizable Cerebro Generative AI Platform",
    icon: "🤖",
    link: "https://www.aifalabs.com/cerebro",
    y: 0,
  },
  {
    title: "SAP",
    desc: "Modernize your SAP operations with SASA, a fast, secure AI solution",
    icon: "⚙️",
    link: "https://www.aifalabs.com/sap",
    y: 80,
  },
  {
    title: "Agentic AI",
    desc: "Build intelligent agents with AIOps to automate and optimize business processes",
    icon: "🧠",
    link: "https://www.aifalabs.com/agentic-ai",
    y: 0,
  },
  {
    title: "Edge AI Vision",
    desc: "Boost efficiency and security with ViSRUPT and our innovative AI cameras",
    icon: "👁️",
    link: "https://www.aifalabs.com/edge-ai-computer-vision",
    y: 80,
  },

  {
    title: "Prompt Engineer",
    desc: "Prompt engineering is optimizing AI inputs for better outputs.",
    icon: <PsychologyIcon/>,
    link: "https://www.aifalabs.com/become-a-prompt-engineer",
    y: 80,
  },
  {
    title: "Edge AI Vision",
    desc: "Boost efficiency and security with ViSRUPT and our innovative AI cameras",
    icon: "👁️",
    link: "https://www.aifalabs.com/edge-ai-computer-vision",
    y: 160,
  },
  {
    title: "Edge AI Vision",
    desc: "Boost efficiency and security with ViSRUPT and our innovative AI cameras",
    icon: "👁️",
    link: "https://www.aifalabs.com/edge-ai-computer-vision",
    y: 80,
  },
  {
    title: "Edge AI Vision",
    desc: "Boost efficiency and security with ViSRUPT and our innovative AI cameras",
    icon: "👁️",
    link: "https://www.aifalabs.com/edge-ai-computer-vision",
    y: 160,
  },
];

const AITools = () => {
  const handleCardClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <Header role={""} />

      <Box
        sx={{
          minHeight: "140vh",
          width: "95%",
          backgroundImage: `
    linear-gradient(
    180deg,
    rgba(0,0,0,0.6) 0%,
    rgba(0,0,0,0.4) 50%,
    rgba(0,0,0,0.6) 100%
  ),
  linear-gradient(
    180deg,
    rgba(144,106,255,0.25) 0%,
    rgba(144,106,255,0.18) 40%,
    rgba(144,106,255,0.25) 100%
  ),
  linear-gradient(
    180deg,
    rgba(144,106,255,0.35) 0%,
    rgba(144,106,255,0.22) 35%,
    rgba(144,106,255,0.35) 100%
  ),
  url("https://images.unsplash.com/photo-1555255707-c07966088b7b")
`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#fff",
          px: 8,
          pt: 10,
        }}
      >
        <Box maxWidth={900} mb={8}>
          <Typography variant="h3" fontWeight={700} mb={2}>
            Empowering Enterprise Transformation with AI at Every Layer
          </Typography>

          <Typography sx={{ color: "rgba(255,255,255,0.85)" }}>
            Bringing the combined power of Generative AI & Edge AI to unlock
            unlimited possibilities with:
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 6,
            flexWrap: "wrap",
          }}
        >
          {cardsData.map((card, index) => (
            <Box
              key={index}
              onClick={() => handleCardClick(card.link)}
              sx={{
                transform: `translateY(${card.y}px)`,
              }}
            >
              <Box sx={cardWrapper}>
                <Box sx={iconStyle}>{card.icon}</Box>

                <Box sx={lineStyle} />

                <Paper elevation={0} sx={cardStyle}>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    textAlign="center"
                    mb={1}
                  >
                    {card.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    textAlign="center"
                    sx={{ color: "rgba(255,255,255,0.85)" }}
                  >
                    {card.desc}
                  </Typography>
                </Paper>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default AITools;
