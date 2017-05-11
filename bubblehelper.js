'use strict'
var _ = require("lodash");
var requestPromise = require("request-promise");
var ENDPOINT = 'Endpoint to your webservice';

function BubbleHelper() {
}

BubbleHelper.prototype.getPlayingNow = function(channelName) {
 var options = {
   method: 'GET',
   uri: ENDPOINT + channelName,
   json: true
  };
 return requestPromise(options);
};

BubbleHelper.prototype.getBestMovieNow = function() {
 var options = {
   method: 'GET',
   uri: ENDPOINT + 'bestmovie',
   json: true
  };
 return requestPromise(options);
};

BubbleHelper.prototype.formatPlayingNow = function(playingNowObject) {
 if(playingNowObject.status === "1") {
  var template = _.template("${channelname} is currently showing ${programname}. " + "This is a ${language} ${category} of ${genre} genre. ");
  return template({
   channelname: playingNowObject.channelName,
   programname: playingNowObject.ProgramName,
   language: playingNowObject.language,
   category: playingNowObject.category,
   genre: playingNowObject.genre
  });
 } else {
  var template = _.template("I cannot find any information for this channel. Is this the correct name?. ");
  return template({
   channelname: playingNowObject.channelName
  });
 }
};

BubbleHelper.prototype.formatBestMovieNow = function(playingNowObject) {
 if(playingNowObject.status === "1") {
  var template = _.template("${programname} is currently coming on ${channelname}. " + "This is a ${language} ${category} of ${genre} genre. The IMDB rating is ${rating}. ");
  return template({   
   programname: playingNowObject.ProgramName,
   channelname: playingNowObject.channelName,
   language: playingNowObject.language,
   category: playingNowObject.category,
   genre: playingNowObject.genre,
   rating: playingNowObject.rating
  });
 } else {  
  var prompt = "I am having trouble finding the best movie right now. Tell me a channel name in your mind. "
  return prompt;  
 }
};


BubbleHelper.prototype.getChannelName = function(playingNowObject) {
 if(playingNowObject.status === "1") {
  return playingNowObject.channelName;
 } else {
  return "";
 }
};

BubbleHelper.prototype.getProgramName = function(playingNowObject) {
 if(playingNowObject.status === "1") {
  return playingNowObject.ProgramName;
 } else {
  return "";
 }
};

BubbleHelper.prototype.getProgramSynopsis = function(playingNowObject) {
 if(playingNowObject.status === "1") {
  return playingNowObject.synopsis;
 } else {
  return "";
 }
};

BubbleHelper.prototype.getProgramRating = function(playingNowObject) {
 if(playingNowObject.status === "1") {
  return playingNowObject.rating;
 } else {
  return "";
 }
};

BubbleHelper.prototype.getProgramCategory = function(playingNowObject) {
 if(playingNowObject.status === "1") {
  return playingNowObject.category;
 } else {
  return "";
 }
};


module.exports = BubbleHelper;
