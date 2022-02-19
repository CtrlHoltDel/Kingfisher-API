const app = require("./app");

const { PORT = 4000 } = process.env;

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Listening at http://localhost:${PORT}...`);
});
