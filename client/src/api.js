import axios from 'axios';

const API_URL = "http://localhost:5000/api"; // Adjust if your API is hosted elsewhere

export const getAllUsers = async () => {
    return axios.get(`${API_URL}/users`);
};

export const getAllEvents = async () => {
    return axios.get(`${API_URL}/events`);
};