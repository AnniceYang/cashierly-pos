export default [
  {
    url: "/api/login",
    method: "post",
    response: ({ body }) => {
      const { username, password } = body;
      if (username === "admin" && password === "123456") {
        return {
          code: 200,
          message: "登录成功",
          data: {
            token: "mocked-token-123456",
            username: "admin",
          },
        };
      } else {
        return {
          code: 401,
          message: "用户名或密码错误",
        };
      }
    },
  },
];
