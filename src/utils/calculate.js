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

  const monthlyMortgage =
    property.repaymentType === 'interestOnly'
      ? property.loan * monthlyInterestRate
      : (property.loan * monthlyInterestRate) /
        (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments))

  return monthlyMortgage
}

const calculateCashFlow = (property, mortgageTerm, stampDuty) => {
  // Ensure property.price is a number
  const price = parseFloat(property.price)
  const monthlyRentalIncome = parseFloat(property.monthlyRentalIncome)
  const setupFees = parseFloat(property.setupFees)
  const parsedStampDuty = parseFloat(stampDuty)
  const parsedMortgageTerm = parseFloat(mortgageTerm)

  // Ensure values are valid numbers
  if (
    isNaN(price) ||
    isNaN(monthlyRentalIncome) ||
    isNaN(setupFees) ||
    isNaN(parsedStampDuty) ||
    isNaN(parsedMortgageTerm)
  ) {
    return NaN
  }

  const grossRent = monthlyRentalIncome * 12

  // Distribute setup fees and stamp duty over the mortgage term
  const yearlySetupFees = setupFees / parsedMortgageTerm
  const yearlyStampDuty = parsedStampDuty / parsedMortgageTerm
  const yearlyAmortizedCosts = yearlySetupFees + yearlyStampDuty

  // Calculate 50% of gross rent as operating expenses
  const estimatedOperatingExpenses = grossRent * 0.5 + yearlyAmortizedCosts

  // Calculate the annual mortgage principal and interest
  const monthlyMortgage = calculateMonthlyMortgage(property)
  const annualMortgagePAndI = monthlyMortgage * 12

  // Calculate net cash flow
  const netCashFlow =
    grossRent - estimatedOperatingExpenses - annualMortgagePAndI

  return netCashFlow
}

const calculateProfitAfterExpenses = (property, mortgageTerm, stampDuty) => {
  const yearlyCashFlow = calculateCashFlow(property, mortgageTerm, stampDuty)
  const monthlyCashFlow = yearlyCashFlow / 12

  const monthlyMortgage = calculateMonthlyMortgage(property)
  const monthlyProfitAfterExpenses = monthlyCashFlow - monthlyMortgage

  // Distribute setup fees over the mortgage term
  const monthlySetupFee =
    parseFloat(property.setupFees) / (parseFloat(mortgageTerm) * 12)
  const adjustedMonthlyProfitAfterExpenses =
    monthlyProfitAfterExpenses - monthlySetupFee
  const adjustedYearlyProfitAfterExpenses =
    adjustedMonthlyProfitAfterExpenses * 12

  const totalInvestment =
    parseFloat(property.deposit) +
    parseFloat(property.monthlyOperatingCosts) * 12 * parseFloat(mortgageTerm) +
    parseFloat(property.setupFees)

  const totalProfitAfterSetupFees =
    adjustedYearlyProfitAfterExpenses * parseFloat(mortgageTerm)
  const totalProfitAfterSetupFeesAndStampDuty =
    totalProfitAfterSetupFees - parseFloat(stampDuty)
  const annualProfitPercentage =
    (adjustedYearlyProfitAfterExpenses / totalInvestment) * 100

  return {
    totalInvestment,
    monthly: adjustedMonthlyProfitAfterExpenses,
    yearly: adjustedYearlyProfitAfterExpenses,
    annualProfitPercentage: annualProfitPercentage.toFixed(2) + '%',
    totalProfitAfterSetupFees: totalProfitAfterSetupFees.toFixed(2),
    totalProfitAfterSetupFeesAndStampDuty:
      totalProfitAfterSetupFeesAndStampDuty.toFixed(2),
  }
}

const calculateLTV = (property) => (property.loan / property.price) * 100

