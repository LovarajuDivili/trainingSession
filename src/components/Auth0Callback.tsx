import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Auth0Callback = () => {
  const { isAuthenticated, isLoading, getIdTokenClaims } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const exchangeToken = async () => {
      if (!isAuthenticated) return;

      const claims = await getIdTokenClaims();
      if (!claims) return;

      const response = await axios.post(
        "http://localhost:8000/v-1/application/auth/sso-login",
        {
          id_token: claims.__raw, // ✅ REAL Auth0 token
        }
      );

      const { access_token, user } = response.data;

      sessionStorage.setItem("token", access_token);
      sessionStorage.setItem("user", JSON.stringify(user));
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${access_token}`;

      navigate("/welcome", { replace: true });
    };

    if (!isLoading) {
      exchangeToken();
    }
  }, [isAuthenticated, isLoading]);

  return <p>Signing you in...</p>;
};

export default Auth0Callback;
