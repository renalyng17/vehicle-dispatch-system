
  import axios from "axios";

export const refreshToken = async () => {
  try {
    const res = await axios.post(
      import.meta.env.VITE_API_BASE_URL
        ? `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`
        : "http://localhost:3001/api/auth/refresh",
      {},
      { withCredentials: true } // ✅ send refresh token cookie
    );

    return res.data?.accessToken; // return new token
  } catch (err) {
    console.error("Error refreshing token:", err);
    throw err;
  }
};
