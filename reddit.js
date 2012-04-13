Reddit = new Meteor.Collection("reddit");

JSON.stringify = JSON.stringify || function (obj) {
    var t = typeof (obj);
    if (t != "object" || obj === null) {
        // simple data type
        if (t == "string") obj = '"'+obj+'"';
        return String(obj);
    }
    else {
        // recurse array or object
        var n, v, json = [], arr = (obj && obj.constructor == Array);
        for (n in obj) {
            v = obj[n]; t = typeof(v);
            if (t == "string") v = '"'+v+'"';
            else if (t == "object" && v !== null) v = JSON.stringify(v);
            json.push((arr ? "" : '"' + n + '":') + String(v));
        }
        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    }
};


if (Meteor.is_client) {
  var update = function(data){
    if(Reddit.find().count() == 0){
      Reddit.insert({reddit: data, item: "1"})
    } else {
      // Reddit.update({item:"1"}, {reddit: data})
      Reddit.remove({item: "1"})
      Reddit.insert({reddit: data, item: "1"})
    }
  }

    Meteor.setInterval(function(){
      $.ajax({
             url: "http://www.reddit.com/.json",
             type: "GET",
             dataType: "jsonp",
             success: function(data){
               update(data);
             },
             async: false,
             jsonp: 'jsonp'
         });
    }, 2000)   
  
  Template.reddit.links = function () {
    r = Reddit.find({item: "1"});
    var data;
    var links = new Array();
    
    //why doesn't fetch work?
    r.forEach(function(reddit){
      data = reddit['reddit']['data']['children']
      for(d in data){
        data[d]['data']['created_utc'] = moment(data[d]['data']['created_utc'] * 1000).fromNow();  
        links.push(data[d]['data']);
      }
    })

    return links
  };
}

if (Meteor.is_server) {
  var connected = 0;
  Meteor.startup(function () {
  });

  // var request = __meteor_bootstrap__.require('request');
  // var http = __meteor_bootstrap__.require('http');
  // var jsdom = __meteor_bootstrap__.require('jsdom');
    
  // Meteor.setInterval(function(){
    // var options = {
    //   host: 'www.reddit.com',
    //   path: '/.json',
    //   headers: {
    //     'User-Agent': 'titmonkey smcgee'
    //   }
    // };
    // 
    // callback = function(response) {
    //   var str = '';
    //   response.on('data', function (chunk) {
    //     str += chunk;
    //   });
    //   response.on('end', function () {
    //     // console.log(str);
    //     update(str);
    //   });
    // }
    // 
    // http.request(options, callback).end();    
    
    // request('http://www.reddit.com/.json', function (error, response, body) {
    //   if (!error && response.statusCode == 200) {
    //     if(Reddit.find().count() === 0){
    //       // Reddit.insert({reddit: body})
    //       update(body)
    //     }
    //   }
    // })    

  // }, 2000)
}