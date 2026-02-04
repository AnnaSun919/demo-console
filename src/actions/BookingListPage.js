import * as ActionTypes from '../constants/actiontypes';
import { BookingService } from '../helper/api';

export const getBookings =
  ({userId}) =>
  async (dispatch) => {
    dispatch({
      type: ActionTypes.GET_BOOKINGS_LIST_REQUEST,
    });
    console.log("testing booking!")
    console.log(userId)
    console.log("The ID passed is:", userId, "Type:", typeof userId);
    const response = await BookingService.getBookings(userId);
    console.log("Testing get Booking ")
    console.log(response)
    if (response && response.data.success) {
      console.log("Testing api success")

      dispatch({
        type: ActionTypes.GET_BOOKINGS_LIST_SUCCESS,
        payload: response.result,
      });
    } else {
      console.log("not success")
      dispatch({
        type: ActionTypes.GET_BOOKINGS_LIST_ERROR,
      });
    }
  };

// export function getBookings(options) {
// 	return async dispatch => {

//     const response = await authService.login({ loginData });

// 		dispatch({
// 			type: ActionTypes.GET_BOOKINGS_LIST_REQUEST,
// 			payload: {
// 				page: +options.page,
// 				limit: +options.limit,
// 				loading: true
// 			}
// 		});

// 		if (response.meta.code !== 200) {
// 			return dispatch({
// 				type: ActionTypes.GET_BOOKINGS_LIST_ERROR,
// 				payload: {
// 					meta: response.meta,
// 					loading: false
// 				}
// 			});
// 		}

// 		const { bookings } = response.data;

// 		dispatch({
// 			type: ActionTypes.GET_BOOKINGS_LIST_SUCCESS,
// 			payload: {
// 				bookings,
// 				total: response.data.total,
// 				count: response.data.count,
// 				loading: false
// 			}
// 		});
// 	};
// }
