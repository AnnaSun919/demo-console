import * as ActionTypes from '../constants/actiontypes';
import BookingList from '../helper/api/BookListPage';

export const getBookings =
  ({ userId }) =>
    async (dispatch) => {
      dispatch({
        type: ActionTypes.GET_BOOKINGS_LIST_REQUEST,
      });
      const response = await BookingList.getBookings(userId);
      if (response?.data?.success) {
        dispatch({
          type: ActionTypes.GET_BOOKINGS_LIST_SUCCESS,
          payload: response.data,
        });
      } else {
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
