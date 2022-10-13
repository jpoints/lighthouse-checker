const fs = require('fs');
const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const {URL} = require('url');

if (!fs.existsSync('./report')){
  fs.mkdirSync('./report');
}

let pages = [
  {url:'https://dequeuniversity.com/demo/mars/',filename:"case1"},
  {url:'https://moderncampus.com',filename:"case2"},
  {url:'https://moderncampus.com/products/web-content-management.html',filename:"case4"},
  {url:'https://moderncampus.com/about/leadership-bios.html',filename:"case5"},
  {url:'https://moderncampus.com/about/diversity-equity-inclusion.html',filename:"case6"},
  {url:'https://moderncampus.com/blog/index.html',filename:"case7"},
  {url:'https://moderncampus.com/why-modern-campus.html',filename:"case3"}
]

runnerOne(pages);

//running multiple lighhouse checks at the same time does not work. We may need to run a sperate nodes for paralle checks
//runnerAll(pages);


async function runnerOne(){
  for (let page of pages){
      console.log(page);
      await lighthouseRunner(page.url,page.filename,"json");
      console.log("--done--", page.url , );
  }
}

//this will test all the pages at the same time
//would need a queue for this to be a reasonable approach
async function runnerAll(){
  for (let page of pages){
      console.log(page);
      lighthouseRunner(page.url,page.filename);
      console.log("--done--", page.url);
  }
}

//output is the format of the report, it can be html or json
async function lighthouseRunner(url,report,output="html"){
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setBypassCSP(true);

  const light_report = await lighthouse(url, {
    port: (new URL(browser.wsEndpoint())).port,
    output: output,
    logLevel: '',//info
    onlyCategories: ['accessibility']
  });

  fs.writeFileSync(`./report/${report}.${output}`, light_report.report);

  await browser.close();
};