
export const getAuthUser = () => {
  try {
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
}

export const isAdmin = () => {
  const user = getAuthUser();
  return user?.user_type === 'admin';
};

export const isClient = () => {
  const user = getAuthUser();
  return user?.user_type === 'client';
};

export const refreshToken = async () => {
  try {
    const response = await fetch("http://localhost:3001/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) throw new Error("Refresh token failed");

    const data = await response.json();
    const token = data.token;

    if (token) {
      localStorage.setItem("token", token); // or sessionStorage if preferred
      return token;
    }

    return null;
  } catch (error) {
    console.error("Refresh token error:", error);
    return null;
  }
};