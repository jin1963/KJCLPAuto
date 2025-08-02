// js/referral.js

// นำเข้าฟังก์ชันและตัวแปรที่จำเป็นจากไฟล์อื่น
import { web3, stakingContract, getCurrentAccount, kjcToken } from './wallet.js';
import { getFriendlyErrorMessage, displayWeiToToken } from './utils.js';
import { kjcAddress, contractAddress } from './config.js';

// สมัคร referrer
export async function registerReferrer() {
  const account = getCurrentAccount();
  if (!account) {
    alert("❌ กรุณาเชื่อมต่อกระเป๋า");
    return;
  }
  
  const refAddress = document.getElementById("refAddress").value.trim();

  if (!web3.utils.isAddress(refAddress)) {
    alert("❌ กรุณากรอก Address ให้ถูกต้อง");
    return;
  }

  try {
    await stakingContract.methods.setReferrer(refAddress).send({ from: account });
    alert("✅ ลงทะเบียนผู้นำแนะนำเรียบร้อย");
    showReferrerInfo(); // เรียกฟังก์ชันเพื่อแสดงข้อมูลผู้แนะนำใหม่
  } catch (err) {
    alert(getFriendlyErrorMessage(err));
  }
}

// แสดงลิงก์แนะนำ
export function showReferralLink() {
  const account = getCurrentAccount();
  const refLinkElement = document.getElementById("refLink");

  if (!account) {
    refLinkElement.innerText = "❌ ยังไม่เชื่อมต่อ";
    refLinkElement.href = "#";
    return;
  }

  const baseUrl = window.location.origin + window.location.pathname;
  const link = `${baseUrl}?ref=${account}`;
  refLinkElement.innerText = "📎 ลิงก์แนะนำของคุณ";
  refLinkElement.href = link;
}

// คัดลอกลิงก์แนะนำ
export function copyRefLink() {
  const account = getCurrentAccount();
  if (!account) {
    alert("❌ กรุณาเชื่อมต่อกระเป๋า");
    return;
  }
  
  const baseUrl = window.location.origin + window.location.pathname;
  const link = `${baseUrl}?ref=${account}`;
  navigator.clipboard.writeText(link)
    .then(() => alert("✅ คัดลอกลิงก์แนะนำแล้ว"))
    .catch(() => alert("❌ คัดลอกลิงก์ไม่สำเร็จ"));
}

// เคลมรางวัล Referral
export async function claimReferralReward() {
  const account = getCurrentAccount();
  if (!account) {
    alert("❌ กรุณาเชื่อมต่อกระเป๋า");
    return;
  }
  
  try {
    await stakingContract.methods.claimReferralReward().send({ from: account });
    alert("✅ เคลมรางวัลแนะนำสำเร็จ");
    loadReferralData(); // โหลดข้อมูลรางวัลใหม่
  } catch (err) {
    alert(getFriendlyErrorMessage(err));
  }
}

// โหลดข้อมูล Referral เช่นยอดสะสม
export async function loadReferralData() {
  const account = getCurrentAccount();
  const refRewardElement = document.getElementById("refReward");

  if (!account) {
    refRewardElement.innerText = "-";
    return;
  }

  try {
    const rewardWei = await stakingContract.methods.referralReward(account).call();
    const reward = displayWeiToToken(rewardWei, kjcToken.decimals);
    refRewardElement.innerText = `${reward} KJC`;
  } catch (e) {
    console.warn("❌ โหลดข้อมูล referral ไม่ได้", e);
    refRewardElement.innerText = `-`;
  }
}

// โหลด referrer ที่เราเชื่อมอยู่ (ถ้ามี)
export async function showReferrerInfo() {
  const account = getCurrentAccount();
  const yourReferrerElement = document.getElementById("referrerInfo"); // อ้างอิงจาก id ใน HTML ของคุณ

  if (!account) {
    yourReferrerElement.innerText = "-";
    return;
  }

  try {
    const ref = await stakingContract.methods.referrerOf(account).call();
    yourReferrerElement.innerText = ref === "0x0000000000000000000000000000000000000000" ? "❌ ไม่มีผู้นำแนะนำ" : ref;
  } catch (e) {
    console.warn("❌ ไม่สามารถโหลดข้อมูลผู้นำแนะนำ", e);
    yourReferrerElement.innerText = "-";
  }
}
