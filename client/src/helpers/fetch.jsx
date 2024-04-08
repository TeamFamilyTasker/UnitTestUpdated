const baseUrl = process.env.REACT_APP_API_URL;
export const fetchNoToken = (endpoint, data, method = "GET") => {
  const url = `${baseUrl}/${endpoint}`; // localhost:5000/api/events

  if (method === "GET") {
    return fetch(url);
  } else {
    return fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }
};

export const fetchWithToken = async (endpoint, data = {}, method = "GET") => {
  const url = `${baseUrl}/${endpoint}`; // localhost:5000/api/events
  const token = localStorage.getItem("token") || "";

  // Basic config without the body, suitable for GET requests
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-token': token,
    },
  };

  // Only add the body for methods other than GET
  if (method !== "GET") {
    config.body = JSON.stringify(data);
  }

  // Perform the fetch call with the config
  return fetch(url, config);
};

