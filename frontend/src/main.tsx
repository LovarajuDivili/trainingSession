import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App.jsx";
import { UserProvider } from "./components/UserContext";
import { CartProvider } from "./context/CartContext";

createRoot(document.getElementById("root")!).render(
<UserProvider>
  <CartProvider>
    <App />
  </CartProvider>
</UserProvider>
);
