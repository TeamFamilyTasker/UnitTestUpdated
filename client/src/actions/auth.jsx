import { fetchNoToken, fetchWithToken } from "../helpers/fetch";
import types from "../types";
import Swal from "sweetalert2";
import { removeError, setError } from "./ui";
import { eventLogout } from "./event";

export const startLogin = (email, password) => {
  return async (dispatch) => {
    fetchNoToken("auth/login", { email, password }, "POST")
      .then((resp) => resp.json())
      .then((data) => {
        if (data.ok) {
          const { user, token } = data;
          const { _id: id, name, role } = user; // Include role here

          localStorage.setItem("token", token);
          localStorage.setItem("token-init-date", new Date().getTime());

          dispatch(login({ id, name, role })); // Pass role to login
        } else {
          if (data.errors) dispatch(checkingErrors(data.errors));
          if (data.msg) Swal.fire("Error", data.msg, "error");
        }
      })
      .catch((err) => {
        console.log(err);
        Swal.fire("Error", "Please, contact the administrator", "error");
      });
  };
};

export const startRegister = (name, email, password, familyName, roleInFamily, familyId) => {
  return async (dispatch) => {
    const requestBody = {
      name,
      email,
      password,
      familyName,
      roleInFamily,
      ...(familyId && { familyId }), // Conditionally add familyId if it exists
    };

    fetchNoToken("auth/register", requestBody, "POST")
      .then((resp) => resp.json())
      .then((data) => {
        if (data.ok) {
          const { user, token, familyId: newFamilyId } = data; // Extract newFamilyId from data
          const { _id: id, name } = user;

          localStorage.setItem("token", token);
          localStorage.setItem("token-init-date", new Date().getTime());

          dispatch(login({ id, name}));
          const alertFamilyId = newFamilyId || familyId;
        
          if(familyId){
            Swal.fire("Success", `Your family ID is ${familyId}`, "success");
          }
          if(!familyId){
              Swal.fire("Success", `Your family ID is ${alertFamilyId}`, "success");
          }
        } else {
          if (data.errors) dispatch(checkingErrors(data.errors));
          if (data.msg) Swal.fire("Error", data.msg, "error");
        }
      })
      .catch((err) => {
        console.log(err);
        Swal.fire("Error", "Please, contact the administrator", "error");
      });
  };
};


export const checkingErrors = (errors) => {
  return (dispatch) => {
    const { msg } = errors[Object.keys(errors)[0]];
    dispatch(setError(msg));
  };
};

export const startChecking = () => {
  return async (dispatch) => {
    fetchWithToken("auth/renew")
      .then((resp) => resp.json())
      .then((data) => {
        if (data.ok) {
          const { user, token } = data;
          const { _id: id, name } = user; // Include role

          localStorage.setItem("token", token);
          localStorage.setItem("token-init-date", new Date().getTime());

          dispatch(login({ id, name })); // Dispatch role
        }
      })
      .catch((err) => {
        console.log(err);
        Swal.fire("Error", "Please, contact the administrator", "error");
      })
      .finally(() => {
        dispatch(checkingFinish());
      });
  };
};

const checkingFinish = () => ({
  type: types.authCheckingFinish,
});

const login = (user) => ({
  type: types.authLogin,
  payload: user,
});

export const startLogout = () => {
  return (dispatch) => {
    localStorage.clear();
    dispatch(removeError());
    dispatch(eventLogout());
    dispatch(logout());
  };
};

export const logout = () => ({
  type: types.authLogout,
});
