const app = require("./app.js");
const PORT = process.env.PORT;

// Running the server
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

module.exports = app; // Exporting for tests