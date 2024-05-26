export type Root = CalculatedPropertyResults[]

export interface CalculatedPropertyResults {
  annualRentalIncome: number
  rentalYield: string
  cashFlow: number
  monthlyMortgage: number
  profitAfterExpensesMonthly: number
  profitAfterExpensesYearly: number
  annualProfitPercentage: string
  ltv: number
  averageAnnualROI: number
  monthlyCashFlow: number
  yearlyCashFlow: number
  stampDuty: StampDuty
  totalInvestment: number
  price: string
  displayAddress: string
  propertyType: string
  images: Image[]
  url: string
  id: string
  deposit: string
  monthlyOperatingCosts: string
  monthlyRentalIncome: string
  loanInterest: string
  repaymentPeriod: string
  repaymentType: string
  mortgageTerm: number
  loan: number
}

export interface StampDuty {
  STAMP_DUTY_TO_PAY: number
  Effective_Rate: string
  TAXABLE_SUM: string
  Band_Taxes: BandTax[]
}

export interface BandTax {
  band: string
  tax: string
}

export interface Image {
  url: string
  caption: any
  resizedImageUrls: ResizedImageUrls
}

export interface ResizedImageUrls {
  size135x100: string
  size476x317: string
  size656x437: string
}

export type Response = {
  displayAddress: string
  price: string
  propertyType: string
  url: string
  images: images[]
  annualServiceCharge?: number
  annualGroundRent?: number
}
export type images = {
  url: string
}

export enum InputNodes {
  Numeric = 'numeric',
  Text = 'text',
}

export type FinanceDetails = {
  id: string
  deposit: string
  monthlyRentalIncome: string
  // monthlyOperatingCosts: string
  loanInterest: string
  repaymentPeriod: string
  repaymentType: string
  mortgageTerm: string
}

export type Property = Response & FinanceDetails
