import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../src/constants/config";


export const adminLogin = createAsyncThunk("admin/login", async (secretKey) => {

    try {

        const config = {
            withCredentials: true,
            headers: {
                "content-type": "application/json"
            }
        };

        const { data } = await axios.post(
            `${server}/api/v1/admin/verify`,
            { secretKey },
            config
        );

        return data.message;
    } catch (error) {
        throw error.response.data.message;
    };

});


export const getAdmin = createAsyncThunk("admin/getAdmin", async () => {
    try {
        const { data } = await axios.get(`${server}/api/v1/admin/`, {
            withCredentials: true
        });
        return data.admin;
    } catch (error) {
        throw error.response.data.message;
    };
});


export const adminLogout = createAsyncThunk("admin/logout", async () => {
    try {
        const { data } = await axios.get(`${server}/api/v1/admin/logout`, {
            withCredentials: true
        });
        return data.message;
    } catch (error) {
        throw error.response.data.message;
    };
});