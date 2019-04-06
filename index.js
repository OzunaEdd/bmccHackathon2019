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
            resolve("There is an event, " + eventsNames[attributes] + " at " + eventsDates[attributes] + ', ' + " in the " + speakHall + "Located at " + eventsAddress[attributes]);
         }
      });
   });
};

const office_names = ['ASAP',
   'bursar',
   'osa',
   'admissions',
   'professor Azhar'
];
const offices = [
      ['Academic Advisement and Transfer Center','S-108'],
      ['Academic Affairs','S-715'],
      ['Academic Literacy and Linguistics','N-499'],
      ['Accounting','F-530'],
      ['Accounts Payable','S-732'],
      ['Admin and Planning Campus Facilities Office','M-1106A'],
      ['Administration and Planning','S-707'],
      ['Admissions','S-310'],
      ['Allied Health Sciences','N-799'],
      ['ASAP','M-1412'],
      ['Athletics and Recreation','N-255'],
      ['BMCC Association, Inc.','S-230'],
      ['BMCC Express','G-102'],
      ['BMCC Learning Academy','M-1413'],
      ['Bookstore - Barnes and Noble','S-225'],
      ['Budget  Fiscal Office','S-711'],
      ['Buildings and Grounds','N-194'],
      ['Bursar','S-330'],
      ['Business Management','F-730'],
      ['Cafeteria - MBJ Food Services','S-147'],
      ['Career Development','S-342'],
      ['Center for Ethnic Studies','S-637'],
      ['College Discovery','S-335'],
      ['Computer Information Systems','F-0930'],
      ['Counseling Center','S-343'],
      ['CUNY EDGE','M-1216B'],
      ['CUNY Start ','M-1016B'],
      ['Development','S-707A'],
      ['E-Learning','S-510A'],
      ['Early Childhood Center','N-3,75'],
      ['English','N-751'],
      ['EveningWeekend','S-715A'],
      ['Financial Aid','N-365'],
      ['Health Education','N-798'],
      ['Health Services','N380'],
      ['Human Resources','S-717'],
      ['Information Resources and Technology','S-140'],
      ['Institutional Effectiveness and Analytics','S-735'],
      ['Instructional Technology','S-604'],
      ['International Students','S-115N'],
      ['Internships and Experiential Learning','S-746A'],
      ['Learning Resource Center','S-510'],
      ['Library','S-410'],
      ['Mail and Messenger Services','N-186'],
      ['Math Start','M-1018'],
      ['Mathematics','N-599'],
      ['Media Arts and Technology','S-622'],
      ['Media Center','S-533'],
      ['Modern Languages','S-610'],
      ['Music and Art','F-1130'],
      ['Nursing','S-730'],
      ['Off-Site','S-715A'],
      ['Office of Accessibility','N-360'],
      ['Office of Sponsored Programs','S-736'],
      ['Office of Student Activities','S-230'],
      ['Presidents Office','S-701'],
      ['Public Affairs','F-1230'],
      ['Public Safety','S-215'],
      ['Purchasing','S-712'],
      ['Receiving and Stores','N-185'],
      ['Registrar','S-315'],
      ['Reprographics','S-128'],
      ['Science','N-699'],
      ['Single Stop','S-230'],
      ['Social Sciences, Human Services and Criminal Justice','N-651'],
      ['Speech, Communications and Theatre Arts','S-628'],
      ['Student Affairs','S-350'],
      ['Study Abroad','S-746A'],
      ['Teacher Education','S-616'],
      ['Testing Office','S-103'],
      ['Tribeca Performing Arts Center','S-110C'],
      ['Veterans Resource Center','S-1115M'],
      ['Womens Resource Center','S-340'],
      ['Writing Center','S-500W']
];
console.log(offices[0][0]);
const office_location = ['Murray Building. in room . m. one four zero zero',
   'Main Building. in room . s. three three zero',
   'Main Building. in room . s. two three zero',
   'Main Building. in room . s. three one zero',
   'FitterMan Building. in room. f. zero nine three zero. l'
];

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

      var office_value = handlerInput.requestEnvelope.request.intent.slots.offices.value;
      var speechText = 'I do not have that office in my records';
      if (!office_value) {
         speechText = "which department location would you like to know?";
      } else {

         for (var i = 0; i < office_names.length; i++) {
            if (office_value === office_names[i]) {
               speechText = 'The ' + office_value + ', is located at the, ' + office_location[i];
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
