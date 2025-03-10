const io = require("socket.io-client");
const socket = io("http://localhost:3000");


socket.on("message", (msg) => {
    console.log("Received:", msg);
});


socket.on("connect", () => {
    console.log("Connected as:", socket.id);
    socket.emit("message", `Hello from ${socket.id}`);
});
