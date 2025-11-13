const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const generateString = () => {
  let result = " ";
  const charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  const timestamp = new Date().toISOString();
  console.log(timestamp);
  console.log(result);

  setTimeout(generateString, 5000);
};

generateString();
