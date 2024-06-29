const errorHandler = (error) => {
  if (!navigator.onLine) {
  }

  const { response } = error;

  if (!response) {
  }

  if (response && response.data && response.data.jwtExpired) {
    const result = window.localStorage.getItem("auth");
    const jsonFile = window.localStorage.getItem("isLogout");
    const { isLogout } = (jsonFile && JSON.parse(jsonFile)) || false;
    window.localStorage.removeItem("auth");
    window.localStorage.removeItem("isLogout");
    if (result || isLogout) {
      window.location.href = "/logout";
    }
  }

  if (response && response.status) {
  } else {
  }
};

export default errorHandler;
