import { useEffect } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { shiftAlert } from "../actions/Alerts";

export default function MessageHandler() {
  const alert = useAlert();
  const dispatch = useDispatch();
  const next = useSelector((s) => s.alerts?.queue?.[0]);

  useEffect(() => {
    if (!next?.message) return;

    alert.show(next.message, { type: next.type || "info" });
    dispatch(shiftAlert());
  }, [alert, dispatch, next]);

  return null;
}
