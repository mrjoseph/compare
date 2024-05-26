import chromium from '@sparticuz/chromium'
import puppeteer from 'puppeteer-core'

import type { NextApiRequest, NextApiResponse } from 'next'

chromium.setHeadlessMode = true
chromium.setGraphicsMode = false

type images = {
  url: string
}
type ResponseData = {
  price?: string
  displayAddress?: string
  propertyType?: string
  images?: images[]
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
      executablePath: process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath('/var/task/node_modules/@sparticuz/chromium/bin')),
    })

    
    const page = await browser.newPage()
    await page.goto(req.query.url)

    const pageModel = await page.evaluate(() => {
      // @ts-ignore
      return window.PAGE_MODEL
    })

    const {
      analyticsInfo: { analyticsProperty },
      propertyData: {
        address: { displayAddress },
        images,
      },
    } = pageModel

    const { price, propertyType } = analyticsProperty
    await browser.close()
    res.status(200).json({ price, displayAddress, propertyType, images })
  } catch (error) {
    console.error('Error scraping property:', error)
    res.status(500).json({
      error: {
        message: `'Error scraping property:', ${error}`,
      },
    })
  }
}
