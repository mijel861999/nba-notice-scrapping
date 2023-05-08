import { chromium } from "playwright";
import fs from "fs";

async function getNoticesFromGoogle() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://www.nba.com/news");

  await page.waitForLoadState("networkidle");

  const screenshot = await page.screenshot();
  fs.writeFileSync("screenshotNba.png", screenshot);

  const listadoNoticasNba = await page.evaluate(() => {
    console.log("Listado");
    let resultados = [];

    document
      .querySelectorAll(
        "div.ArticleTile_tile__y70gI article div.ArticleTile_tileMain__cXeUE div.ArticleTile_tileMainContent__c_bU1 a header"
      )
      .forEach((header, index) => {
        const title = header.querySelector(
          ".MultiLineEllipsis_ellipsis___1H7z"
        ).textContent;

        const noticeContent = header.querySelector(
          ".MultiLineEllipsis_ellipsis___1H7z"
        ).textContent;

        resultados.push({
          id: index,
          title,
          noticeContent,
        });
      });
    return resultados;
  });

  console.log(listadoNoticasNba);

  await browser.close();
  return listadoNoticasNba;
}

getNoticesFromGoogle();