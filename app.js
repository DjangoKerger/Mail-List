const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https")

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req,res){
    res.sendfile(__dirname + "/signup.html");
})

app.post("/", function(req,res){

    const firstName = req.body.fname
    const lastName = req.body.lname
    const email = req.body.email

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    var jsonData = JSON.stringify(data);

    const url = "https://us10.api.mailchimp.com/3.0/lists/9d60eb8b00"

    const options = {
        method: "POST",
        auth: "django1:a7b7a1b133eec7c1ce2bc626229cf80e-us10"

    }

    const request = https.request(url, options, function(response){
        
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html")
        } else {
            res.sendFile(__dirname + "/failure.html")
        }
        
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);

    request.end();
    
});

app.post("/failure", function(req,res){
    res.redirect("/")
})

app.listen(process.env.PORT || 3000, function(){
    console.log("server is running");
});
//api key
//a7b7a1b133eec7c1ce2bc626229cf80e-us10
//listid
//9d60eb8b00