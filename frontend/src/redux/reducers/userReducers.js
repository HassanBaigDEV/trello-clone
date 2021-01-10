import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_EMAIL_CONFIRM_REQUEST,
  USER_EMAIL_CONFIRM_SUCCESS,
  USER_EMAIL_CONFIRM_FAIL,
  USER_EMAIL_RESEND_REQUEST,
  USER_EMAIL_RESEND_SUCCESS,
  USER_EMAIL_RESEND_FAIL,
} from '../constants/userConstants';

export const userLoginReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { loading: true };
    case USER_LOGIN_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case USER_LOGIN_FAIL:
      return { loading: false, error: action.payload };
    case USER_LOGOUT:
      return {};
    default:
      return state;
  }
};

export const userRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_REGISTER_REQUEST:
      return { loading: true };
    case USER_REGISTER_SUCCESS:
      return { loading: false, success: action.payload };
    case USER_REGISTER_FAIL:
      return { loading: false, error: action.payload };
    case USER_LOGOUT:
      return { userInfo: null };
    default:
      return state;
  }
};

export const userEmailConfirmReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_EMAIL_CONFIRM_REQUEST:
      return { loading: true };
    case USER_EMAIL_CONFIRM_SUCCESS:
      return { loading: false, success: action.payload };
    case USER_EMAIL_CONFIRM_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userEmailResendReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_EMAIL_RESEND_REQUEST:
      return { loading: true };
    case USER_EMAIL_RESEND_SUCCESS:
      return { loading: false, success: action.payload };
    case USER_EMAIL_RESEND_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};