const feathers = require("@feathersjs/feathers");
const express = require("@feathersjs/express");
class MessaeService {
  constructor() {
    this.messages = [];
  }

  async find() {
    return this.messages;
  }

  async create(data) {
    const message = {
      id: this.messages.length,
      text: data.text,
    };

    this.messages.push(message);
    return message;
  }
}

const app = express(feathers());
// parse json body
app.use(express.json());
// parse url-encoded params
app.use(express.urlencoded({ extended: true }));
// hsot static files from the current folder
app.use(express.static(__dirname));

//Add REST API support
app.configure(express.rest());
// resiter errror hanlder than the default
app.use(express.errorHandler());

// register the message service on the feathers application
app.use("messages", new MessaeService());

app.listen(3030).on("listening", () => {
  console.log("feathers server is listening on localhost:3030");
});

app.service("messages").create({
  text: "hello from the server",
});
