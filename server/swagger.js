const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Job Portal API",
    description: "API documentation for the Job Portal backend",
  },
  host: "localhost:4000",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./routes/*.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
