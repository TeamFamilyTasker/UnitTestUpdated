import types from "../types";

const initialState = {
  users: [],
  events: [],
  loadingUsers: false,
  loadingEvents: false,
  error: null,
};

export const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.adminLoadUsers:
      return {
        ...state,
        users: [...action.payload],
        loadingUsers: false,
      };
    case types.adminLoadEvents:
      return {
        ...state,
        events: [...action.payload],
        loadingEvents: false,
      };
    case types.adminLoadingUsers:
      return {
        ...state,
        loadingUsers: true,
        error: null,
      };
    case types.adminLoadingEvents:
      return {
        ...state,
        loadingEvents: true,
        error: null,
      };
    case types.adminLoadFail:
      return {
        ...state,
        loadingUsers: false,
        loadingEvents: false,
        error: action.payload,
      };
    case types.adminLogout:
      return initialState;
    default:
      return state;
  }
};