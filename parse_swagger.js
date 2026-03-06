const fs = require("fs");
const j = JSON.parse(fs.readFileSync("swagger.json", "utf8"));
for (const [path, methods] of Object.entries(j.paths)) {
  for (const [method, details] of Object.entries(methods)) {
    if (details.tags && details.tags.includes("Admin")) {
      console.log(`[${method.toUpperCase()}] ${path}`);
      console.log(JSON.stringify(details, null, 2));
    }
  }
}
