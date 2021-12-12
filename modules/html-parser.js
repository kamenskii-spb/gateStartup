const puppeteer = require("puppeteer")
const axios = require("axios")
const HTMLParser = require("node-html-parser")
// const request = require("request")

const fetchActiveStartaps = async () => {
  const URL = "https://www.gate.io/startup"
  return await axios.get(URL).then((response) => {
    if (response.status !== 200) return

    const html = response.data
    const root = HTMLParser.parse(html)
    const data = []
    const items = root.querySelectorAll(".effective-startup-item")

    for (let item of items) {
      const init = item
        .querySelector(".title-tip-box")
        .textContent.replace(/\s+/g, " ")
        .trim()
      //  const freeBoxInfo = item.querySelector('.freeBoxInfo').textContent.trim()
      const link = item.querySelector(".to-startup-detail").getAttribute("href")

         const name = item.querySelector("h3").textContent.split(" ").pop()

        
              


      const title = `New startup! <a href="https://www.gate.io${link}"> ${name.trim()}</a>\n${init} `
      const src = item.querySelector(".item-img").getAttribute("src")
      data.push({ title, src, name })
    }

    return data
  })
}

const fetchNewlisted = async () => {

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })
    const page = await browser.newPage();

   // await page.setDefaultNavigationTimeout(0)
    await page.goto("https://www.gate.io/marketlist?tab=newlisted", {
      timeout: 120000,
      waitUntil: "networkidle0",
    });


const root = HTMLParser.parse(
  await page.$eval("#list_tbody", (e) => e.outerHTML)
)
   //  const $startups = root.querySelectorAll(".cname")
   const $startups = root.querySelectorAll("tr")


  const startups = []
  for( let startup of $startups){
   const name = startup.querySelector(".curr_a")
   const date = startup.querySelector(".remain-date-container")
    
    
   if (name && date) {

  const str =  date.firstChild.textContent.trim()
  const [ day, n, time ] = str.split(' ')
     startups.push({
       name: name.textContent.trim(),
       time,
     })
   }
 
  }

    return startups
}





module.exports = { fetchActiveStartaps, fetchNewlisted }
