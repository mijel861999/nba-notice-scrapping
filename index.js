import { chromium } from "playwright";
import connection from "./db.js";
import fs from "fs";

const linkNoticiasNba = "https://www.nba.com/news"

function storeNoticesInDatabase(listado) {
  console.log(listado)
  listado.forEach((resultado) => {
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
}

async function getNoticesFromGoogle(browser) {
  const page = await browser.newPage();

  await page.goto(linkNoticiasNba);

  await page.waitForLoadState("networkidle");

  const screenshot = await page.screenshot();
  fs.writeFileSync("screenshotNba.png", screenshot);

  const listadoNoticasNba = await page.evaluate(() => {
    let resultados = [];

    document
      .querySelectorAll(
        "div.ArticleTile_tile__y70gI article div.ArticleTile_tileMain__cXeUE div.ArticleTile_tileMainContent__c_bU1 a"
      )
      .forEach((header, index) => {
        const enlace = header.getAttribute("href")

        const title = header.querySelector(
          "header .MultiLineEllipsis_ellipsis___1H7z"
        ).textContent;

        const noticeContent = header.querySelector(
          "header .MultiLineEllipsis_ellipsis___1H7z"
        ).textContent;

        const fecha = new Date();

        resultados.push({
          id: index,
          title,
          noticeContent,
          link: enlace,
          createAt: fecha,
        });
      });

    return resultados;
  });

  return listadoNoticasNba;
}

async function getNoticesWithContent (browser, noticia) {
  console.log("Obtener contenido de: " + noticia.title)
  const page = await browser.newPage();
     
  await page.goto(linkNoticiasNba + noticia.link)
  await page.waitForLoadState("networkidle")

  const screenshot = await page.screenshot();
  console.log("Haciendo screenshot de esta noticia")
  fs.writeFileSync(`noticia${index}.png`, screenshot);

  /*const contenido = await page.evaluate(() => {
      return "Este es el contenido nuevo"
  })
  */

  return {
    ...noticia,
    content: "Este es el nuevo contenido"
  }
}

async function index() {
  const browser = await chromium.launch({ headless: false});

  const listadoNoticiasNba = await getNoticesFromGoogle(browser);

  listadoNoticiasNba.forEach(noticia => {
    console.log(noticia)
    getNoticesWithContent(browser, noticia)
  })
}

index()

