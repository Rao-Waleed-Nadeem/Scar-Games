import api from "../utils/api";
import { setUser, setLoading, setUserLoggedIn } from "./userSlice";

// Register a new user
const registerUser = (formData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const data = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    };

    const response = await api.post("/users/signup", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Frontend response: ");
    console.log(response.data);

    const { user, accessToken } = response.data;
    sessionStorage.setItem("accessToken", accessToken);
    dispatch(setUser(user));
    dispatch(setUserLoggedIn(true)); // Set userLoggedIn to true after successful registration
  } catch (error) {
    console.error(
      "Error registering user:",
      error.response?.data || error.message,
    );
  } finally {
    dispatch(setLoading(false));
  }
};

// Login a user
const loginUser = (formData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    // Check if already logged in
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      console.warn("User is already logged in.");
      dispatch(setLoading(false));
      return; // Stop login if already logged in
    }

    const data = {
      email: formData.email,
      password: formData.password,
    };

    const response = await api.post("/users/login", data);

    const { user, accessToken } = response.data;
    sessionStorage.setItem("accessToken", accessToken);
    dispatch(setUser(user));
    dispatch(setUserLoggedIn(true)); // Set userLoggedIn to true after successful login
  } catch (error) {
    console.error("Error logging in:", error.response?.data || error.message);
  } finally {
    dispatch(setLoading(false));
  }
};

// Fetch the current user
const currentUser = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const token = sessionStorage.getItem("accessToken");

    if (!token) {
      dispatch(setUser(null));
      dispatch(setUserLoggedIn(false)); // Set userLoggedIn to false if no token
      dispatch(setLoading(false));
      return;
    }

    const response = await api.get("/users/current-user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch(setUser(response.data.user));
    dispatch(setUserLoggedIn(true)); // Set userLoggedIn to true if user data exists
  } catch (error) {
    console.error(
      "Error fetching current user:",
      error.response?.data || error.message,
    );
    dispatch(setUser(null));
    dispatch(setUserLoggedIn(false)); // Set userLoggedIn to false on error
  } finally {
    dispatch(setLoading(false));
  }
};

// Logout the user
const logoutUser = (navigate) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    // Check if not logged in
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
      console.warn("User is already logged out.");
      dispatch(setLoading(false));
      return; // Stop logout if not logged in
    }

    await api.post("/users/logout");

    sessionStorage.removeItem("accessToken");
    dispatch(setUser(null));
    dispatch(setUserLoggedIn(false)); // Set userLoggedIn to false after logout
    if (navigate) navigate("/");
  } catch (error) {
    console.error("Error logging out:", error.response?.data || error.message);
  } finally {
    dispatch(setLoading(false));
  }
};

// Reset user manually
const resetUser = () => (dispatch) => {
  dispatch(setUser(null));
  dispatch(setUserLoggedIn(false)); // Reset userLoggedIn state
  sessionStorage.removeItem("accessToken");
};

export { registerUser, loginUser, currentUser, logoutUser, resetUser };
