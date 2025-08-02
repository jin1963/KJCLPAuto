// js/staking.js

import { web3, account, stakingContract, lpTokenContract } from './wallet.js';
import { getFriendlyErrorMessage, displayWeiToToken, toWeiFromInput } from './utils.js';
import { lpToken, lpTokenDecimals, rewardToken, rewardTokenDecimals } from './config.js';

// Stake LP Token
export async function stakeLP() {
  const input = document.getElementById("stakeAmount").value.trim();
  if (!input || isNaN(input) || parseFloat(input) <= 0) {
    alert("❌ กรุณากรอกจำนวนที่ต้องการ Stake ให้ถูกต้อง");
    return;
  }

  const amountWei = toWeiFromInput(input, lpTokenDecimals);

  try {
    // อนุมัติ LP Token ก่อน
    await lpTokenContract.methods.approve(stakingContract.options.address, amountWei).send({ from: account });

    // Stake
    await stakingContract.methods.stakeLP(amountWei).send({ from: account });

    alert("✅ Stake LP สำเร็จแล้ว!");
    loadStakeData();
  } catch (err) {
    alert(getFriendlyErrorMessage(err));
  }
}

// เคลมรางวัลการ Stake
export async function claimStakingReward() {
  try {
    await stakingContract.methods.claimStakingReward().send({ from: account });
    alert("✅ เคลมรางวัลการ Stake สำเร็จ");
    loadStakeData();
  } catch (err) {
    alert(getFriendlyErrorMessage(err));
  }
}

// ถอน LP Token เมื่อครบเวลา
export async function withdrawLP() {
  try {
    await stakingContract.methods.withdrawLP().send({ from: account });
    alert("✅ ถอน LP Token สำเร็จแล้ว");
    loadStakeData();
  } catch (err) {
    alert(getFriendlyErrorMessage(err));
  }
}

// โหลดข้อมูล Stake
export async function loadStakeData() {
  try {
    const stake = await stakingContract.methods.stakes(account).call();
    const amount = displayWeiToToken(stake.amount, lpTokenDecimals);
    const start = stake.startTime;
    const lastClaim = stake.lastClaimTime;

    document.getElementById("yourStake").innerText = `${amount} ${lpToken.symbol}`;

    const claimable = await stakingContract.methods.getClaimable(account).call();
    const reward = displayWeiToToken(claimable, rewardTokenDecimals);
    document.getElementById("stakeReward").innerText = `${reward} ${rewardToken.symbol}`;
  } catch (e) {
    console.warn("❌ โหลดข้อมูล stake ไม่ได้", e);
    document.getElementById("yourStake").innerText = "-";
    document.getElementById("stakeReward").innerText = "-";
  }
}
