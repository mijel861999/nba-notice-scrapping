import { chromium } from "playwright";
import connection from "./db.js";
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

        const fecha = new Date();

        resultados.push({
          id: index,
          title,
          noticeContent,
          createAt: fecha,
        });
      });

    return resultados;
  });

  console.log(listadoNoticasNba);

  listadoNoticasNba.forEach((resultado) => {
    const sql =
      "INSERT INTO notice (title, description, content, createAt) VALUES (?, ?, ?, ?)";
    const valores = [
      resultado.title,
      resultado.noticeContent,
      "Contenido de la noticia",
      resultado.createAt,
    ];
    connection.execute(sql, valores, (err, resultado) => {
      if (err) {
        console.error("Error al insertar el registro: " + err.stack);
        return;
      }
      console.log("Registro insertado correctamente.");
    });
  });

  await browser.close();
  return listadoNoticasNba;
}

getNoticesFromGoogle();
