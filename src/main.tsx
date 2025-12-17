import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/Store";
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-sgb766u7iiiyynso.us.auth0.com"
      clientId="R62vdR1mCDYZW3c1SuV0RbZflEFdpqtQ"
      authorizationParams={{
        redirect_uri: "http://localhost:5173/callback",
        audience: "https://api.sasa.com",
        scope: "openid profile email",
      }}
    >
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </Auth0Provider>
  </React.StrictMode>
);
