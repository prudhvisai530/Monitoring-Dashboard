import axios from "axios";

const BASE_URL = 'http://localhost:3000/users';

export const loginUser = async (data: { username: string; password: string }) => {
    const response = await axios.post(`${BASE_URL}/login`, data);
    const { access_token, role } = response.data;

    sessionStorage.setItem('token', access_token);
    sessionStorage.setItem('role', role);

    return response.data;
};

export const signupUser = async (data: { username: string; password: string; role: string }) => {
    const res = await axios.post(`${BASE_URL}/signup`, data);

    return res.data;
};
