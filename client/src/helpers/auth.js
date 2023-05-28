const auth = {
  isAuthenticated() {
    if (typeof window == "undefined") return false;
    if (sessionStorage.getItem("jwt")) {
      let data = {
        user: JSON.parse(sessionStorage.getItem("jwt")),
        token: sessionStorage.getItem("token"),
      };
      return data;
    } else return false;
  },

  authenticate(jwt, token, callback) {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("jwt", JSON.stringify(jwt));
      sessionStorage.setItem("token", JSON.stringify(token));
    }
    callback();
  },

  clearJwt(callback) {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("jwt");
      sessionStorage.removeItem("token");
    }
    callback();
  },
};

export default auth;
