import * as alertTypes from "../constants/alertTypes";

export const pushAlert = (message, type = alertTypes.ALERT_TYPE.INFO) => ({
  type: alertTypes.ALERT_PUSH,
  payload: { message, type },
});

export const pushWarningAlert = (message) =>
  pushAlert(message, alertTypes.ALERT_TYPE.WARNING);

export const shiftAlert = () => ({
  type: alertTypes.ALERT_SHIFT,
});
