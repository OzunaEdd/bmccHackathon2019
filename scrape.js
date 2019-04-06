
const request = require('request');
const cheerio = require('cheerio');
var departmentsNames = new Array();
var departmentsRooms = new Array();
function getEvents(callBack){
request('https://www.bmcc.cuny.edu/directory/?all-departments', (error, response,html)=>{
  if(!error && response.statusCode == 200){
    const $ = cheerio.load(html);
    /*const eventsMonths = $('.tribe-events-list-separator-month');
    const eventsName = $('.tribe-event-url');
    const eventsDate = $('.tribe-event-date-start');
    const eventsAddress = $('.tribe-street-address');
    */

  $('.deparment-list-entry').each((i,el)=>{
      const item = $(el).children().first().text().replace(/\s\s+/g, '').replace("/",'').replace("\'",'');
      departmentsNames.push(item);
    })
    $('.deparment-list-entry').each((i,el)=>{
      const item = $(el).children().last().text().replace(/\s\s+/g, '');
      departmentsRooms.push(item);
    })
    callBack(departmentsNames);
  }
});
}
getEvents(function(departmentsNames){
  console.log(departmentsNames);
});
