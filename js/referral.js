// js/referral.js

import { web3, account, stakingContract } from './wallet.js';
import { getFriendlyErrorMessage, displayWeiToToken } from './utils.js';
import { rewardToken, rewardTokenDecimals } from './config.js';

// สมัคร referrer
export async function registerReferrer() {
  const refAddress = document.getElementById("refAddress").value.trim();

  if (!web3.utils.isAddress(refAddress)) {
    alert("❌ กรุณากรอก Address ให้ถูกต้อง");
    return;
  }

  try {
    await stakingContract.methods.setReferrer(refAddress).send({ from: account });
    alert("✅ ลงทะเบียนผู้นำแนะนำเรียบร้อย");
  } catch (err) {
    alert(getFriendlyErrorMessage(err));
  }
}

// แสดงลิงก์แนะนำ
export function copyRefLink() {
  const baseUrl = window.location.origin + window.location.pathname;
  const link = `${baseUrl}?ref=${account}`;
  navigator.clipboard.writeText(link);
  alert("✅ คัดลอกลิงก์แล้ว: " + link);
}

// เคลมรางวัล Referral
export async function claimReferralReward() {
  try {
    await stakingContract.methods.claimReferralReward().send({ from: account });
    alert("✅ เคลมรางวัลแนะนำสำเร็จ");
    loadReferralData();
  } catch (err) {
    alert(getFriendlyErrorMessage(err));
  }
}

// โหลดข้อมูล Referral เช่นยอดสะสม
export async function loadReferralData() {
  try {
    const rewardWei = await stakingContract.methods.referralReward(account).call();
    const reward = displayWeiToToken(rewardWei, rewardTokenDecimals);
    document.getElementById("refReward").innerText = `${reward} ${rewardToken.symbol}`;
  } catch (e) {
    console.warn("❌ โหลดข้อมูล referral ไม่ได้", e);
    document.getElementById("refReward").innerText = `-`;
  }
}

// โหลด referrer ที่เราเชื่อมอยู่ (ถ้ามี)
export async function showReferrerInfo() {
  try {
    const ref = await stakingContract.methods.referrerOf(account).call();
    document.getElementById("yourReferrer").innerText = ref === "0x0000000000000000000000000000000000000000" ? "❌ ไม่มีผู้นำแนะนำ" : ref;
  } catch (e) {
    console.warn("❌ ไม่สามารถโหลดข้อมูลผู้นำแนะนำ", e);
    document.getElementById("yourReferrer").innerText = "-";
  }
}
