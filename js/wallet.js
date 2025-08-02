// js/wallet.js

import { contractAddress, lpTokenAddress, kjcAddress, contractABI, erc20ABI, BSC_CHAIN_ID } from './config.js';
import { getTokenDecimals } from './utils.js'; // นำเข้าฟังก์ชันจาก utils

let web3;
let account = null;
let stakingContract;
let lpToken;
let kjcToken;
let lpTokenDecimals;
let kjcTokenDecimals;

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
      
      if (chainId !== BSC_CHAIN_ID) {
        alert("กรุณาเชื่อม BNB Chain ก่อน");
        return false;
      }

      stakingContract = new web3.eth.Contract(contractABI, contractAddress);
      lpToken = new web3.eth.Contract(erc20ABI, lpTokenAddress);
      kjcToken = new web3.eth.Contract(erc20ABI, kjcAddress);

      // ดึงค่า decimals ของ token
      lpTokenDecimals = await getTokenDecimals(lpToken);
      kjcTokenDecimals = await getTokenDecimals(kjcToken);

      document.getElementById("walletAddress").innerText = `🟢 เชื่อมแล้ว: ${account.substring(0, 6)}...${account.slice(-4)}`;

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

// Export ตัวแปรและฟังก์ชันที่ไฟล์อื่นต้องใช้
export {
  connectWallet, 
  getCurrentAccount, 
  stakingContract, 
  lpToken, 
  kjcToken, 
  web3,
  lpTokenDecimals,
  kjcTokenDecimals
};
