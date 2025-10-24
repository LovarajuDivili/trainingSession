import { Box, Typography } from "@mui/material";

interface NoDataProps {
  imageSrc: string;
  altText?: string;
  message: string;
}

const NoData = ({ imageSrc, altText = "No data", message }: NoDataProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        mt: 4,
      }}
    >
      <Box
        component="img"
        src={imageSrc}
        alt={altText}
        sx={{
          width: 150,
          height: 150,
          opacity: 0.7,
          mb: 2,
        }}
      />
      <Typography variant="h6" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

export default NoData;
