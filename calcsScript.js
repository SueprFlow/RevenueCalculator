// calculator.js
function formatNumberDollar(num) {
  return "$" + num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function calculate() {
  const volume = parseFloat(document.getElementById('volume').value);
  const bps = parseFloat(document.getElementById('bps').value);
  const referralFee = parseFloat(document.getElementById('referralFee').value) * 0.01;
  const buyback = parseFloat(document.getElementById('buyback').value) * 0.01;
  const liquidatedNotional = parseFloat(document.getElementById('liquidatedNotional').value) * 0.01;
  const avgLeverage = parseFloat(document.getElementById('avgLeverage').value);
  const maintenanceMarginSteps = parseFloat(document.getElementById('maintenanceMarginSteps').value) * 0.01;
  const avgFunding = parseFloat(document.getElementById('avgFunding').value);
  const avgOI = parseFloat(document.getElementById('avgOI').value) * 0.01;

  let lpShare = 0.85 - referralFee;
  let monthlyVolume = volume * 30;
  let totalPerpSolverFees = bps * 0.6;
  let totalPerpProtocolFees = bps * 0.4;
  let totalLiquidatedNotional = monthlyVolume * 1000000 * liquidatedNotional;
  let collateralProvided = totalLiquidatedNotional / avgLeverage;
  let platformFees = monthlyVolume * 1000000 * (totalPerpProtocolFees / 10000);
  let solverFees = monthlyVolume * 1000000 * (totalPerpSolverFees / 10000);
  let avgMaintenanceMargin = avgLeverage * maintenanceMarginSteps;

  let liquidationFeeLow = collateralProvided * avgMaintenanceMargin;
  let liquidationFeeHigh = (solverFees + platformFees) * 0.3333;
  let fundingLow = avgOI * avgFunding * 0.01 * (1 / 12) * 10000000 * 0.2;
  let fundingHigh = avgOI * avgFunding * 0.01 * (1 / 12) * 10000000 * 0.75;

  let feeLow = solverFees;
  let feeHigh = solverFees;
  let mmLow = liquidationFeeLow;
  let mmHigh = liquidationFeeHigh;
  let revenueLow = feeLow + mmLow + fundingLow;
  let revenueHigh = feeHigh + mmHigh + fundingHigh;

  let manageLow = revenueLow * (1 - (lpShare + referralFee));
  let manageHigh = revenueHigh * (1 - (lpShare + referralFee));
  let referralLow = revenueLow * referralFee;
  let referralHigh = revenueHigh * referralFee;
  let buybackLow = (revenueLow - referralLow - manageLow) * buyback;
  let buybackHigh = (revenueHigh - referralHigh - manageHigh) * buyback;
  let subLow = buybackLow + referralLow + manageLow;
  let subHigh = buybackHigh + referralHigh + manageHigh;
  let lpLow = revenueLow - subLow;
  let lpHigh = revenueHigh - subHigh;

  // Output
  document.getElementById('feeLow').textContent = formatNumberDollar(feeLow);
  document.getElementById('feeHigh').textContent = formatNumberDollar(feeHigh);
  document.getElementById('mmLow').textContent = formatNumberDollar(mmLow);
  document.getElementById('mmHigh').textContent = formatNumberDollar(mmHigh);
  document.getElementById('fundingLow').textContent = formatNumberDollar(fundingLow);
  document.getElementById('fundingHigh').textContent = formatNumberDollar(fundingHigh);
  document.getElementById('solverRevenueLow').textContent = formatNumberDollar(revenueLow);
  document.getElementById('solverRevenueHigh').textContent = formatNumberDollar(revenueHigh);
  document.getElementById('solverManageLow').textContent = formatNumberDollar(manageLow);
  document.getElementById('solverManageHigh').textContent = formatNumberDollar(manageHigh);
  document.getElementById('referralLow').textContent = formatNumberDollar(referralLow);
  document.getElementById('referralHigh').textContent = formatNumberDollar(referralHigh);
  document.getElementById('buybackLow').textContent = formatNumberDollar(buybackLow);
  document.getElementById('buybackHigh').textContent = formatNumberDollar(buybackHigh);
  document.getElementById('subtractionsLow').textContent = formatNumberDollar(subLow);
  document.getElementById('subtractionsHigh').textContent = formatNumberDollar(subHigh);
  document.getElementById('lpShareLow').textContent = formatNumberDollar(lpLow);
  document.getElementById('lpShareHigh').textContent = formatNumberDollar(lpHigh);
  document.getElementById('lpSharePercent').textContent = (lpShare * 100).toFixed(2) + "%";
}
