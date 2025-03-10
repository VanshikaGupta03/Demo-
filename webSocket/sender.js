const { Server } = require("socket.io");

module.exports = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*", 
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);

        socket.on("message", (message) => {
           
            io.emit("message", `Server received: Hello from ${socket.id}`); 

            socket.broadcast.emit("message", message);
        });
        

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });

    //console.log("Socket.io server initialized.");
};
