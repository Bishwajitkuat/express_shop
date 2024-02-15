exports.getIsLoggedInFromCooke = (cookie) => {
  const cookieAsArray = cookie.split(";");
  const isLoggedInIndex = cookieAsArray.findIndex((item) =>
    item.includes("isLoggedIn")
  );
  // if the isLoggedIn does not exits isLoggedInIndex will be -1, in that case isLoggedIn value will be false
  if (isLoggedInIndex === -1) return false;
  const isLoggedInCookieValue = cookieAsArray[isLoggedInIndex].split("=")[1];
  if (isLoggedInCookieValue === "true") return true;
  else return false;
};
