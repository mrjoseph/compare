const puppeteer = require('puppeteer');

import type { NextApiRequest, NextApiResponse } from 'next'
 
type ResponseData = {
  pageTitle: string
}
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
    console.log(req.query.url)
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.rightmove.co.uk/properties/137808983#/?channel=RES_BUY');
    const title = await page.title();
    console.log('Page title:', title);

    await browser.close();
    res.status(200).json({ pageTitle: title })

}