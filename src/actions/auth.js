import { SET_AUTH_USER, RESET_AUTH_STATE } from "types";

import * as api from "api";
export const register = (registerFormData) => {
  return api.register({ ...registerFormData }).then(
    (_) => {
      return true;
    },
    (errorMessage) => Promise.reject(errorMessage)
  );
};

export const login = (loginData) => {
  return api.login({ ...loginData });
};
export const logout = (uid) => (dispatch) =>
  api
    .logout()
    .then((_) => {
      const userStatusDatabaseRef = api.createFirebaseRef("status", uid);
      return userStatusDatabaseRef.set(api.isOfflineForDatabase);
    })
    .then((_) => dispatch({ user: null, type: SET_AUTH_USER }));
export const onAuthStateChanged = (onAuthCallback) =>
  api.onAuthStateChanged(onAuthCallback);

export const storeAuthUser = (authUser) => (dispatch) => {
  if (authUser) {
    // debugger;
    return api.getUserProfile(authUser.uid).then((userWithProfile) => {
      // Dispatch action to change auth state!
      // debugger;
      dispatch({ user: userWithProfile, type: SET_AUTH_USER });
    });
  } else {
    // Dispatch action
    return dispatch({ user: null, type: SET_AUTH_USER });
  }
};

export const resetAuthState = () => ({ type: RESET_AUTH_STATE });
//Auth ends
