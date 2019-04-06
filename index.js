const Alexa = require('ask-sdk-core');
const request = require('request');
const cheerio = require('cheerio');
const SKILL_NAME = "bmcchub";
// Events
let eventsMonths = new Array();
let eventsNames = new Array();
let eventsDates = new Array();
let eventsAddress = new Array();
// Offices
let departmentsNames = new Array();
let departmentsRooms = new Array();
// Events Function
let sayEvents = async function(attributes) {
   const today = new Date();
   const month = today.getMonth();
   const year = today.getDate();
   return new Promise(function(resolve) {
      let speakHall = null;
      let speechOutput = null;
      request('https://www.bmcc.cuny.edu/events/', (error, response, html) => {

         if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            $('.tribe-events-list-separator-month').each((i, el) => {
               const item = $(el).text().replace(/\s\s+/g, '');
               eventsMonths.push(item);
            });
            $('.tribe-event-url').each((i, el) => {
               const item = $(el).text().replace(/\s\s+/g, '').replace('&', 'and');
               eventsNames.push(item);
            });
            $('.tribe-event-date-start').each((i, el) => {
               const item = $(el).text().replace(/\s\s+/g, '');
               eventsDates.push(item);
            });
            $('.tribe-street-address').each((i, el) => {
               const item = $(el).text().replace(/\s\s+/g, '');
               eventsAddress.push(item);
            });

            if (eventsAddress[attributes] == "199 Chambers Street") {
               speakHall = "main building ";
            } else if (eventsAddress[attributes] == "245 Greenwich Street") {
               speakHall = "fiterman building ";
            } else if (eventsAddress[attributes] == "70 Murray Street") {
               speakHall = "murray building ";
            }

            if(attributes == 0){
               speechOutput = "There is an event, " + eventsNames[attributes] + " at " + eventsDates[attributes] + ', ' + " in the " + speakHall + "Located at " + eventsAddress[attributes] + ", Would you like to know anything else?";
            }else{
               speechOutput = "The next event is " + eventsNames[attributes] + " at " + eventsDates[attributes] + ', ' + " in the " + speakHall + "Located at " + eventsAddress[attributes] + ", Would you like to know anything else?";
            }
            resolve(speechOutput);
         }
      });
   });
};

const offices = [
      ['Academic Advisement and Transfer Center','S108'],
      ['Academic Affairs','S715'],
      ['Academic Literacy and Linguistics','N499'],
      ['Accounting','F530'],
      ['Accounts Payable','S732'],
      ['Admin and Planning Campus Facilities Office','M1106A'],
      ['Administration and Planning','S707'],
      ['Admissions','S310'],
      ['Allied Health Sciences','N799'],
      ['ASAP','M1412'],
      ['Athletics and Recreation','N255'],
      ['BMCC Association, Inc.','S230'],
      ['BMCC Express','G102'],
      ['BMCC Learning Academy','M1413'],
      ['Bookstore   Barnes and Noble','S225'],
      ['Budget  Fiscal Office','S711'],
      ['Buildings and Grounds','N194'],
      ['Bursar','S330'],
      ['Business Management','F730'],
      ['Cafeteria   MBJ Food Services','S147'],
      ['Career Development','S342'],
      ['Center for Ethnic Studies','S637'],
      ['College Discovery','S335'],
      ['Computer Information Systems','F0930'],
      ['Counseling Center','S343'],
      ['CUNY EDGE','M1216B'],
      ['CUNY Start ','M1016B'],
      ['Development','S707A'],
      ['E Learning','S510A'],
      ['Early Childhood Center','N375'],
      ['English','N751'],
      ['EveningWeekend','S715A'],
      ['Financial Aid','N365'],
      ['Health Education','N798'],
      ['Health Services','N380'],
      ['Human Resources','S717'],
      ['Information Resources and Technology','S140'],
      ['Institutional Effectiveness and Analytics','S735'],
      ['Instructional Technology','S604'],
      ['International Students','S115N'],
      ['Internships and Experiential Learning','S746A'],
      ['Learning Resource Center','S510'],
      ['Library','S410'],
      ['Mail and Messenger Services','N186'],
      ['Math Start','M1018'],
      ['Mathematics','N599'],
      ['Media Arts and Technology','S622'],
      ['Media Center','S533'],
      ['Modern Languages','S610'],
      ['Music and Art','F1130'],
      ['Nursing','S730'],
      ['Off Site','S 715A'],
      ['Office of Accessibility','N360'],
      ['Office of Sponsored Programs','S736'],
      ['Office of Student Activities','S230'],
      ['Presidents Office','S701'],
      ['Public Affairs','F1230'],
      ['Public Safety','S215'],
      ['Purchasing','S712'],
      ['Receiving and Stores','N185'],
      ['Registrar','S315'],
      ['Reprographics','S128'],
      ['Science','N699'],
      ['Single Stop','S230'],
      ['Social Sciences, Human Services and Criminal Justice','N651'],
      ['Speech, Communications and Theatre Arts','S 628'],
      ['Student Affairs','S350'],
      ['Study Abroad','S746A'],
      ['Teacher Education','S616'],
      ['Testing Office','S103'],
      ['Tribeca Performing Arts Center','S110C'],
      ['Veterans Resource Center','S1115M'],
      ['Womens Resource Center','S340'],
      ['Writing Center','S500W']
];

