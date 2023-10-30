import { client } from "./server.js";
import readline from "readline";

await client.connect();

let initialState = "";
let finalState = "";

const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

reader.question("Seu nome de usuário: ", async function (user) {
  client.SET("chat", `${user} entrou no chat!`);
  initialState = await client.GET("chat");
  console.log(await client.GET("chat"));
  client.emit("chat", initialState);
  client.emit("refresh", user);
});

function sendMessage(user) {
  reader.question("", async function (message) {
    const currentTime = new Date();
    const finalMessage = `[${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}] [${user}]: ${message}`;
    initialState = await client.GET("chat");
    client.SET("chat", finalMessage);
    client.emit("refresh", user);
  });
}

client.on("refresh", function (user) {
  sendMessage(user);
});

client.on("chat", async function (initialState) {
  finalState = await client.GET("chat");
  setTimeout(async function () {
    if (initialState != finalState) {
      console.log(await client.GET("chat"));
      initialState = await client.GET("chat");
    }
    client.emit("chat", initialState);
  }, 1000);
});
