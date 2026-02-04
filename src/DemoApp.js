import React from "react";
import AppRouter from "./AppRouter";
import AuthRouter from "./IndexPage";

// put useContext here
//Login page if is not login
//use usereducer to handle state

const isLogin = false;

const DemoApp = () => {

    return <AuthRouter />;

};

export default DemoApp;
