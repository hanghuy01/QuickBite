import axios from "axios";

export const refreshTokenApi = async (refresh_token: string) => {
  const res = await axios.post(
    `${process.env.EXPO_PUBLIC_API_URL}/auth/refresh-token`,
    { refresh_token },
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};
