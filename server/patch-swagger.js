const fs = require("fs");
const path = require("path");

// Load swagger JSON
const swaggerFile = path.join(__dirname, "swagger-output.json");
const swaggerDoc = JSON.parse(fs.readFileSync(swaggerFile, "utf8"));

// Define route-to-prefix map
const routePrefixes = {
  "/auth": "/api/v1/auth",
  "/jobs": "/api/v1/jobs",
  "/applications": "/api/v1/applications",
  "/profile": "/api/v1/profile",
};

// Patch paths
const newPaths = {};

for (const [route, methods] of Object.entries(swaggerDoc.paths)) {
  const parts = route.split("/").filter(Boolean); // e.g. ["jobs", "all"]

  // Default: No prefix
  let matchedPrefix = "";
  let newRoute = route;

  // Try to find matching prefix
  for (const key in routePrefixes) {
    if (route.startsWith(key)) {
      matchedPrefix = routePrefixes[key];
      newRoute = route.replace(key, matchedPrefix);
      break;
    } else if (parts.length > 0 && routePrefixes[`/${parts[0]}`]) {
      matchedPrefix = routePrefixes[`/${parts[0]}`];
      newRoute = `/${[matchedPrefix, ...parts.slice(1)].join("/")}`;
      break;
    }
  }

  // Fallback: if nothing matched, leave it untouched
  if (!matchedPrefix) {
    newRoute = `/api/v1${route}`;
  }

  newPaths[newRoute] = methods;
}

swaggerDoc.paths = newPaths;

// Write the updated swagger file
fs.writeFileSync(swaggerFile, JSON.stringify(swaggerDoc, null, 2), "utf8");
