let canvas = document.querySelector("#canvas");
let canvasStatus = document.querySelector("#canvasStatus");

// Show canvas status
function showStatus(message, duration = 2000) {
  canvasStatus.textContent = message;
  canvasStatus.classList.add('show');
  
  setTimeout(() => {
    canvasStatus.classList.remove('show');
  }, duration);
}


canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 130; // Adjusted for Adobe header + toolbar

// Initialize canvas status
setTimeout(() => showStatus("AI Whiteboard ready", 3000), 500);

window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 130; // Adjusted for Adobe header + toolbar
  drawLinesFromDB();
});



// AI Whiteboard - Canvas Context
let ctx = canvas.getContext("2d");

// Set default drawing properties with professional standards
ctx.lineCap = "round";
ctx.lineJoin = "round";
ctx.strokeStyle = "#2C2C2C"; // Adobe dark gray
ctx.lineWidth = 2;

let linesDB = [];
let redoLinesDB = [];
let isPenDown = false;
let line = [];

canvas.addEventListener("mousedown", function (e) {
  if (redoLinesDB.length) {
    redoLinesDB = [];
  }

  isPenDown = true;
  let x = e.clientX;
  let y = e.clientY - 130;
  ctx.beginPath();
  ctx.moveTo(x, y);

  let pointObject = {
    x: x,
    y: y,
    type: "md",
    lineWidth: ctx.lineWidth,
    strokeStyle: ctx.strokeStyle,
  };
  line.push(pointObject);
});
canvas.addEventListener("touchstart", function (e) {
  if (redoLinesDB.length) {
    redoLinesDB = [];
  }

  isPenDown = true;
  let x = e.touches[0].clientX;
  let y = e.touches[0].clientY - 130;
  ctx.beginPath();
  ctx.moveTo(x, y);

  let pointObject = {
    x: x,
    y: y,
    type: "md",
    lineWidth: ctx.lineWidth,
    strokeStyle: ctx.strokeStyle,
  };
  line.push(pointObject);
});

canvas.addEventListener("mousemove", function (e) {
  if (isPenDown) {
    let x = e.clientX;
    let y = e.clientY - 130;
    ctx.lineTo(x, y);
    ctx.stroke();

    let pointObject = {
      x: x,
      y: y,
      type: "mm",
    };
    line.push(pointObject);
  }
});
canvas.addEventListener("touchmove", function (e) {
  if (isPenDown) {
    var x = e.touches[0].clientX;
  var y = e.touches[0].clientY - 130;
    ctx.lineTo(x, y);
    ctx.stroke();

    let pointObject = {
      x: x,
      y: y,
      type: "mm",
    };
    line.push(pointObject);
  }
});



canvas.addEventListener("mouseup", function (e) {
  isPenDown = false;

  // AI Shape Recognition
  if (window.aiFeatures && window.aiFeatures.aiShapeMode && line.length > 5) {
    const shape = window.aiFeatures.recognizeShape(line);
    if (shape) {
      // Clear the rough drawing
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawLinesFromDB(); // Redraw existing lines
      
      // Draw perfect shape
      window.aiFeatures.drawPerfectShape(shape, line);
      
      // Update the line data with the perfect shape
      line = []; // Clear rough drawing data
    }
  }

  if (line.length > 0) {
    linesDB.push(line);
    line = [];
  }

  // Drawing saved to AI Whiteboard history
  showStatus(`Stroke saved • ${linesDB.length} total strokes`, 1500);
});
canvas.addEventListener("touchend", function (e) {
  isPenDown = false;

  linesDB.push(line);
  line = [];

  // Touch drawing completed
});