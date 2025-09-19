import axios from "./axios";

export const loginUser = (data) => axios.post("/auth/login", data);
export const registerUser = (data) => axios.post("/auth/register", data);
export const fetchMe = () => axios.get("/auth/me");
export const searchUsers = (q) => axios.get(`/auth/search?q=${q}`);
