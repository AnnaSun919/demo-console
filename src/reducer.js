export const initialState = null;

export function reducer(state, action) {
  switch (action.type) {
    case "test":
      return {
        ...state,
      };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
