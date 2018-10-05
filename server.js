
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

// Global contact array
let contactInformation = new Array();

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
	req.on('data', function (chunk) {
	   	body += chunk;
	});
	req.on('end', function() {
  		qs = require('querystring');
  		var response = "<html><body><strong>Contact Information Submitted";
  		var post =  qs.parse(body);

    let i = 0;
    console.log(JSON.stringify(post));
		for ( q in post ) {
      contactInformation[i] = post[q];
			console.log(q + " -> " + post[q]);
			// response += ("<p> " + q + "->" + post[q] + "</p>");
      i++;
		}

    // Building the response for the new html page which contains the contact information the user typed in
    response += ("<p>" + "Name: " + contactInformation[0] + " " + contactInformation[1] + " " + contactInformation[2] + "</p>");

    if(contactInformation[3] !== "" && contactInformation[4] !== "") {
      response += ("<p>" + "Address: " + contactInformation[3] + ", " + contactInformation[4] + ", " + contactInformation[5] + " "
      + contactInformation[6] + "</p>");
    }
    else {
      response += ("<p>Address:</p>");
    }

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

    // Output for the phone number
    if(canContactPhone === true) {
      response += ("<p>" + "Contact by Phone: (");
      for(let j = 0; j < 3; j++) {
        response += contactInformation[7][j];
      }

      response += (") ");

      for(let j = 3; j < 6; j++) {
        response += contactInformation[7][j];
      }

      response += ("-");

      for(let j = 6; j < contactInformation.length; j++) {
        response += (contactInformation[7][j]);
      }
    }
    else {
      response += ("<p>" + "Contact by Phone: No" + "</p>");
    }

    // Output for if they can be mailed information
    if(canContactMail === true) {
      response += ("<p>" + "Contact by Mail: Yes" + "</p>");
      canContact = false;
    }
    else {
      response += ("<p>" + "Contact by Mail: No" + "</p>");
    }

    // Output for email address
    if(canContactEmail === true) {
      response += ("<p>" + "Contact by Email: <a href=mailto:contactInformation[8]>" +  contactInformation[8] + "</p>");
    }
    else {
    response += ("<p>" + "Contact by Email: No" + "</p>");
  }

		response += "</strong></body></html>";
		res.end(response);
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

	var query = url_parts.query;

	for ( q in query ) {
		console.log(q + " -> " + query[q]);
	}

	res.end('That page wasn\'t found...\n');
}
