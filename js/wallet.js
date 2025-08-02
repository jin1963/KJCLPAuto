// js/wallet.js

let web3;
let account;
let stakingContract;
let lpToken;
let kjcToken;

async function connectWallet() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await web3.eth.getAccounts();
      account = accounts[0];

      const chainId = await web3.eth.getChainId();
      if (chainId !== 56) {
        alert("กรุณาเชื่อม BNB Chain ก่อน");
        return;
      }

      stakingContract = new web3.eth.Contract(contractABI, contractAddress);
      lpToken = new web3.eth.Contract(erc20ABI, lpTokenAddress);
      kjcToken = new web3.eth.Contract(erc20ABI, kjcAddress);

      document.getElementById("walletAddress").innerText = `🟢 เชื่อมแล้ว: ${account.substring(0, 6)}...${account.slice(-4)}`;

      loadBalances();
      loadStakeStatus();

    } catch (err) {
      alert("❌ การเชื่อมต่อกระเป๋าล้มเหลว");
      console.error(err);
    }
  } else {
    alert("กรุณาติดตั้ง MetaMask หรือ Bitget Wallet");
  }
}
