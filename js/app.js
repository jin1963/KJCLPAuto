// js/app.js
import { connectWallet, getCurrentAccount } from './wallet.js';
import { loadStakeData, stakeLP, claimStakingReward, claimReferralReward, withdrawLP } from './staking.js';
// เพิ่มไฟล์ referral.js ถ้าคุณมี
// import { registerReferrer, showReferralLink } from './referral.js';

// ให้ app.js มีหน้าที่โหลดข้อมูลเริ่มต้นเมื่อเชื่อมต่อสำเร็จ
async function initStakingInfo() {
  await loadStakeData();
  // await showReferralLink();
  // ...
}

window.connectWallet = async () => {
  const connected = await connectWallet();
  if (connected) {
    document.getElementById("walletAddress").innerText = `✅ ${await getCurrentAccount()}`;
    await initStakingInfo();
  }
};

window.stakeLP = async () => {
  await stakeLP();
  await initStakingInfo();
};

window.claimStakingReward = async () => {
  await claimStakingReward();
  await initStakingInfo();
};

window.claimReferralReward = async () => {
  // await claimReferralReward();
  await initStakingInfo();
};

window.withdrawLP = async () => {
  await withdrawLP();
  await initStakingInfo();
};

// ... โค้ดอื่นๆ ที่เหลือ
