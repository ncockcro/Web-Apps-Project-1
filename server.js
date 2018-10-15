
/*
-----------------------------------------------------------------------------------

Written by: Nicholas Cockcroft
Date: October 5, 2018
Assignment: Project 1

-----------------------------------------------------------------------------------
*/



var connect = require("connect");
var logger = require("morgan");
var serve_static = require("serve-static");
var http = require("http");
var ejs = require("ejs");

// Global contact array
let allContacts = new Array();
let contactCount = 0;

var app = connect()
  .use(logger('dev'))
  .use(serve_static('public'))
  .use(serve)

http.createServer(app).listen(3000);


function serve (req, res) {
	console.log("Host name:  " + req.headers.host);
	console.log("Connection:  " + req.headers.connection);
	console.log("Accept:  " + req.headers.accept);

	if(req.method=='POST')  {
		process_post(req, res);
	}
	else {
		process_get(req, res);
	}
}

function process_post(req, res) {
	var body = "";
  let contactInformation = new Array();
	req.on('data', function (chunk) {
	   	body += chunk;
	});
	req.on('end', function() {
  		qs = require('querystring');
  		var post =  qs.parse(body);

    let i = 0;
		for ( q in post ) {
      contactInformation[i] = post[q];
			console.log(q + " -> " + post[q]);
      i++;
		}

    // Once all of the information is collected in an array, put that array into
    // the array which contains all of the contacts for the contacts page
    allContacts[contactCount] = contactInformation;
    contactCount++;

    // Now cycling through the last index of the contact information and determining which check boxes they clicked
    let canContactPhone = false;
    let canContactMail = false;
    let canContactEmail = false;

    // If they only clicked one check box, the first have to check if it equals one of the words
    if(contactInformation[9] == "Any") {
      canContactPhone = true;
      canContactMail = true;
      canContactEmail = true;
    }
    else if (contactInformation[9] == "Phone") {
      canContactPhone = true;
    }
    else if (contactInformation[9] == "Mail") {
      canContactMail = true;
    }
    else if (contactInformation[9] == "Email") {
      canContactEmail = true;
    }
    // Otherwise, we will have to cycle through the last column and see which ones they clicked
    else {
      if(contactInformation[9] != undefined) {
        for(let j = 0; j < contactInformation[9].length; j++) {

          if(contactInformation[9][j] == "Any") {
            canContactPhone = true;
            canContactMail = true;
            canContactEmail = true;
          }
          if(contactInformation[9][j] == "Phone") {
            canContactPhone = true;
          }
          if(contactInformation[9][j] == "Mail") {
            canContactMail = true;
          }
          if(contactInformation[9][j] == "Email") {
            canContactEmail = true;
          }
        }
      }
    }

    // Output for the phone number
    if(canContactPhone === true) {
      if(contactInformation[7][0] != undefined) {
        let tempPhone = ("(");

        for(let j = 0; j < 3; j++) {
          tempPhone += contactInformation[7][j];
        }

        tempPhone += (") ");

        for(let j = 3; j < 6; j++) {
          tempPhone += contactInformation[7][j];
        }

        tempPhone += ("-");

        for(let j = 6; j < contactInformation.length; j++) {
          tempPhone += (contactInformation[7][j]);
        }
        contactInformation[7] = tempPhone;
      }
      else {
        contactInformation[7] = ("No phone number provided");
      }
    }
    else {
      contactInformation[7] = ("No");
    }

    // Output for if they can be mailed information
    if(canContactMail === true) {
      if(contactInformation[3] != "" && contactInformation[4] != "") {
        contactInformation[9] = ("Yes");
        canContact = false;
      }
      else {
        contactInformation[9] = ("No address provided");
      }
    }
    else {
      contactInformation[9] = ("No");
    }

    // Output for email address
    if(canContactEmail === true) {
      if(contactInformation[8] == "") {
        contactInformation[8] = ("No email address provided");
      }
    }
    else {
    contactInformation[8] = ("No");
  }

      var model = {"contactInformation" : contactInformation};
      ejs.renderFile("singleContact.ejs", model,
          function(err, result) {
              if(!err) {
                res.end(result);
              }
              else {
                console.log(err);
                res.end("An error occured.");
              }
          });
});
}

function process_get(req, res) {
	var url = require('url');
	var url_parts = url.parse(req.url, true);

  // If the get request is /mailer/, redirect the get request to the index.html with the contact form
  if(req.url == "/mailer/") {
    res.writeHead(302, {Location: "../index.html"});
    res.end();
    return;
  }

  if(req.url == "/contacts") {
    var model = {"allContacts" : allContacts};
    ejs.renderFile("contacts.ejs", model,
        function(err, result) {
            if(!err) {
              res.end(result);
            }
            else {
              console.log(err);
              res.end("An error occured.");
            }
        });
  }

	var query = url_parts.query;

	for ( q in query ) {
		console.log(q + " -> " + query[q]);
	}

	res.end('That page wasn\'t found...\n');
}
