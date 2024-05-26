const chromium = require('chrome-aws-lambda')
const puppeteer = require('puppeteer-core')
require('dotenv').config()
import type { NextApiRequest, NextApiResponse } from 'next'
type images = {
  url: string
}
type ResponseData = {
  price?: string
  displayAddress?: string
  propertyType?: string
  images?: images[]
  annualServiceCharge?: number
  annualGroundRent?: number
  error?:
    | {
        message: string
      }
    | undefined
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  let browser

  console.log(process.env.CHROME_EXECUTABLE_PATH)
  try {
    const executablePath =
      process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath)
    console.log('Using Chrome executable:', executablePath)
    browser = await puppeteer.launch({
      args: [
        ...chromium.args,
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
    })
    console.log('Browser launched')
    const page = await browser.newPage()
    console.log('New page created')
    await page.setCacheEnabled(false)
    page.setDefaultNavigationTimeout(60000)
    page.setDefaultTimeout(60000)
    await page.goto(req.query.url, {
      waitUntil: 'networkidle2',
      timeout: 60000,
      ignoreHTTPSErrors: true,
    })
    console.log('Page loaded')
    await page.waitForSelector('body')
    const pageModel = await page.evaluate(() => {
      // @ts-ignore
      return window.PAGE_MODEL
    })
    console.log('Body element found')
    const {
      analyticsInfo: { analyticsProperty },
      propertyData: {
        address: { displayAddress },
        images,
        livingCosts: { annualServiceCharge, annualGroundRent },
      },
    } = pageModel

    const { price, propertyType } = analyticsProperty
    await browser.close()
    console.log('Browser closed')
    res.status(200).json({
      price,
      displayAddress,
      propertyType,
      images,
      annualServiceCharge,
      annualGroundRent,
    })
  } catch (error) {
    console.error('Error scraping property:', error)
    res.status(500).json({
      error: {
        message: `'Error scraping property:', ${error}`,
      },
    })
  }
}