const calculateAverageAnnualROI = (
  property,
  ownershipDurationInYears,
  stampDuty,
) => {
  const annualNetProfit =
    calculateCashFlow(property, ownershipDurationInYears, stampDuty) -
    property.loanInterest * property.loan
  const totalInvestment =
    property.price -
    property.loan +
    property.deposit +
    property.monthlyOperatingCosts * ownershipDurationInYears

  if (totalInvestment === 0 || ownershipDurationInYears === 0) {
    return 0
  }

  return ((annualNetProfit / totalInvestment) * 100) / ownershipDurationInYears
}

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
    const annualRentalIncome = property.monthlyRentalIncome * 12
    const rentalYield = (annualRentalIncome / property.price) * 100
    const monthlyRentalIncome = `£${parseInt(property.monthlyRentalIncome).toLocaleString()}`
    const loan = `£${parseInt(property.loan).toLocaleString()}`
    const deposit = `£${parseInt(property.deposit).toLocaleString()}`
    const monthlyOperatingCosts = `£${property.monthlyOperatingCosts.toLocaleString()}`
    const ltv = calculateLTV(property)
    const monthlyMortgage = calculateMonthlyMortgage(property)
    // const cashFlow = calculateCashFlow(
    //   property,
    //   property.mortgageTerm,
    //   stampDuty.STAMP_DUTY_TO_PAY,
    // )



    // const {
    //   monthly: profitAfterExpensesMonthly,
    //   yearly: profitAfterExpensesYearly,
    //   annualProfitPercentage,
    //   totalInvestment,
    //   totalProfitAfterSetupFees,
    //   totalProfitAfterSetupFeesAndStampDuty,
    // } = calculateProfitAfterExpenses(
    //   property,
    //   parseInt(property.mortgageTerm, 10),
    //   stampDuty.STAMP_DUTY_TO_PAY,
    // )

    // const averageAnnualROI = calculateAverageAnnualROI(
    //   property,
    //   property.mortgageTerm,
    //   stampDuty.STAMP_DUTY_TO_PAY,
    // )
    const coverage = covers125PercentOfMortgage(
      property.monthlyRentalIncome,
      monthlyMortgage,
    )
    return {
      ...property,
      // annualRentalIncome: `£${annualRentalIncome.toLocaleString()}`,
      // rentalYield: rentalYield.toFixed(1),
      // cashFlow,
      // monthlyMortgage,
      // profitAfterExpensesMonthly,
      // profitAfterExpensesYearly: `£${profitAfterExpensesYearly.toLocaleString()}`,
      // annualProfitPercentage,
      // ltv,
      // coverage,
      // // stampDuty,
      // loan: `£${parseInt(property.loan).toLocaleString()}`,
      // deposit: `£${parseInt(property.deposit).toLocaleString()}`,
      // monthlyRentalIncome: `£${parseInt(property.monthlyRentalIncome).toLocaleString()}`,
      // averageAnnualROI,
      // monthlyCashFlow: `£${Math.floor(cashFlow / 12).toLocaleString()}`, // Monthly Cash Flow
      // yearlyCashFlow: `£${Math.floor(cashFlow).toLocaleString()}`, // Yearly Cash Flow
      // totalInvestment: totalInvestment,
      // // price: `£${property.price.toLocaleString()}`,

      //
      // yearlyOperatingCosts: `£${property.yearlyOperatingCosts.toLocaleString()}`,
      // totalProfitAfterSetupFees: `£${totalProfitAfterSetupFees.toLocaleString()}`,
      // totalProfitAfterSetupFeesAndStampDuty: `£${totalProfitAfterSetupFeesAndStampDuty.toLocaleString()}`,

      stampDuty,
      price: `£${property.price.toLocaleString()}`,
      ltv,
      annualRentalIncome: `£${annualRentalIncome.toLocaleString()}`,
      rentalYield: rentalYield.toFixed(1),
      loan,
      deposit,
      monthlyMortgage,
      coverage,
      monthlyRentalIncome,
      monthlyOperatingCosts,

      cashFlow: '',
      profitAfterExpensesMonthly: '',
      profitAfterExpensesYearly: '',
      annualProfitPercentage: '',

      averageAnnualROI: '',
      monthlyCashFlow: '',
      yearlyCashFlow: '',
      totalInvestment: '',

      yearlyOperatingCosts: '',
      totalProfitAfterSetupFees: '',
      totalProfitAfterSetupFeesAndStampDuty: '',
    }
  })
}
