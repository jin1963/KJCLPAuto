// js/utils.js

// แปลงจาก wei → token string (แสดงผล)
export function displayWeiToToken(weiAmount, decimals) {
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
export function tokenToWei(tokenAmount, decimals) {
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
    return error.message;
  }
  return "❌ ไม่ทราบสาเหตุ";
}

// ดึงทศนิยมของ token ถ้าอ่านไม่ได้จะ fallback
export async function getTokenDecimals(tokenContract, fallback = 18) {
  try {
    const decimals = await tokenContract.methods.decimals().call();
    return parseInt(decimals);
  } catch (e) {
    console.warn("⚠️ ใช้ fallback ทศนิยม:", e);
    return fallback;
  }
}

// สร้าง toWeiFromInput เพื่อให้เข้ากับโค้ดของคุณ
export function toWeiFromInput(input, decimals) {
    return tokenToWei(input, decimals);
}
