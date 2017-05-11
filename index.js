'use strict';
module.change_code = 1;
var Alexa = require('alexa-app');
var skill = new Alexa.app('bubbleinfo');
var BubbleHelper = require('./bubblehelper');
var _ = require('lodash');
module.exports = skill;

var reprompt = 'I didn\'t hear a channel name. Tell me a channel name to know what shows or movies are playing right now on TV.';

var BUBBLE_SESSION_KEY = 'bubble_session';

skill.launch(function(request,response){
 var prompt = 'To know what\'s playing now on TV, tell me a channel name you are interested in';
 response.say(prompt).reprompt(reprompt).shouldEndSession(false);
});

var cancelIntentFunction = function(request,response) {
 response.say("Goodbye!").shouldEndSession(true).send();
};
skill.intent('AMAZON.StopIntent', cancelIntentFunction);
skill.intent('AMAZON.CancelIntent', cancelIntentFunction); 

skill.intent('AMAZON.HelpIntent',{},function(request,response){
 var help = 'Welcome to Bubble, ' + 'To know what\'s playing on TV, tell me a channel name.' + 'You can also ask me to read synopsis of shows or change channels for you. ' + ' You can say stop or cancel to exit anytime.';
 response.say(help).shouldEndSession(false);
});

skill.intent('readSynopsisIntent', {
  'slots': {},
  'utterances': ['{|read|tell} synopsis']
},
function(request,response) {
  var playingNowObject = request.session(BUBBLE_SESSION_KEY); 
  if(playingNowObject === undefined) {
    var prompt = 'First tell me a Channel name. I will read out the synopsis of what\'s playing now on that channel';
    response.say(prompt).reprompt(reprompt).shouldEndSession(false);
    return true;
  } else {
    var bubbleHelper = new BubbleHelper();
    var prompt = 'Here is the synopsis of ' + bubbleHelper.getProgramName(playingNowObject) + ': ';
    prompt += bubbleHelper.getProgramSynopsis(playingNowObject) + ". " ;
    response.session(BUBBLE_SESSION_KEY,playingNowObject);
    response.say(prompt).shouldEndSession(false).send();
    return false;
  }
}
);


skill.intent('ratingIntent', {
  'slots': [],
  'utterances': ['{|what|how} {|is} {|read|tell} rating']
},
function(request,response) {
  var playingNowObject = request.session(BUBBLE_SESSION_KEY); 
  if(playingNowObject === undefined) {
    var prompt = 'First tell me a Channel name. I will tell you the rating of what\'s playing now on that channel';
    response.say(prompt).reprompt(reprompt).shouldEndSession(false);
    return true;
  } else {
    var bubbleHelper = new BubbleHelper();
    var category = bubbleHelper.getProgramCategory(playingNowObject);
    if (category === "Movies") {
      var prompt = 'IMDB Rating of this movie ' + bubbleHelper.getProgramName(playingNowObject) + ' is ' + bubblehelper.getProgramRating(playingNowObject) + '. ';
      prompt += bubbleHelper.getProgramRating(playingNowObject) + ". " ;
      response.session(BUBBLE_SESSION_KEY,playingNowObject);
      response.say(prompt).shouldEndSession(false).send();
      return false;
    } else {
      var prompt = bubbleHelper.getProgramName(playingNowObject) + " is not a movie. I can only give you the IMDB rating of movies. ";
      response.session(BUBBLE_SESSION_KEY,playingNowObject);
      response.say(prompt).shouldEndSession(false).send();
      return false;
    }
  }
}
);

skill.intent('bestMovieIntent',{
  'slots' : [],
  'utterances': ['{|what|which} best movie {|playing|running|showing} {|now}']
},function(request,response){
  var bubbleHelper = new BubbleHelper();
  bubbleHelper.getBestMovieNow().then(function(playingNowObject){
   console.log(playingNowObject);
   response.session(BUBBLE_SESSION_KEY,playingNowObject);
   response.say(bubbleHelper.formatBestMovieNow(playingNowObject)).shouldEndSession(false).send();   
  }).catch(function(err){
   console.log(err.statusCode);
   var prompt = 'I can\'t find the best movie. ';
   response.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
  });
  return false;
});


skill.intent('changeChannelIntent', {
 'slots': {'CHANNELNAME': 'BUBBLECHANNELNAMES'},
 'utterances': ['change {|channel}  {-|CHANNELNAME}']
 }, 
 function(request,response){
  var channelName = request.slot('CHANNELNAME');
  var playingNowObject = request.session(BUBBLE_SESSION_KEY); 
  if(_.isEmpty(channelName)){
   if(playingNowObject === undefined) {
    var prompt = 'I didn\'t hear a Channel name. Tell me a channel name.';
    response.say(prompt).reprompt(reprompt).shouldEndSession(false);
    return true;
   } else {
    var bubbleHelper = new BubbleHelper();
    var prompt = 'Changing channel to ' + bubbleHelper.getChannelName(playingNowObject);
    response.session(BUBBLE_SESSION_KEY,playingNowObject);
    response.say(prompt).shouldEndSession(false).send();    
    return false;
   }
  } else {
   var bubbleHelper = new BubbleHelper();
   bubbleHelper.getPlayingNow(channelName).then(function(playingNowObject){
   console.log(playingNowObject);
   var prompt = 'Changing channel to ' + bubbleHelper.getChannelName(playingNowObject);
   response.session(BUBBLE_SESSION_KEY,playingNowObject);
   response.say(prompt).shouldEndSession(false).send();   
   }).catch(function(err){
    console.log(err.statusCode);
    var prompt = 'I didn\'t have data for ' + channelName;
    response.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
   });
   return false;
  }
 }
); 

skill.intent('channelInfoIntent', {
  'slots': {'CHANNELNAME': 'BUBBLECHANNELNAMES'},
  'utterances': ['{|movie|show} {|playing|running|showing} {|on|in} {-|CHANNELNAME}']
 },
 function(request,response) {
  var channelName = request.slot('CHANNELNAME');
  if(_.isEmpty(channelName)) {
   var prompt = 'I didn\'t hear a Channel name. Tell me a channel name.';
   response.say(prompt).reprompt(reprompt).shouldEndSession(false);
   return true;
  }
  var bubbleHelper = new BubbleHelper();
  bubbleHelper.getPlayingNow(channelName).then(function(playingNowObject){
   console.log(playingNowObject);
   response.session(BUBBLE_SESSION_KEY,playingNowObject);
   response.say(bubbleHelper.formatPlayingNow(playingNowObject)).shouldEndSession(false).send();   
  }).catch(function(err){
   console.log(err.statusCode);
   var prompt = 'I didn\'t have data for ' + channelName;
   response.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
  });
  return false;
 }
);


