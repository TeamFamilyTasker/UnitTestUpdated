import { fetchWithToken } from "../helpers/fetch"; // Assuming this is the correct path
import types from "../types"; // Assuming this is correctly imported
import Swal from "sweetalert2"; // For displaying alerts

export const startLoadAdminData = () => {
  return async (dispatch) => {
    try {
      // Use the improved fetchWithToken function for both users and events requests
      const [usersResp, eventsResp] = await Promise.all([
        fetchWithToken("auth/all-users"), // Corrected endpoint
        fetchWithToken("events/all-events") // Correct endpoint as per your example
      ]);

      // Parse the JSON response
      const usersData = await usersResp.json();
      const eventsData = await eventsResp.json();

      // Check the ok property to determine if the fetch was successful
      if (usersData.ok && eventsData.ok) {
        dispatch(loadUsers(usersData.users)); // Dispatch users data
        dispatch(loadEvents(eventsData.events)); // Dispatch events data
      } else {
        // If there's an error, display it using Swal
        Swal.fire("Error", "Failed to fetch admin data", "error");
      }
    } catch (error) {
      console.error(error); // Log the error
      Swal.fire("Error", "Please, contact the administrator", "error"); // Display a generic error message
    }
  };
};

// The action creators for dispatching actions
const loadUsers = (users) => ({
  type: types.adminLoadUsers,
  payload: users,
});

const loadEvents = (events) => ({
  type: types.adminLoadEvents,
  payload: events,
});