//console.log(offices[0][0]);

const LaunchRequestHandler = {
   canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'LaunchRequest';

   },

   handle(handlerInput) {
      // Our skill will receive a LaunchRequest when the user invokes the skill
      // with the  invocation name, but does not provide any utterance
      // mapping to an intent.
      // For Example, "Open bmcc talk"
      const speakOutput = "Welcome to bmcc hub, I am able to tell you upcoming events and department locations. What would you like to know?";

      // The response builder contains is an object that handles generating the
      // JSON response that your skill returns.
      return handlerInput.responseBuilder
         .speak(speakOutput).reprompt("Would you like to know the next event?") // The text passed to speak, is what Alexa will say.
         .getResponse();
   },
};
const EventsHandler = {
   canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
         handlerInput.requestEnvelope.request.intent.name === 'eventsIntent';
   },
   async handle(handlerInput) {
      const attributes = handlerInput.attributesManager.getSessionAttributes();
      // This is text that Alexa will speak back
      // when the user says, "Ask code academy to say hello"
      if (!attributes.counter && attributes.counter !== 0) {
         attributes.counter = 0;
      } else {
         attributes.counter = attributes.counter + 1;
      }
      const speakOutput = await sayEvents(attributes.counter);
      // The response builder contains is an object that handles generating the
      // JSON response that your skill returns.
      handlerInput.attributesManager.setSessionAttributes(attributes);
      return handlerInput.responseBuilder
         .speak(await speakOutput).withShouldEndSession(false) // The text passed to speak, is what Alexa will say.
         .getResponse();
   },
};
const ThanksHandler = {
   canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
         handlerInput.requestEnvelope.request.intent.name === 'thankIntent';
   },
   handle(handlerInput) {
      // This is text that Alexa will speak back
      // when the user says, "Ask code academy to say hello"
      const speakOutput = "Your welcome, is there anything else i could help you with";
      // The response builder contains is an object that handles generating the
      // JSON response that your skill returns.
      return handlerInput.responseBuilder
         .speak(speakOutput) // The text passed to speak, is what Alexa will say.
         .getResponse();
   },
};

const OfficeIntentHandler = {
   canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
         handlerInput.requestEnvelope.request.intent.name === 'findOffice' &&
         handlerInput.requestEnvelope.request.intent.slots.offices.value;
   },
   handle(handlerInput) {

      let office_input = handlerInput.requestEnvelope.request.intent.slots.offices.value;

      let speechText = 'I do not have that office in my records';

      if (!office_input) {
         speechText = "which department location would you like to know?";
      } else {

         for (var i = 0; i < offices.length; i++) {
            if (office_input.toLowerCase() == offices[i][0].toLowerCase()) {
               speechText = "The " + offices[i][0] + " department is located at " + offices[i][1] + ". Woud you like to know anything else?";
               }
         }
      }

      return handlerInput.responseBuilder
         .speak(speechText)
         .reprompt("which department location would you like to know?")
         .getResponse();
   }
};

const RepromptIntentHandler = {
   canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
         handlerInput.requestEnvelope.request.intent.name === 'reprompt' &&
         handlerInput.requestEnvelope.request.intent.slots.promptValue.value;
   },
   handle(handlerInput) {

      return handlerInput.responseBuilder
         .speak("Which department would you like to know?")
         .reprompt("Which department would you like to know?")
         .withSimpleCard("Which department would you like to know?")
         .getResponse();
   }
};

const HelpIntentHandler = {
   canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
         handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
   },
   handle(handlerInput) {
      const speechText = 'You can ask, for a department location or for the next event';

      return handlerInput.responseBuilder
         .speak(speechText)
         .reprompt(speechText)
         .withSimpleCard(SKILL_NAME, speechText)
         .getResponse();
   }
};

const CancelAndStopIntentHandler = {
   canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
         (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent' ||
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
   },
   handle(handlerInput) {
      const speechText = 'It was a pleasure helping you, goodbye!';

      return handlerInput.responseBuilder
         .speak(speechText)
         .withSimpleCard(SKILL_NAME, speechText)
         .getResponse();
   },
};

const SessionEndedRequestHandler = {
   canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
   },
   handle(handlerInput) {
      //any cleanup logic goes here
      return handlerInput.responseBuilder.getResponse();
   },
};




const ErrorHandler = {
   canHandle() {
      return true;
   },
   handle(handlerInput, error) {
      console.log(`Error handled: ${error.message}`);

      return handlerInput.responseBuilder
         .speak('Sorry, I can\'t understand the request. You can ask, for a department location or for the next event?.')
         .reprompt('Sorry, I can\'t understand the request. You can ask, for a department location or for the next event?.')
         .getResponse();
   },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
   .addRequestHandlers(
      LaunchRequestHandler,
      EventsHandler,
      RepromptIntentHandler,
      HelpIntentHandler,
      CancelAndStopIntentHandler,
      SessionEndedRequestHandler,
      ThanksHandler,
      OfficeIntentHandler
   )
   .addErrorHandlers(ErrorHandler)
   .lambda();
