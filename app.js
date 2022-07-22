const feathers = require("@feathersjs/feathers");
const app = feathers();

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

// register the message service on the feathers application
app.use("messages", new MessaeService());

// log every time when a new message has been created
app.service("messages").on("created", (message) => {
  console.log("new messge created: " + message.text);
});

// main

const main = async () => {
  await app.service("messages").create({
    text: "Hi there!",
  });
  await app.service("messages").create({
    text: "Hi Again!",
  });

  const messages = await app.service("messages").find();

  console.log("All Messages: " + JSON.stringify(messages));
};

main();
