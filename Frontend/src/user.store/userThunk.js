import api from "../utils/api";
import { setUser, setLoading, setUserLoggedIn } from "./userSlice";

const requestSignupOTP = (formData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const data = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    };

    const response = await api.post("/auth/signup", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return {
      success: true,
      status: response.status,
      message: response.data.message || "Verification code sent.",
      email: response.data.email,
      expiresIn: response.data.expiresIn,
    };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status,
      message: error.response?.data?.message || "Something went wrong.",
    };
  } finally {
    dispatch(setLoading(false));
  }
};

const verifySignupOTP =
  ({ email, otp }) =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));

      const response = await api.post(
        "/auth/verify",
        { email, otp },
        { headers: { "Content-Type": "application/json" } },
      );

      const { token, user } = response.data;

      sessionStorage.setItem("accessToken", token);
      dispatch(setUser(user));
      dispatch(setUserLoggedIn(true));

      return {
        success: true,
        status: response.status,
        message: "OTP verified.",
        token,
        user,
      };
    } catch (error) {
      return {
        success: false,
        status: error.response?.status,
        message: error.response?.data?.message || "OTP verification failed.",
      };
    } finally {
      dispatch(setLoading(false));
    }
  };

const resendSignupOTP =
  ({ email }) =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));

      const response = await api.post(
        "/auth/resend",
        { email },
        { headers: { "Content-Type": "application/json" } },
      );

      return {
        success: true,
        status: response.status,
        message: response.data.message || "New verification code sent.",
      };
    } catch (error) {
      return {
        success: false,
        status: error.response?.status,
        message: error.response?.data?.message || "Failed to resend code.",
      };
    } finally {
      dispatch(setLoading(false));
    }
  };

const loginUser = (formData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const token = sessionStorage.getItem("accessToken");
    if (token) {
      return {
        success: false,
        status: 409,
        message: "You are already logged in.",
      };
    }

    const data = {
      identifier: formData.identifier,
      password: formData.password,
    };

    const response = await api.post("/users/login", data);

    const { user, accessToken } = response.data;
    sessionStorage.setItem("accessToken", accessToken);
    dispatch(setUser(user));
    dispatch(setUserLoggedIn(true));

    return {
      success: true,
      status: 200,
      message: response.data.message || "Login successful.",
    };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status,
      message: error.response?.data?.message || "Something went wrong.",
    };
  } finally {
    dispatch(setLoading(false));
  }
};

const currentUser = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const token = sessionStorage.getItem("accessToken");

    if (!token) {
      dispatch(setUser(null));
      dispatch(setUserLoggedIn(false));
      dispatch(setLoading(false));
      return;
    }

    const response = await api.get("/users/current-user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch(setUser(response.data.user));
    dispatch(setUserLoggedIn(true));
  } catch {
    dispatch(setUser(null));
    dispatch(setUserLoggedIn(false));
  } finally {
    dispatch(setLoading(false));
  }
};

const logoutUser = (navigate) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const token = sessionStorage.getItem("accessToken");
    if (!token) {
      dispatch(setLoading(false));
      return;
    }

    await api.post("/users/logout");

    sessionStorage.removeItem("accessToken");
    dispatch(setUser(null));
    dispatch(setUserLoggedIn(false));
    if (navigate) navigate("/");
  } catch (error) {
    console.error("Error logging out:", error.response?.data || error.message);
  } finally {
    dispatch(setLoading(false));
  }
};

const resetUser = () => (dispatch) => {
  dispatch(setUser(null));
  dispatch(setUserLoggedIn(false));
  sessionStorage.removeItem("accessToken");
};

export {
  requestSignupOTP,
  verifySignupOTP,
  resendSignupOTP,
  loginUser,
  currentUser,
  logoutUser,
  resetUser,
};
