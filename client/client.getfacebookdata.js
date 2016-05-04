var express = require('express');
var Promise = require("bluebird");
var rp = require('request-promise');


function calculateStarttimeDifference(currentTime, dataString) {
  return (new Date(dataString).getTime()-(currentTime*1000))/1000;
}

function compareVenue(a,b) {
  if (a.venueName < b.venueName)
    return -1;
  if (a.venueName > b.venueName)
    return 1;
  return 0;
}

function compareTimeFromNow(a,b) {
  if (a.eventTimeFromNow < b.eventTimeFromNow)
    return -1;
  if (a.eventTimeFromNow > b.eventTimeFromNow)
    return 1;
  return 0;
}

function compareDistance(a,b) {
  var aEventDistInt = parseInt(a.eventDistance, 10);
  var bEventDistInt = parseInt(b.eventDistance, 10);
  if (aEventDistInt < bEventDistInt)
    return -1;
  if (aEventDistInt > bEventDistInt)
    return 1;
  return 0;
}

function comparePopularity(a,b) {
  if ((a.eventStats.attendingCount + (a.eventStats.maybeCount / 2)) < (b.eventStats.attendingCount + (b.eventStats.maybeCount / 2)))
    return 1;
  if ((a.eventStats.attendingCount + (a.eventStats.maybeCount / 2)) > (b.eventStats.attendingCount + (b.eventStats.maybeCount / 2)))
    return -1;
  return 0;
}

function haversineDistance(coords1, coords2, isMiles) {

  //coordinate is [latitude, longitude]
  function toRad(x) {
    return x * Math.PI / 180;
  }

  var lon1 = coords1[1];
  var lat1 = coords1[0];

  var lon2 = coords2[1];
  var lat2 = coords2[0];

  var R = 6371; // km

  var x1 = lat2 - lat1;
  var dLat = toRad(x1);
  var x2 = lon2 - lon1;
  var dLon = toRad(x2);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;

  if(isMiles) d /= 1.60934;

  return d;
}

function getFbEvents(req, onResult) {
		
  if (!req.lat || !req.lng || !req.distance || !req.access_token) {
    //res.status(500).send({error: "Please specify the lat, lng, distance and access_token query parameters"});
	console.error({error: "Please specify the lat, lng, distance and access_token query parameters"});
	console.error("got :" + JSON.stringify(req));
  } else {

    var idLimit = 50, //FB only allows 50 ids per /?ids= call
        currentTimestamp = (new Date().getTime()/1000).toFixed(),
        venuesCount = 0,
        venuesWithEvents = 0,
        eventsCount = 0,
        placeUrl = "https://graph.facebook.com/v2.5/search?type=place&q=&center=" + req.lat + "," + req.lng + "&distance=" + req.distance + "&limit=1000&fields=id&access_token=" + req.access_token;

	//console.log( placeUrl );
		
    //Get places as specified
    rp.get(placeUrl).then(function(responseBody) {
      // console.log("[BODY] : "+ JSON.stringify(responseBody));
      var ids = [],
          tempArray = [],
          data = JSON.parse(responseBody).data;

      //Set venueCount
      venuesCount = (data)? data.length : 0;

      //Create array of 50 places each
      data.forEach(function(idObj, index, arr) {
        tempArray.push(idObj.id);
        if (tempArray.length >= idLimit) {
          ids.push(tempArray);
          tempArray = [];
        }
      });

      // Push the remaining places
      if (tempArray.length > 0) {
        ids.push(tempArray);
      }

      return ids;
    }).then(function(ids) {

      var urls = [];

      //Create a Graph API request array (promisified)
      ids.forEach(function(idArray, index, arr) {
        urls.push(rp.get("https://graph.facebook.com/v2.5/?ids=" + idArray.join(",") + "&fields=id,name,cover.fields(id,source),picture.type(large),location,events.fields(id,name,cover.fields(id,source),picture.type(large),description,start_time,attending_count,declined_count,maybe_count,noreply_count).since(" + currentTimestamp + ")&access_token=" + req.access_token));
      });

      return urls;

    }).then(function(promisifiedRequests) {

      //Run Graph API requests in parallel
      return Promise.all(promisifiedRequests)

    })
    .then(function(results){

      var events = [];

      //Handle results
      results.forEach(function(resStr, index, arr) {
        var resObj = JSON.parse(resStr);
        Object.getOwnPropertyNames(resObj).forEach(function(venueId, index, array) {
          var venue = resObj[venueId];
          if (venue.events && venue.events.data && venue.events.data.length > 0) {
            venuesWithEvents++;
            venue.events.data.forEach(function(event, index, array) {
              var eventResultObj = {};
              eventResultObj.venueId = venueId;
              eventResultObj.venueName = venue.name;
              eventResultObj.venueCoverPicture = (venue.cover ? venue.cover.source : null);
              eventResultObj.venueProfilePicture = (venue.picture ? venue.picture.data.url : null);
              eventResultObj.venueLocation = (venue.location ? venue.location : null);
              eventResultObj.eventId = event.id;
              eventResultObj.eventLink = "https://www.facebook.com/events/"+event.id+"/";
              eventResultObj.eventName = event.name;
              eventResultObj.eventCoverPicture = (event.cover ? event.cover.source : null);
              eventResultObj.eventProfilePicture = (event.picture ? event.picture.data.url : null);
              eventResultObj.eventDescription = (event.description ? event.description : null);
              eventResultObj.eventStarttime = (event.start_time ? event.start_time : null);
              eventResultObj.eventEndtime = (event.end_time ? event.end_time : null);
              eventResultObj.eventDistance = (venue.location ? (haversineDistance([venue.location.latitude, venue.location.longitude], [req.lat, req.lng], false)*1000).toFixed() : null);
              eventResultObj.eventTimeFromNow = calculateStarttimeDifference(currentTimestamp, event.start_time);
              eventResultObj.eventStats = {
                attendingCount: event.attending_count,
                declinedCount: event.declined_count,
                maybeCount: event.maybe_count,
                noreplyCount: event.noreply_count
              };
              events.push(eventResultObj);
              eventsCount++;
            });
          }
        });
      });

      //Sort if requested
      if (req.sort && (req.sort.toLowerCase() === "time" || req.sort.toLowerCase() === "distance" || req.sort.toLowerCase() === "venue" || req.sort.toLowerCase() === "popularity")) {
        if (req.sort.toLowerCase() === "time") {
          events.sort(compareTimeFromNow);
        }
        if (req.sort.toLowerCase() === "distance") {
          events.sort(compareDistance);
        }
        if (req.sort.toLowerCase() === "venue") {
          events.sort(compareVenue);
        }
        if (req.sort.toLowerCase() === "popularity") {
          events.sort(comparePopularity);
        }
      }

      //Produce result object
      //res.send({events: events, metadata: {venues: venuesCount, venuesWithEvents: venuesWithEvents, events: eventsCount}});
	  
	  var data = {events: events, metadata: {venues: venuesCount, venuesWithEvents: venuesWithEvents, events: eventsCount}};
	  
	  //console.log("Result:\n" + JSON.stringify(data));
	  onResult(data);
	  
    })
 	  .catch(function (e) {
      //res.status(500).send({error: e});
	  console.error('!! ERROR file getfacebookdata.getFbEvents ' + e);
    });   
  }

};

module.exports = getFbEvents;