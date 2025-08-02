// js/utils.js

// แปลงจาก wei → token string (แสดงผล)
export function displayWeiToToken(weiAmount, decimals = 18) {
  if (!window.web3 || !weiAmount || typeof decimals === 'undefined' || isNaN(decimals)) return '0';
  try {
    const divisor = BigInt(10) ** BigInt(decimals);
    if (BigInt(weiAmount) === BigInt(0)) return '0';
    let amountStr = BigInt(weiAmount).toString();
    if (amountStr.length <= decimals) {
      amountStr = '0.' + '0'.repeat(decimals - amountStr.length) + amountStr;
    } else {
      amountStr = amountStr.slice(0, amountStr.length - decimals) + '.' + amountStr.slice(amountStr.length - decimals);
    }
    return amountStr.replace(/\.0+$/, '').replace(/(\.\d*?[1-9])0+$/, '$1');
  } catch (e) {
    console.error("Error in displayWeiToToken:", e);
    return (parseFloat(weiAmount.toString()) / (10 ** decimals)).toString();
  }
}

// แปลงจาก token → wei string (ใช้ในธุรกรรม)
export function tokenToWei(tokenAmount, decimals = 18) {
  if (!window.web3 || !tokenAmount || typeof decimals === 'undefined' || isNaN(decimals)) return '0';
  try {
    const [integer, fractional] = tokenAmount.toString().split('.');
    let weiAmount = BigInt(integer || '0') * (BigInt(10) ** BigInt(decimals));
    if (fractional) {
      const paddedFractional = (fractional + '0'.repeat(decimals)).slice(0, decimals);
      weiAmount += BigInt(paddedFractional);
    }
    return weiAmount.toString();
  } catch (e) {
    console.error("Error in tokenToWei:", e);
    return window.web3.utils.toWei(tokenAmount.toString(), 'ether'); // fallback
  }
}

// แสดงข้อความข้อผิดพลาดให้อ่านง่าย
export function getFriendlyErrorMessage(error) {
  if (typeof error === 'string') return error;
  if (error?.message) {
    if (error.message.includes("user rejected transaction")) return "❌ ผู้ใช้ยกเลิกธุรกรรม";
    if (error.message.includes("insufficient funds")) return "❌ ยอดเงินไม่เพียงพอ";
    if (error.message.includes("transfer amount exceeds")) return "❌ จำนวนเกินยอดที่มี";
    return `❌ ${error.message}`;
  }
  return "❌ ไม่ทราบสาเหตุ";
}

// ดึงทศนิยมของ token (เช่น 18 หรือ 6)
export async function getTokenDecimals(tokenContract, fallback = 18) {
  try {
    const decimals = await tokenContract.methods.decimals().call();
    return parseInt(decimals);
  } catch (e) {
    console.warn("⚠️ ใช้ fallback ทศนิยม:", e);
    return fallback;
  }
}

// แปลงวินาทีเป็นข้อความแบบ 5d 2h 3m 20s
export function formatCountdown(seconds) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${d}d ${h}h ${m}m ${s}s`;
}

// ใช้ใน async เพื่อ delay รอผล
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
