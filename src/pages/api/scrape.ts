import chromium from '@sparticuz/chromium'
import puppeteer from 'puppeteer-core'

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
  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(
        '/var/task/node_modules/@sparticuz/chromium/bin',
      ),
    })

    const page = await browser.newPage()
    await page.goto(req.query.url as string)

    const pageModel = await page.evaluate(() => {
      // @ts-ignore
      return window.PAGE_MODEL
    })

    const {
      analyticsInfo: { analyticsProperty },
      propertyData: {
        address: { displayAddress },
        images,
        annualServiceCharge,
        annualGroundRent,
      },
    } = pageModel

    const { price, propertyType } = analyticsProperty
    await browser.close()
    res.status(200).json({
      price,
      displayAddress,
      propertyType,
      images,
      annualServiceCharge: annualServiceCharge ? annualServiceCharge : 0,
      annualGroundRent: annualGroundRent ? annualGroundRent : 0,
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
