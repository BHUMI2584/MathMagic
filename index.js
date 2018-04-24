var express = require("express");
var bodyParser = require("body-parser");
var twilio = require("twilio");

var app = express();


app.use(bodyParser.urlencoded({extended:true}));

app.set("port", 5100);

var oPlayers = {};

app.use(express.static('www'));

function Player(){
    this.number1 = (Math.ceil(Math.random() * 10));
    this.number2 = (Math.ceil(Math.random() * 10));
    this.number = this.number1 + this.number2 ;
    this.nGuessesSum = 0;
    this.nglobalSum = 0;
    this.nglobalmul = 0;
    this.operator = "sum";
    this.fWelcoming = function(req, twiml){
        twiml.message("Welcome to Math Magic World.what's " + this.number1 +" + " + this.number2+ "?" );
        this.fCurstate = this.fGuessing;    
    }
    this.fGuessing = function(req, twiml){
        
        if(this.nglobalSum > 5)
        {
            this.operator = "mul";
            this.nglobalmul = 0;
            this.nglobalSum=0;
        }
        else if(this.nglobalmul > 5)
        {
            this.operator = "sum";
            this.nglobalSum = 0;
            this.nglobalmul = 0;
        }

        if(this.operator == "sum")
        {
            if(req.body.Body > this.number){
                this.nGuessesSum++;
                if(this.nGuessesSum > 1)
                {
                    if(this.nglobalSum < 3)
                        {
                            this.number1 = (Math.ceil(Math.random() * 10));            
                            this.number2 = (Math.ceil(Math.random() * 10));            
                        }
                        else
                        {
                            this.number1 = (Math.ceil(Math.random() * 100));            
                            this.number2 = (Math.ceil(Math.random() * 100));            
                        }
                    
                    this.number=this.number1+this.number2;
                    this.nGuessesSum = 0;
                }
                    twiml.message("too high. What's " + this.number1 +" + " + this.number2 + "?");
                
            }else if(req.body.Body == this.number){
                this.nGuessesSum = 0;
                this.nglobalSum++;
                if(this.nglobalSum<3)
                    {
                        this.number1 = (Math.ceil(Math.random() * 10));            
                        this.number2 = (Math.ceil(Math.random() * 10));            
                    }
                    else
                    {
                        this.number1 = (Math.ceil(Math.random() * 100));            
                        this.number2 = (Math.ceil(Math.random() * 100));            
                    }
                this.number=this.number1+this.number2;
                twiml.message("Your answer is Correct. Now What's " + this.number1 +" + " + this.number2+ "?");
                
                
            }else if(req.body.Body < this.number){
                this.nGuessesSum++;
                
                if(this.nGuessesSum > 1)
                {
                    if(this.nglobalSum<3)
                        {
                            this.number1 = (Math.ceil(Math.random() * 10));            
                            this.number2 = (Math.ceil(Math.random() * 10));            
                        }
                        else
                        {
                            this.number1 = (Math.ceil(Math.random() * 100));            
                            this.number2 = (Math.ceil(Math.random() * 100));            
                        }
                    
                    this.number=this.number1+this.number2;
                    this.nGuessesSum = 0;
                }
                twiml.message("too low. What's " + this.number1 +" + " + this.number2 + "?");
                
            }
            else
            {
                twiml.message("Please enter a valid number:");
            }
        }
        
        
        
        
        
        
        else
        {
            if(req.body.Body > this.number){
                this.nGuessesSum++;
                if(this.nGuessesSum > 1)
                {
                    if(this.nglobalmul<3)
                        {
                            this.number1 = (Math.ceil(Math.random() * 10));            
                            this.number2 = (Math.ceil(Math.random() * 10));            
                        }
                        else
                        {
                            this.number1 = (Math.ceil(Math.random() * 100));            
                            this.number2 = (Math.ceil(Math.random() * 100));            
                        }
                    
                    this.number=this.number1*this.number2;
                    this.nGuessesSum = 0;
                }
                    twiml.message("too high. What's " + this.number1 +" * " + this.number2 + "?");
                
            }else if(req.body.Body == this.number){
                this.nGuessesSum = 0;
                this.nglobalmul++;
                if(this.nglobalmul<3)
                    {
                        this.number1 = (Math.ceil(Math.random() * 10));            
                        this.number2 = (Math.ceil(Math.random() * 10));            
                    }
                    else
                    {
                        this.number1 = (Math.ceil(Math.random() * 100));            
                        this.number2 = (Math.ceil(Math.random() * 100));            
                    }
                this.number=this.number1*this.number2;
                twiml.message("Your answer is Correct. Now What's " + this.number1 +" * " + this.number2+ "?");
                
                
            }else if(req.body.Body < this.number){
                this.nGuessesSum++;
                
                if(this.nGuessesSum > 1)
                {
                    if(this.nglobalmul<3)
                        {
                            this.number1 = (Math.ceil(Math.random() * 10));            
                            this.number2 = (Math.ceil(Math.random() * 10));            
                        }
                        else
                        {
                            this.number1 = (Math.ceil(Math.random() * 100));            
                            this.number2 = (Math.ceil(Math.random() * 100));            
                        }
                    
                    this.number=this.number1*this.number2;
                    this.nGuessesSum = 0;
                }
                twiml.message("too low. What's " + this.number1 +" * " + this.number2 + "?");
                
            }
            else
            {
                twiml.message("Please enter a valid number:");
            }

        }










    }    
    this.fCurstate = this.fWelcoming;
}


app.post('/sms', function(req, res){
    var sFrom = req.body.From;
    if(!oPlayers.hasOwnProperty(sFrom)){
        oPlayers[sFrom] = new Player();
    }
    var twiml = new twilio.twiml.MessagingResponse();
    res.writeHead(200, {'Content-Type': 'text/xml'});
    oPlayers[sFrom].fCurstate(req, twiml);
    var sMessage = twiml.toString();
    res.end(sMessage);
});

var server = app.listen(app.get("port"), function(){
    console.log("Javascript is rocking on port " + app.get("port"));
});