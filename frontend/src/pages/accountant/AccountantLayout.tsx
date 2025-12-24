import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Box, Container } from "@mui/material";
import Header from "../../components/Header";
import CartDialog from "../../components/CartDialog";

const AccountantLayout: React.FC = () => {
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const openHandler = () => {
      console.log("AccountantLayout → openCart event received");
      setCartOpen(true);
    };

    window.addEventListener("openCart", openHandler);

    return () => {
      window.removeEventListener("openCart", openHandler);
    };
  }, []);

  return (
    <>
      <Header />

      <Box
        sx={{
          bgcolor: "#f5f7fb",
          minHeight: "100vh",
          pt: "80px",
          pb: 4,
        }}
      >
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>

      <CartDialog
        open={cartOpen}
        onClose={() => setCartOpen(false)}    />
    </>
  );
};

export default AccountantLayout;

