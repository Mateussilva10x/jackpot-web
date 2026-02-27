const http = require("http");

const options = {
  hostname: "localhost",
  port: 3333,
  path: "/matches",
  method: "GET",
};

const req = http.request(options, (res) => {
  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });
  res.on("end", () => {
    console.log(data.substring(0, 1500));
  });
});

req.on("error", (error) => {
  console.error("Error:", error);
});

req.end();
