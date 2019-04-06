const Alexa = require('ask-sdk-core');

var SKILL_NAME = "student directory";

const office_names = ['ASAP office',
                      'bursar office',
                      'osa office',
                      'admissions office',
                      'professor Azhar office'];

const office_location = ['Murray Building. in room . m. one four zero zero',
                         'Main Building. in room . s. three three zero',
                         'Main Building. in room . s. two three zero',
                         'Main Building. in room . s. three one zero',
                         'FitterMan Building. in room. f. zero nine three zero. l'];

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Welcome to the BMCC Directory, you can say, find where the ASAP Office is?';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Prompt', speechText)
      .getResponse();
  }
};

const OfficeIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'findOffice'
      && handlerInput.requestEnvelope.request.intent.slots.offices.value;
  },
  handle(handlerInput) {
    var office_value = handlerInput.requestEnvelope.request.intent.slots.offices.value;

    var speechText = 'I do not have that office in my records';

    for(var i = 0; i < office_names.length; i++)
    {
      if (office_value === office_names[i])
      {
        speechText = 'The ' + office_value + ', is located at the, ' + office_location[i];
      }
    }

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt("If that would be all, I will end the session, now, Bye bye")
      .getResponse();
  }
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can ask, where is the ASAP office?';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard(SKILL_NAME, speechText)
      .getResponse();
  }
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(SKILL_NAME, speechText)
      .getResponse();
  }
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    //any cleanup logic goes here
    return handlerInput.responseBuilder.getResponse();
  }
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the request. Please say again.')
      .reprompt('Sorry, I can\'t understand the request. Please say again.')
      .getResponse();
  },
};

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    OfficeIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler)
  .addErrorHandlers(ErrorHandler)
  .lambda();
