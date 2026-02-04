import { API_BASE_URL } from "../config";

import axios from "axios";
import errorHandler from "../errorHandler";

export const getBookings = async (userId) => {
  try {
    console.log("testing service , get data")
    console.log(userId)
    const response = await axios({
      method: "get",
      url: API_BASE_URL + "bookings?userId=8cb8067b-bc96-4880-8fa0-61e858fc30c3"
    });

    console.log()
    return response;
  } catch (error) {
    return errorHandler(error);
  }
};
