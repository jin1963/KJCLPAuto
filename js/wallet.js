// js/wallet.js

// import ค่าจากไฟล์ config.js
import { contractAddress, lpTokenAddress, kjcAddress, contractABI, erc20ABI, BSC_CHAIN_ID } from './config.js';

let web3;
let account = null;
let stakingContract;
let lpToken;
let kjcToken;

function getCurrentAccount() {
  return account;
}

async function connectWallet() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await web3.eth.getAccounts();
      account = accounts[0];

      const chainId = await web3.eth.getChainId();
      
      // ใช้ค่า BSC_CHAIN_ID ที่ import มาจาก config.js
      if (chainId !== BSC_CHAIN_ID) {
        alert("กรุณาเชื่อม BNB Chain ก่อน");
        return false;
      }

      stakingContract = new web3.eth.Contract(contractABI, contractAddress);
      lpToken = new web3.eth.Contract(erc20ABI, lpTokenAddress);
      kjcToken = new web3.eth.Contract(erc20ABI, kjcAddress);

      document.getElementById("walletAddress").innerText = `🟢 เชื่อมแล้ว: ${account.substring(0, 6)}...${account.slice(-4)}`;

      // เพิ่มฟังก์ชัน loadBalances และ loadStakeStatus
      // loadBalances();
      // loadStakeStatus();

      return true;
    } catch (err) {
      alert("❌ การเชื่อมต่อกระเป๋าล้มเหลว");
      console.error(err);
      return false;
    }
  } else {
    alert("กรุณาติดตั้ง MetaMask หรือ Bitget Wallet");
    return false;
  }
}

export { connectWallet, getCurrentAccount, stakingContract, lpToken, kjcToken, web3 };
