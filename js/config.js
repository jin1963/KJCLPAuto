// js/config.js

// Contract Address
const contractAddress = "0xFf77E7b8f574f31BeBF43F3348122a8331da0d47";
const lpTokenAddress = "0xdF0d76046E72C183142c5208Ea0247450475A0DF";
const kjcAddress = "0xd479ae350dc24168e8db863c5413c35fb2044ecd";

// BSC Chain ID
const BSC_CHAIN_ID = '0x38';

// ABI หลักของ Smart Contract LP Auto Stake
const contractABI = [ /* (นำเข้า ABI ที่คุณให้มาไว้ในนี้ทั้งหมด) */ ];

// ABI ของ ERC20 (ใช้ร่วมทั้ง KJC, LP)
const erc20ABI = [
  {
    "constant": false,
    "inputs": [
      { "name": "spender", "type": "address" },
      { "name": "value", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "name": "", "type": "bool" }],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{ "name": "owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "", "type": "uint256" }],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{ "name": "", "type": "uint8" }],
    "type": "function"
  }
];
