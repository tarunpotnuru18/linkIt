import { Request, Response } from "express";
import puppeteer from "puppeteer";
import { load } from "cheerio";

async function imgValidator(url: string | any) {
  if (!url) {
    return false;
  }
  const response = await fetch(url, { method: "HEAD" });
  return response.headers.get("Content-Type")?.startsWith("image/");
}
export async function linkDataLoader(req: Request, res: Response) {
  try {
    let url = req.query.url as string;

    let urlObj = new URL(url);

    if (!url) {
      res.status(400).send("URL parameter required");
      return;
    }
    console.log(urlObj.hostname);

    if (urlObj.hostname.includes("youtu.be") || url.includes("youtube.com")) {
      try {
        let data = await fetch(url);
        let html = await data.text();
        let $ = load(html);
        let title = $("meta[property='og:title']").attr("content");
        let description = $("meta[property='og:description']").attr("content");
        let image = $("meta[property='og:image']").attr("content");
        let link = $("meta[property='og:url']").attr("content");

        res.json({ title, description, image, link });
        return;
      } catch (error) {
        console.log(error);
        res.send("error while fetching youtube");
      }
    }

    let browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    try {
   
      const page = await browser.newPage();
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      );

      // Configure timeout and navigation
      await page.goto(url, {
        waitUntil: "networkidle2",
      });

      // Wait for meta tags to load

      if (
        urlObj.hostname.includes("x") ||
        urlObj.hostname.includes("twitter")
      ) {
        let previewData = await page.evaluate(() => {
          const urlGen = (url: string | undefined | null) => {
            // this function i am using because sometimes websites use image directly without https for those kind of images its better to generate url

            /* wrote this function multiple times because page.evaluate is in the browser runtime as we are creating
           multiple page.evaluate one url gen may not be avilable to other that is the reason
          */
            if (url) {
              if (url.startsWith("http")) {
                return url;
              } else {
                return new URL(url, window.location.origin).href;
              }
            }
          };
          const getMeta = (name: string) =>
            document
              .querySelector(`meta[property="${name}"], meta[name="${name}"]`)
              ?.getAttribute("content");

          return {
            title:
              getMeta("twitter:title") || getMeta("og:title") || document.title,
            description:
              getMeta("og:description") ||
              getMeta("twitter:description") ||
              getMeta("description"),
            image:
              (getMeta("twitter:image") && urlGen(getMeta("twitter:image"))) ||
              (getMeta("og:image") && urlGen(getMeta("og:image"))) ||
              (getMeta("twitter") && urlGen(getMeta("twitter"))) ||
              "",
            site_name: getMeta("og:site_name"),
            url:
              getMeta("og:url") ||
              getMeta("twitter:url") ||
              window.location.href,
            profileImg: urlGen(
              document
                .querySelector(`[data-testid ='Tweet-User-Avatar'] img`)
                ?.getAttribute("src")
            ),
          };
        });

        await page.close();
        let imageCheck = await imgValidator(previewData.image);
        if (imageCheck) {
          res.json(previewData);
        } else {
          previewData.image = "";
          res.json(previewData);
        }
        return;
      }

      const data = await page.evaluate(() => {
        const getMeta = (name: string) => {
          console.log(
            document
              .querySelector(`meta[property="${name}"], meta[name="${name}"]`)
              ?.getAttribute("content"),
            "i am from the evaluate ",
            name
          );
          return document
            .querySelector(`meta[property="${name}"], meta[name="${name}"]`)
            ?.getAttribute("content");
        };
        const urlGen = (url: string | undefined | null) => {
          console.log(url, "from the data");
          if (url) {
            if (url.startsWith("http")) {
              return url;
            } else {
              return new URL(url, window.location.origin).href;
            }
          }
        };
        return {
          title:
            getMeta("twitter:title") ||
            getMeta("og:title") ||
            getMeta("title") ||
            "",
          description:
            getMeta("og:description") ||
            getMeta("twitter:description") ||
            getMeta("description") ||
            "",
          image:
            (getMeta("twitter:image") && urlGen(getMeta("twitter:image"))) ||
            (getMeta("og:image") && urlGen(getMeta("og:image"))) ||
            (getMeta("twitter") && urlGen(getMeta("twitter"))) ||
            "",
          site_name: getMeta("og:site_name"),
          url:
            getMeta("og:url") || getMeta("twitter:url") || window.location.href,
        };
      });

      await page.close();

      let imageCheck = await imgValidator(data?.image);
      if (imageCheck) {
        res.json(data);
      } else {
        data.image = "";
        res.json(data);
      }
      return;
    } catch (error) {
      console.error(`Scrape failed for ${url}:`, error);
      res.json({
        success: false,
        data: {
          title: "",
          description: "",
          image: "",
        },
      });
    } finally {
      browser.close();
    }
  } catch (error) {
    console.log("outer catch");
    res.json({ success: false, message: "error while fetching link" });
  }
}
