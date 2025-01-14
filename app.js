const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let background = new Image();
let logo = new Image();
logo.src = 'cigar.png'; // Your static logo image
let flip = false;
let logoX = 0, logoY = 0; // Adjusting initial position to fit within the canvas
let isDragging = false;
let offsetX, offsetY;

// Preload the logo image to reduce loading time
logo.onload = () => {
    drawCanvas();
};

// Handle background image upload
document.getElementById('add-image').addEventListener('click', () => {
    document.getElementById('bg-upload').click();
});

document.getElementById('bg-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
        background.src = event.target.result;
        background.onload = () => {
            drawCanvas();
            document.getElementById('cancel-button').style.display = 'block';
            document.getElementById('flip-button').style.display = 'block';
            document.getElementById('bg-upload').style.display = 'none';
            document.getElementById('download').style.display = 'block';
            document.getElementById('add-image').style.display = 'none'; // Hide Add Image button
        };
    };
    reader.readAsDataURL(file);
});

// Function to get canvas coordinates from event
function getCanvasCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

// Enable dragging of the logo image with mouse events
canvas.addEventListener('mousedown', (e) => {
    const { x, y } = getCanvasCoordinates(e);
    if (x > logoX && x < logoX + 500 && y > logoY && y < logoY + 500) {
        isDragging = true;
        offsetX = x - logoX;
        offsetY = y - logoY;
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const { x, y } = getCanvasCoordinates(e);
        logoX = x - offsetX;
        logoY = y - offsetY;
        drawCanvas();
    }
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
});

// Enable dragging of the logo image with touch events
canvas.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    const { x, y } = getCanvasCoordinates(touch);
    if (x > logoX && x < logoX + 500 && y > logoY && y < logoY + 500) {
        isDragging = true;
        offsetX = x - logoX;
        offsetY = y - logoY;
    }
});

canvas.addEventListener('touchmove', (e) => {
    if (isDragging) {
        const touch = e.touches[0];
        const { x, y } = getCanvasCoordinates(touch);
        logoX = x - offsetX;
        logoY = y - offsetY;
        drawCanvas();
    }
    e.preventDefault();
});

canvas.addEventListener('touchend', () => {
    isDragging = false;
});

// Handle flipping of the logo image
document.getElementById('flip-button').addEventListener('click', () => {
    flip = !flip;
    drawCanvas();
});

// Handle resetting of the canvas
document.getElementById('cancel-button').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.src = '';
    document.getElementById('cancel-button').style.display = 'none';
    document.getElementById('flip-button').style.display = 'none';
    document.getElementById('bg-upload').style.display = 'none'; // Keep this hidden
    document.getElementById('download').style.display = 'none';
    document.getElementById('add-image').style.display = 'block'; // Show Add Image button
    document.getElementById('bg-upload').value = ''; // Reset the file input element

    // Reset logo position to starting point
    logoX = 0;
    logoY = 0;

    drawCanvas();
});

// Handle downloading of the canvas image
document.getElementById('download').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'chamed.png';
    link.href = canvas.toDataURL();
    link.click();
});

// Draw the canvas
function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (background.src) {
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    }
    ctx.save();
    if (flip) {
        ctx.scale(-1, 1);
        ctx.drawImage(logo, -(logoX + 500), logoY, 300, 300); // Adjust size here
    } else {
        ctx.drawImage(logo, logoX, logoY, 300, 300); // Adjust size here
    }
    ctx.restore();
}

// Initial draw to display the logo before background image is uploaded
window.onload = () => {
    drawCanvas();
};
