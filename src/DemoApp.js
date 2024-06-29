import React from "react";
import AppRouter from "./AppRouter";
import AuthRouter from "./LoginPage";

// put useContext here
//Login page if is not login
//use usereducer to handle state

const isLogin = false;

const DemoApp = () => {
  if (isLogin) {
    return <AppRouter />;
  } else {
    return <AuthRouter />;
  }
};

export default DemoApp;
