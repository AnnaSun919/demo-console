import { API_BASE_URL } from "../config";

import axios from "axios";
import errorHandler from "../errorHandler";
import successHandler from "../successHandler";

export const login = async ({ loginData }) => {
  try {
    const response = await axios({
      method: "post",
      url: API_BASE_URL + "login",
      data: {
        username: loginData.username,
        password: loginData.password,
      },
    });
    return response;
  } catch (error) {
    return errorHandler(error);
  }
};
