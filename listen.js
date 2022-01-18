const app = require("./app");

const PORT = 3000;

app.listen(PORT, (error) => {
  if (error) {
    console.log(error);
    return;
  }
  console.log(`Connected at port ${PORT}`);
});
