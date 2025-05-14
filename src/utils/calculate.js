function calculateStampDuty(amount) {
  const bands = [
    { upperLimit: 250000, rate: 0.03 },
    { upperLimit: 925000, rate: 0.08 },
    { upperLimit: 1500000, rate: 0.13 },
    { upperLimit: Infinity, rate: 0.15 },
  ]

  let tax = 0
  let taxableSum = amount
  const bandTaxes = []

  for (const band of bands) {
    if (taxableSum <= 0) {
      break
    }

    const bandAmount = Math.min(taxableSum, band.upperLimit)
    const bandTax = bandAmount * band.rate
    tax += bandTax
    taxableSum -= bandAmount

    bandTaxes.push({
      band: `${
        band.upperLimit === Infinity
          ? '£1,500,001 +'
          : `£${band.upperLimit.toLocaleString()}`
      }`,
      tax: bandTax.toLocaleString('en-GB', {
        style: 'currency',
        currency: 'GBP',
      }),
    })
  }

  const effectiveRate = (tax / amount) * 100
  const formattedAmount = amount.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP',
  })

  return {
    STAMP_DUTY_TO_PAY: tax,
    Effective_Rate: `${effectiveRate.toFixed(1)}%`,
    TAXABLE_SUM: formattedAmount,
    Band_Taxes: bandTaxes,
  }
}

const calculateMonthlyMortgage = (property) => {
  const monthlyInterestRate = property.loanInterest / 100 / 12
  const numberOfPayments = property.repaymentPeriod * 12

  let monthlyMortgage

  if (property.repaymentType === 'interestOnly') {
    monthlyMortgage = property.loan * monthlyInterestRate
  } else if (property.repaymentType === 'repayment') {
    monthlyMortgage =
      (property.loan * monthlyInterestRate) /
      (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments))
  } else {
    throw new Error(`Unsupported repayment type: ${property.repaymentType}`)
  }

  return monthlyMortgage
}

const calculateCashFlow = (
  mortgageTerm,
  stampDuty,
  setupFees,
  monthlyRentalIncome,
  monthlyMortgage,
  deposit,
) => {
  // Calculate gross rent
  const annualRent = monthlyRentalIncome * 12

  // Distribute setup fees and stamp duty over one year
  const yearlySetupFees = setupFees / mortgageTerm / 12
  const yearlyStampDuty = stampDuty / mortgageTerm / 12
  const yearlyAmortizedCosts = yearlySetupFees + yearlyStampDuty

  // Calculate the annual mortgage principal and interest
  const annualMortgagePAndI = monthlyMortgage * 12

  // Calculate net cash flow
  const netYearlyCashFlow =
    annualRent - annualMortgagePAndI - yearlyAmortizedCosts

  // Calculate monthly and term cash flows
  const netMonthlyCashFlow = netYearlyCashFlow / 12
  const netCashFlowOverTerm = netYearlyCashFlow * mortgageTerm

  // Calculate cash flow over mortgage term minus stamp duty
  const netCashFlowOverTermMinusStampDuty = netCashFlowOverTerm - stampDuty

  // calculate the percentage margin
  const percentageMargin = (netYearlyCashFlow / (deposit / mortgageTerm)) * 100
  return {
    monthlyCashFlow: netMonthlyCashFlow,
    yearlyCashFlow: netYearlyCashFlow,
    cashFlowOverMortgageTerm: netCashFlowOverTerm,
    cashFlowOverMortgageTermMinusStampDuty: netCashFlowOverTermMinusStampDuty,
    percentageMargin,
  }
}

const calculateLTV = (property) => (property.loan / property.price) * 100

const calculateROI = (investment, profit) => (profit / investment) * 100

function covers125PercentOfMortgage(rentalIncome, monthlyMortgagePayment) {
  const requiredIncome = monthlyMortgagePayment * 1.45
  const covers125Percent = rentalIncome >= requiredIncome
  return covers125Percent ? 'Yes' : 'No'
}

export const sortByProfitability = (properties) => {
  return properties.map((property) => {
    const stampDuty = calculateStampDuty(property.price)
    property.loan = property.price - property.deposit

    property.yearlyOperatingCosts =
      property.annualServiceCharge + property.annualGroundRent
    property.monthlyOperatingCosts = Math.round(
      property.yearlyOperatingCosts / 12,
    )

    // Ensure monthlyRentalIncome is a number
    const monthlyRentalIncome = parseFloat(property.monthlyRentalIncome)
    const annualRentalIncome = monthlyRentalIncome * 12
    const rentalYield = (annualRentalIncome / property.price) * 100

    const ltv = calculateLTV(property)
    const monthlyMortgage = calculateMonthlyMortgage(property)

    // Pass numeric values to calculateCashFlow
    const cashFlow = calculateCashFlow(
      property.mortgageTerm,
      stampDuty.STAMP_DUTY_TO_PAY,
      property.setupFees,
      monthlyRentalIncome,
      monthlyMortgage,
      property.deposit,
    )

    const totalInvestment =
    parseFloat(property.deposit) +
    parseFloat(property.setupFees) +
    parseFloat(stampDuty.STAMP_DUTY_TO_PAY)
    const totalRoi = calculateROI(
      totalInvestment,
      cashFlow.cashFlowOverMortgageTerm,
    )
    const annualROI = calculateROI(totalInvestment, cashFlow.yearlyCashFlow)

    const coverage = covers125PercentOfMortgage(
      monthlyRentalIncome,
      monthlyMortgage,
    )

    return {
      ...property,
      stampDuty,
      price: `£${property.price.toLocaleString()}`,
      ltv,
      annualRentalIncome: `£${annualRentalIncome.toLocaleString()}`,
      rentalYield: rentalYield.toFixed(1),
      loan: `£${property.loan.toLocaleString()}`,
      deposit: `£${property.deposit.toLocaleString()}`,
      monthlyMortgage,
      coverage,
      monthlyRentalIncome: `£${monthlyRentalIncome.toLocaleString()}`,
      monthlyOperatingCosts: `£${property.monthlyOperatingCosts.toLocaleString()}`,
      monthlyCashFlow: `£${Math.floor(cashFlow.monthlyCashFlow).toLocaleString()}`,
      yearlyCashFlow: `£${Math.floor(cashFlow.yearlyCashFlow).toLocaleString()}`,
      cashFlowOverMortgageTerm: `£${Math.floor(cashFlow.cashFlowOverMortgageTerm).toLocaleString()}`,
      cashFlowOverMortgageTermMinusStampDuty: `£${Math.floor(cashFlow.cashFlowOverMortgageTermMinusStampDuty).toLocaleString()}`,
      annualProfitPercentage: cashFlow.percentageMargin.toFixed(1) + '%',
      totalROI: `${totalRoi.toFixed(1)}%`,
      annualROI: `${annualROI.toFixed(1)}%`,
      totalInvestment: `£${Math.floor(totalInvestment).toLocaleString()}`,
    }
  })
}
