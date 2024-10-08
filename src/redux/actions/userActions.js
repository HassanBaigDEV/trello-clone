import {
  USER_EMAIL_CONFIRM_FAIL,
  USER_EMAIL_CONFIRM_REQUEST,
  USER_EMAIL_CONFIRM_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_EMAIL_RESEND_REQUEST,
  USER_EMAIL_RESEND_SUCCESS,
  USER_EMAIL_RESEND_FAIL,
  USER_NOTIFICATIONS_UPDATE,
  USER_PICTURE_UPDATE_REQUEST,
  USER_PICTURE_UPDATE_SUCCESS,
  USER_PICTURE_UPDATE_FAIL,
  USER_DATA_UPDATE,
  USER_PROJECT_BG_UPDATE_FAIL,
  USER_PROJECT_BG_UPDATE_SUCCESS,
  USER_PROJECT_BG_UPDATE_REQUEST,
} from "../constants/userConstants";
import {
  SOCKET_CONNECT_RESET,
  SOCKET_CONNECT_SUCCESS,
} from "../constants/socketConstants";
import axios from "axios";
import io from "socket.io-client";

const BASE_URL = process.env.BASE_URL;

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
    };
    const { data } = await axios.post(
      `${BASE_URL}/api/users/login`,
      { email, password },
      config
    );

    // connect to socket server
    const socket = io.connect(BASE_URL, {
      transports: ["websocket", "polling", "flashsocket"],
      auth: {
        authorization: `Bearer ${data.userInfo.token}`,
      },
    });
    console.log("socketsocketsocketsocketsocketsocketsocket", socket);
    socket.on("connect", () => {
      console.log("connect");
      dispatch({ type: SOCKET_CONNECT_SUCCESS, payload: socket });
      dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
      socket.emit("join-notifications", { room: data.userInfo._id });
    });

    localStorage.setItem(
      "userInfo",
      JSON.stringify({ token: data.userInfo.token })
    );
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const register = (username, email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
    };

    console.log("register");

    const response = await fetch(`${BASE_URL}/api/users/register`, {
      method: "POST",
      headers: config.headers,
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      console.log(response);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);

    dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload: error.message || "Registration failed",
    });
  }
};

export const logout = () => async (dispatch, getState) => {
  const {
    socketConnection: { socket },
  } = getState();
  localStorage.removeItem("userInfo");
  dispatch({ type: USER_LOGOUT });
  socket.disconnect();
  dispatch({ type: SOCKET_CONNECT_RESET });
};

export const confirmEmail = (emailCode) => async (dispatch) => {
  try {
    dispatch({ type: USER_EMAIL_CONFIRM_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
    };
    const { data } = await axios.post(
      `${BASE_URL}/api/users/confirm`,
      { emailCode },
      config
    );
    dispatch({ type: USER_EMAIL_CONFIRM_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_EMAIL_CONFIRM_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const resendEmail = (emailCode) => async (dispatch) => {
  try {
    dispatch({ type: USER_EMAIL_RESEND_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
    };
    const { data } = await axios.post(
      `${BASE_URL}/api/users/resend`,
      { emailCode },
      config
    );
    dispatch({ type: USER_EMAIL_RESEND_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_EMAIL_RESEND_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getUserData = (token) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(`${BASE_URL}/api/users`, config);

    const socket = io.connect(BASE_URL, {
      transports: ["websocket", "polling", "flashsocket"],
      auth: {
        authorization: `Bearer ${data.userInfo.token}`,
      },
    });

    console.log("yyyyyyy", socket);
    dispatch({ type: SOCKET_CONNECT_SUCCESS, payload: socket });
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    socket.on("connect", () => {
      console.log("sockettttt");
      socket.emit("join-notifications", { room: data.userInfo._id });
    });
  } catch (error) {
    console.log(error);
    localStorage.removeItem("userInfo");
    dispatch({ type: USER_LOGOUT });
  }
};

export const getUpdatedNotifications = () => async (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState();

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  };
  const { data } = await axios.get(
    `${BASE_URL}/api/users/notifications`,
    config
  );
  dispatch({ type: USER_NOTIFICATIONS_UPDATE, payload: data.notifications });
};

export const discardNotification =
  (notificationId, notificationIndex, callback) =>
  async (dispatch, getState) => {
    const {
      userLogin: { userInfo, notifications },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    notifications.items.splice(notificationIndex, 1);
    dispatch({ type: USER_NOTIFICATIONS_UPDATE, payload: notifications });
    callback();
    await axios.delete(`${BASE_URL}/api/users/${notificationId}`, config);
  };

export const markNotificationsSeen = () => async (dispatch, getState) => {
  const {
    userLogin: { userInfo, notifications },
  } = getState();

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  };
  notifications.newNotificationsCount = 0;
  dispatch({ type: USER_NOTIFICATIONS_UPDATE, payload: notifications });
  await axios.put(`${BASE_URL}/api/users/markNotifications`, {}, config);
};

export const updateProfilePicture =
  (formData) => async (dispatch, getState) => {
    try {
      const {
        userLogin: { userInfo },
      } = getState();
      dispatch({ type: USER_PICTURE_UPDATE_REQUEST });

      const config = {
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.post(
        `${BASE_URL}/api/images/upload`,
        formData,
        config
      );
      if (data.image) {
        const newImg = new Image();
        newImg.src = data.image;
        newImg.onload = () => {
          dispatch({ type: USER_PICTURE_UPDATE_SUCCESS, payload: data.image });
        };
      }
    } catch (error) {
      dispatch({
        type: USER_PICTURE_UPDATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const updateColorTheme = (color, projectId) => (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState();

  if (userInfo.projectsThemes[projectId]) {
    userInfo.projectsThemes[projectId].mainColor = color;
  } else
    userInfo.projectsThemes = {
      ...userInfo.projectsThemes,
      [projectId]: { mainColor: color },
    };
  dispatch({ type: USER_DATA_UPDATE, payload: userInfo });

  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${userInfo.token}`,
    },
  };
  axios.put(
    `${BASE_URL}/api/users/projectColorTheme`,
    { projectId, color },
    config
  );
};

export const uploadProjectBgImage =
  (formData, projectId) => async (dispatch, getState) => {
    try {
      const {
        userLogin: { userInfo },
      } = getState();
      dispatch({ type: USER_PROJECT_BG_UPDATE_REQUEST });

      const config = {
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(
        `${BASE_URL}/api/images/upload/projectBgUpload/${projectId}`,
        formData,
        config
      );

      if (data.image) {
        const newImg = new Image();
        newImg.src = data.image;
        newImg.onload = () => {
          dispatch({
            type: USER_PROJECT_BG_UPDATE_SUCCESS,
            payload: data.image,
          });
        };
      }
    } catch (error) {
      dispatch({
        type: USER_PROJECT_BG_UPDATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
export const updateProjectBgColor =
  (color, projectId) => async (dispatch, getState) => {
    try {
      const {
        userLogin: { userInfo },
      } = getState();
      dispatch({ type: USER_PROJECT_BG_UPDATE_REQUEST });

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put(
        `${BASE_URL}/api/users/projectColorTheme/${projectId}`,
        { color },
        config
      );

      dispatch({ type: USER_PROJECT_BG_UPDATE_SUCCESS, payload: data.color });
    } catch (error) {
      dispatch({
        type: USER_PROJECT_BG_UPDATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
