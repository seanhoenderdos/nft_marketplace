const fs = require("fs");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();


const privateKey = fs.readFileSync(".secret").toString().trim();
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY; // Get this from Alchemy
console.log(ALCHEMY_API_KEY);

module.exports = {
  networks: {
    // hardhat: {
    //   chainId: 1337, // Local development
    // },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`, // Sepolia RPC URL from Alchemy
      accounts: [privateKey], // Your wallet private key
    },
  },
  solidity: "0.8.4",
};
