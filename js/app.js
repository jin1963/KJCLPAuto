// js/app.js
// นำเข้าฟังก์ชันที่จำเป็นจาก wallet.js
import { connectWallet, getCurrentAccount } from './wallet.js';
// นำเข้าฟังก์ชันอื่น ๆ
import { initStakingInfo, stakeLP, claimStakingReward, claimReferralReward, withdrawLP } from './staking.js';
import { registerReferrer, showReferralLink } from './referral.js';

// กำหนดให้ connectWallet() สามารถเรียกใช้ได้จาก HTML โดยใช้ window.
window.connectWallet = async () => {
  const connected = await connectWallet();
  if (connected) {
    document.getElementById("walletAddress").innerText = `✅ ${await getCurrentAccount()}`;
    await showReferralLink();
    await initStakingInfo();
  }
};

// ฟังก์ชันอื่นๆ ที่เรียกใช้จาก HTML
window.stakeLP = async () => {
  await stakeLP();
  await initStakingInfo();
};

window.claimStakingReward = async () => {
  await claimStakingReward();
  await initStakingInfo();
};

window.claimReferralReward = async () => {
  await claimReferralReward();
  await initStakingInfo();
};

window.withdrawLP = async () => {
  await withdrawLP();
  await initStakingInfo();
};

window.registerReferrer = async () => {
  await registerReferrer();
};

window.copyRefLink = () => {
  const refLink = document.getElementById("refLink");
  navigator.clipboard.writeText(refLink.href)
    .then(() => alert("✅ คัดลอกลิงก์แนะนำแล้ว"))
    .catch(() => alert("❌ คัดลอกลิงก์ไม่สำเร็จ"));
};
