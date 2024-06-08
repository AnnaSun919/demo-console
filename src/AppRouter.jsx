import {} from "react-router-dom";
import { useRoutes } from "react-router-dom";

export default function AppRouter() {
  const routesList = [];

  let element = useRoutes(routesList);

  return element;
}
