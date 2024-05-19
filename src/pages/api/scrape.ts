const puppeteer = require('puppeteer')

import type { NextApiRequest, NextApiResponse } from 'next'
type images = {
  url: string
}
type ResponseData = {
  price: string
  displayAddress: string
  propertyType: string
  images: images[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const browser = await puppeteer.launch()
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
}
