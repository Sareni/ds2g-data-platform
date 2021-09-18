const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    ["/api", "/auth/google", "/auth/auth0", "/auth/signup", "/auth/login", "/auth/resetpassword",  "/auth/changepassword"],
    createProxyMiddleware({
      target: "http://localhost:5001",
    })
  );
};