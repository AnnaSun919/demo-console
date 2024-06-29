const successHandler = (
  response,
  options = { notifyOnSuccess: false, notifyOnFailed: true }
) => {
  const { data } = response;
  if (data && data.success === true) {
  } else {
  }
};

export default successHandler;
