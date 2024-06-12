import { parse } from 'path'
import { v4 as uuidv4 } from 'uuid'

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

const calculateCashFlow = (property) => {
  const rentalYield =
    property.price > 0
      ? (property.monthlyRentalIncome * 12) / property.price
      : 0
  const operatingExpenses =
    property.monthlyOperatingCosts + property.loanInterest
  return rentalYield * property.price - operatingExpenses
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

const calculateProfitAfterExpenses = (property, mortgageTerm, stampDuty) => {
  const monthlyCashFlow = calculateCashFlow(property) / 12
  const monthlyMortgage = calculateMonthlyMortgage(property)
  const monthlyProfitAfterExpenses = monthlyCashFlow - monthlyMortgage

  // Distribute setup fees over the mortgage term
  const monthlySetupFee = parseFloat(property.setupFees) / (mortgageTerm * 12)
  const yearlySetupFee = parseFloat(property.setupFees) / mortgageTerm
  console.log(monthlySetupFee)
  // Add setup fees to monthly and yearly profit
  const adjustedMonthlyProfitAfterExpenses =
    monthlyProfitAfterExpenses - monthlySetupFee
  const adjustedYearlyProfitAfterExpenses =
    adjustedMonthlyProfitAfterExpenses * 12

  const totalInvestment =
    parseFloat(property.deposit) +
    parseFloat(property.monthlyOperatingCosts) * 12 * mortgageTerm +
    parseFloat(property.setupFees) // Include setup fees in total investment

  const totalProfitAfterSetupFees =
    adjustedYearlyProfitAfterExpenses * mortgageTerm // Calculate total profit after setup fees over the mortgage term

  const annualProfitPercentage =
    (adjustedYearlyProfitAfterExpenses / totalInvestment) * 100

  return {
    totalInvestment,
    monthly: adjustedMonthlyProfitAfterExpenses,
    yearly: adjustedYearlyProfitAfterExpenses,
    annualProfitPercentage: annualProfitPercentage.toFixed(2) + '%',
    totalProfitAfterSetupFees: totalProfitAfterSetupFees.toFixed(2),
  }
}

const calculateLTV = (property) => (property.loan / property.price) * 100

const calculateAverageAnnualROI = (property, ownershipDurationInYears) => {
  const annualNetProfit =
    calculateCashFlow(property) - property.loanInterest * property.loan
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
    property.loan = property.price - property.deposit

    property.yearlyOperatingCosts =
      property.annualServiceCharge + property.annualGroundRent
    property.monthlyOperatingCosts = Math.round(
      property.yearlyOperatingCosts / 12,
    )
    const annualRentalIncome = property.monthlyRentalIncome * 12
    const rentalYield =
      calculateCashFlow(property) > 0
        ? (annualRentalIncome / property.price) * 100
        : 0
    const cashFlow = calculateCashFlow(property)
    const monthlyMortgage = calculateMonthlyMortgage(property)
    const stampDuty = calculateStampDuty(property.price)
    const {
      monthly: profitAfterExpensesMonthly,
      yearly: profitAfterExpensesYearly,
      annualProfitPercentage,
      totalInvestment,
      totalProfitAfterSetupFees,
    } = calculateProfitAfterExpenses(
      property,
      parseInt(property.mortgageTerm, 10),
      stampDuty.STAMP_DUTY_TO_PAY,
    )
    const ltv = calculateLTV(property)
    const averageAnnualROI = calculateAverageAnnualROI(
      property,
      property.mortgageTerm,
    )
    console.log(stampDuty.STAMP_DUTY_TO_PAY)
    return {
      id: uuidv4(),
      ...property,
      annualRentalIncome: `£${annualRentalIncome.toLocaleString()}`,
      rentalYield: rentalYield.toFixed(1),
      cashFlow,
      monthlyMortgage,
      profitAfterExpensesMonthly,
      profitAfterExpensesYearly: `£${profitAfterExpensesYearly.toLocaleString()}`,
      annualProfitPercentage,
      ltv,
      averageAnnualROI,
      monthlyCashFlow: `£${Math.floor(cashFlow / 12).toLocaleString()}`, // Monthly Cash Flow
      yearlyCashFlow: `£${Math.floor(cashFlow).toLocaleString()}`, // Yearly Cash Flow
      stampDuty,
      totalInvestment: totalInvestment + stampDuty.STAMP_DUTY_TO_PAY,
      price: `£${property.price.toLocaleString()}`,
      monthlyRentalIncome: `£${parseInt(property.monthlyRentalIncome).toLocaleString()}`,
      deposit: `£${parseInt(property.deposit).toLocaleString()}`,
      loan: `£${parseInt(property.loan).toLocaleString()}`,
      coverage: covers125PercentOfMortgage(
        property.monthlyRentalIncome,
        monthlyMortgage,
      ),
      monthlyOperatingCosts: `£${property.monthlyOperatingCosts.toLocaleString()}`,
      yearlyOperatingCosts: `£${property.yearlyOperatingCosts.toLocaleString()}`,
      totalProfitAfterSetupFees: `£${totalProfitAfterSetupFees.toLocaleString()}`,
    }
  })
}
