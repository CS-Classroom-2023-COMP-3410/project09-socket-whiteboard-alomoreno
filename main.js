import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
    transports: ["websocket", "polling"], //ensures compatibility with all browsers
});
// ; // Connect to server
socket.on("connect", () => {
    console.log("Connected to the server!");
});

const canvas = document.getElementById("whiteboard");
const ctx = canvas.getContext("2d");

let drawing = false;
let color = "#000000"; // Default black

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Track mouse movement for drawing
canvas.addEventListener("mousedown", () => (drawing = true));
canvas.addEventListener("mouseup", () => (drawing = false));
canvas.addEventListener("mousemove", draw);

function draw(event) {
    if (!drawing) return;

    const { offsetX, offsetY } = event;
    const drawData = { x: offsetX, y: offsetY, color };

    socket.emit("draw", drawData); // Send to server
}

// Listen for drawing events from others
socket.on("draw", (data) => {
    ctx.fillStyle = data.color;
    ctx.fillRect(data.x, data.y, 4, 4);
});

// Load board state on connect
socket.on("loadBoard", (boardState) => {
    boardState.forEach((data) => {
        ctx.fillStyle = data.color;
        ctx.fillRect(data.x, data.y, 4, 4);
    });
});

// Clear board functionality
document.getElementById("clearBtn").addEventListener("click", () => {
    socket.emit("clearBoard");
});

socket.on("clearBoard", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});
