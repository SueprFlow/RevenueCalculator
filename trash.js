    function disableInputsIfLocked() {
      const params = new URLSearchParams(window.location.search);
      if (params.get('locked') === 'true') {
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(el => {
          el.disabled = true;
          el.style.opacity = '0.5';
          el.style.pointerEvents = 'none';
        });

        // Optionally hide all buttons
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
          button.style.display = 'none';
        });
      }
    }


    window.onload = function () {
      const params = new URLSearchParams(window.location.search);
      // Load all fields (same as you already do)
      if (params.has('token')) document.getElementById('tokenName').value = params.get('token');
      if (params.has('volume')) document.getElementById('volume').value = params.get('volume');
      if (params.has('bps')) document.getElementById('bps').value = params.get('bps');
      if (params.has('referral')) {
        document.getElementById('referralFee').value = params.get('referral');
        document.getElementById('referralValue').textContent = params.get('referral') + '%';
      }
      if (params.has('buyback')) {
        document.getElementById('buyback').value = params.get('buyback');
        document.getElementById('buybackValue').textContent = params.get('buyback') + '%';
      }
      if (params.has('liquidatedNotional')) {
        document.getElementById('liquidatedNotional').value = params.get('liquidatedNotional');
        document.getElementById('liquidatedNotionalValue').textContent = params.get('liquidatedNotional') + '%';
      }
      if (params.has('avgLeverage')) document.getElementById('avgLeverage').value = params.get('avgLeverage');
      if (params.has('maintenanceMarginSteps')) {
        document.getElementById('maintenanceMarginSteps').value = params.get('maintenanceMarginSteps');
        document.getElementById('maintenanceMarginStepsValue').textContent = params.get('maintenanceMarginSteps') + '%';
      }
      if (params.has('avgFunding')) {
        document.getElementById('avgFunding').value = params.get('avgFunding');
        document.getElementById('avgFundingValue').textContent = params.get('avgFunding') + '%';
      }
      if (params.has('avgOI')) {
        document.getElementById('avgOI').value = params.get('avgOI');
        document.getElementById('avgOIValue').textContent = params.get('avgOI') + '%';
      }

      updateTokenIcon();
      calculate();
      disableInputsIfLocked();
    }

    function updateTokenIcon() {
      const token = document.getElementById("tokenName").value.toUpperCase();
      const iconMap = {
        ETH: "https://cdn.prod.website-files.com/6821e2dd420215db85312256/682dd87d91c8ab5fc1efdbaa_ethereum-eth-logo-diamond-purple.svg",
        BTC: "https://cdn.prod.website-files.com/6821e2dd420215db85312256/682ccadc604c4335a653305c_BTCicon.svg",
        USDC: "https://cdn.prod.website-files.com/6821e2dd420215db85312256/682dd8a61357199af865b614_usd-coin-usdc-logo.svg",
      };

      const defaultIcon = "https://cdn.prod.website-files.com/6821e2dd420215db85312256/682cc853d011ff1c4b054ee2_Default.svg";
      const iconURL = iconMap[token] || defaultIcon;
      document.getElementById("tokenIcon").src = iconURL;
    }

    function Refresh() {
      // Reset input values
      document.getElementById('tokenName').value = '';
      document.getElementById('volume').value = '';
      document.getElementById('bps').value = 20;

      document.getElementById('referralFee').value = 10;
      document.getElementById('referralValue').textContent = '10%';

      document.getElementById('buyback').value = 0;
      document.getElementById('buybackValue').textContent = '0%';
      // Reset new parameters
      document.getElementById('liquidatedNotional').value = 3;
      document.getElementById('liquidatedNotionalValue').textContent = '3%';

      document.getElementById('avgLeverage').value = 20;

      document.getElementById('maintenanceMarginSteps').value = 1;
      document.getElementById('maintenanceMarginStepsValue').textContent = '1%';

      document.getElementById('avgFunding').value = 3;
      document.getElementById('avgFundingValue').textContent = '3%';

      document.getElementById('avgOI').value = 100;
      document.getElementById('avgOIValue').textContent = '100%';

      // Reset output values
      const outputIds = [
        'feeLow', 'feeHigh', 'mmLow', 'mmHigh', 'fundingLow', 'fundingHigh',
        'solverRevenueLow', 'solverRevenueHigh',
        'solverManageLow', 'solverManageHigh',
        'referralLow', 'referralHigh',
        'buybackLow', 'buybackHigh',
        'subtractionsLow', 'subtractionsHigh',
        'lpShareLow', 'lpShareHigh',
        'lpSharePercent'
      ];

      outputIds.forEach(id => {
        document.getElementById(id).textContent = '–';
      });

      document.getElementById("tokenIcon").src = "https://cdn.prod.website-files.com/6821e2dd420215db85312256/682cc853d011ff1c4b054ee2_Default.svg";


    }

    function formatNumberDollar(num) {
      return "$" + num.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }



    function calculate() {
      //inputs 
      const volume = parseFloat(document.getElementById('volume').value);
      const bps = parseFloat(document.getElementById('bps').value);
      const referralFee = parseFloat(document.getElementById('referralFee').value) * 0.01;
      const buyback = parseFloat(document.getElementById('buyback').value) * 0.01;

      const liquidatedNotional = parseFloat(document.getElementById('liquidatedNotional').value) * 0.01;
      const avgLeverage = parseFloat(document.getElementById('avgLeverage').value);
      const maintenanceMarginSteps = parseFloat(document.getElementById('maintenanceMarginSteps').value) * 0.01;
      const avgFunding = parseFloat(document.getElementById('avgFunding').value);
      const avgOI = parseFloat(document.getElementById('avgOI').value) * 0.01;


      //calculations
      var lpShare = 0.85 - referralFee;
      let monthlyVolume = volume * 30;
      let totalPerpSolverFees = bps * 0.6;
      let totalPerpProtocolFees = bps * 0.4;
      let totalLiquidatedNotional = monthlyVolume * 1000000 * liquidatedNotional;
      let collateralProvided = totalLiquidatedNotional / avgLeverage;
      let PlattformFeesEarntFrontEnd = monthlyVolume * 1000000 * (totalPerpProtocolFees / 10000);
      let solverFeesEarnt = monthlyVolume * 1000000 * (totalPerpSolverFees / 10000);
      let avgMaintenanceMargin = avgLeverage * maintenanceMarginSteps;


      let liquidationFeeEarntLowerBound = collateralProvided * avgMaintenanceMargin;
      let liquidationFeeEarntUpperBound = (solverFeesEarnt + PlattformFeesEarntFrontEnd) * 0.3333;

      let fundingLow = avgOI * avgFunding * 0.01 * (1 / 12) * 10000000 * 0.2;
      let fundingHigh = avgOI * avgFunding * 0.01 * (1 / 12) * 10000000 * 0.75;

      let feeLow = solverFeesEarnt;
      let feeHigh = solverFeesEarnt;

      let mmLow = liquidationFeeEarntLowerBound;
      let mmHigh = liquidationFeeEarntUpperBound;

      let solverRevenueLow = feeLow + mmLow + fundingLow;
      let solverRevenueHigh = feeHigh + mmHigh + fundingHigh;

      let solverManageLow = solverRevenueLow * (1 - (lpShare + referralFee));
      let solverManageHigh = solverRevenueHigh * (1 - (lpShare + referralFee));

      let referralLow = solverRevenueLow * referralFee;
      let referralHigh = solverRevenueHigh * referralFee;

      let buybackLow = (solverRevenueLow - referralLow - solverManageLow) * buyback;
      let buybackHigh = (solverRevenueHigh - referralHigh - solverManageHigh) * buyback;

      let subtractionsLow = buybackLow + referralLow + solverManageLow;
      let subtractionsHigh = buybackHigh + referralHigh + solverManageHigh;

      let lpShareLow = solverRevenueLow - (buybackLow + referralLow + solverManageLow);
      let lpShareHigh = solverRevenueHigh - (buybackHigh + referralHigh + solverManageHigh);



      // Validate input ranges (optional fallback)
      if (volume < 0 || bps < 0 || referralFee < 0 || referralFee > 1 || buyback < 0 || buyback > 1 || lpShare < 0 || lpShare > 1) {
        alert("Please enter valid values:\n- No negatives\n- % fields must be between 0 and 100");
        return;
      }

      document.getElementById('feeLow').textContent = formatNumberDollar(feeLow);
      document.getElementById('feeHigh').textContent = formatNumberDollar(feeHigh);
      document.getElementById('mmLow').textContent = formatNumberDollar(mmLow);
      document.getElementById('mmHigh').textContent = formatNumberDollar(mmHigh);
      document.getElementById('fundingLow').textContent = formatNumberDollar(fundingLow);
      document.getElementById('fundingHigh').textContent = formatNumberDollar(fundingHigh);
      document.getElementById('solverRevenueLow').textContent = formatNumberDollar(solverRevenueLow);
      document.getElementById('solverRevenueHigh').textContent = formatNumberDollar(solverRevenueHigh);
      document.getElementById('solverManageLow').textContent = formatNumberDollar(solverManageLow);
      document.getElementById('solverManageHigh').textContent = formatNumberDollar(solverManageHigh);
      document.getElementById('referralLow').textContent = formatNumberDollar(referralLow);
      document.getElementById('referralHigh').textContent = formatNumberDollar(referralHigh);
      document.getElementById('buybackLow').textContent = formatNumberDollar(buybackLow);
      document.getElementById('subtractionsLow').textContent = formatNumberDollar(subtractionsLow);
      document.getElementById('subtractionsHigh').textContent = formatNumberDollar(subtractionsHigh);

      document.getElementById('lpSharePercent').textContent = lpShare * 100 + "%";

      document.getElementById('buybackHigh').textContent = formatNumberDollar(buybackHigh);
      document.getElementById('lpShareLow').textContent = formatNumberDollar(lpShareLow);
      document.getElementById('lpShareHigh').textContent = formatNumberDollar(lpShareHigh);
    }


    function copyShareableLink() {
      const token = encodeURIComponent(document.getElementById('tokenName').value);
      const volume = encodeURIComponent(document.getElementById('volume').value);
      const bps = encodeURIComponent(document.getElementById('bps').value);
      const referral = encodeURIComponent(document.getElementById('referralFee').value);
      const buyback = encodeURIComponent(document.getElementById('buyback').value);
      const liquidatedNotional = encodeURIComponent(document.getElementById('liquidatedNotional').value);
      const avgLeverage = encodeURIComponent(document.getElementById('avgLeverage').value);
      const maintenanceMarginSteps = encodeURIComponent(document.getElementById('maintenanceMarginSteps').value);
      const avgFunding = encodeURIComponent(document.getElementById('avgFunding').value);
      const avgOI = encodeURIComponent(document.getElementById('avgOI').value);

      const url = `${location.origin}${location.pathname}?token=${token}&volume=${volume}&bps=${bps}&referral=${referral}&buyback=${buyback}&liquidatedNotional=${liquidatedNotional}&avgLeverage=${avgLeverage}&maintenanceMarginSteps=${maintenanceMarginSteps}&avgFunding=${avgFunding}&avgOI=${avgOI}&locked=true`;

      navigator.clipboard.writeText(url).then(() => {
        alert("Locked link copied to clipboard!");
      }).catch(() => {
        alert("Failed to copy link.");
      });
    }
