const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { send } = require("express/lib/response");


const app = express();

app.use(cors());

//for parsing app
app.use(bodyParser.urlencoded({ extended: true }));

const welcomeMessage = {
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!",
};


//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
let messages = [welcomeMessage];
let availableId = 1;

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});


//messages 
app.get("/messages", function (request, response) {
  response.send(messages);
});


//post messages
app.post("/messages", function (request, response) {
  const {from, text} = request.body;
  const newMessage = {from, text};
  newMessage.id = availableId++;

  if (!newMessage.from || !newMessage.text) {
    response.sendStatus(400);
    return;
  };
  
  messages.push(newMessage);
  response.sendStatus(201);
});


//search latest messages
app.get("/latest", (request, response) => {
  response.send(messages.slice(-10).reverse());

});


//search messages -okk
app.get("/search", (request, response) => {
  const textFilter = request.query.text;
  const result = messages.filter(message => message.text.includes(textFilter));
  
  if (!result.length) {
    response.sendStatus(404);
    return;
  }
 
  response.send(result);
});


//search a message by id
app.get("/messages/:messageId", (request, response) => {
  const filterId = request.params.messageId;
  const results = messages.filter(message => message.id == filterId);

  if(!results) {
    response.sendStatus(404);
    return;
  }
 
  response.send(results);
});


//delete a message by id 
app.delete("/messages/:id", (req, res) => {

  const { id } = req.params;
  messages = messages.filter(message => message.id != id);
  
  res.send(messages);
});


app.listen(3001, () => {
   console.log("Listening on port 3001")
  });
