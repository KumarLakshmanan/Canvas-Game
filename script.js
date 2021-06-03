var { rightPressed, leftPressed, upPressed, downPressed } = false;
var pagePerRow = 10;
var pagePerColumn = 13;
var playerSize = window.innerHeight / (pagePerRow * 3);

function getRandom(length) {
	return Math.floor(Math.random() * length);
}
function getRowSize() {
	return window.innerHeight / pagePerRow;
}
function getColumnSize() {
	return window.innerWidth / pagePerColumn;
}
function getTileFromPosition(position) {
	let top = Math.floor(position.y / getRowSize());
	let left = Math.floor(position.x / getRowSize());
	let bottom = Math.floor(position.y / getColumnSize()) + 2;
	let right = Math.floor(position.x / getColumnSize()) + 2;
	let isBlankTop = () => {
		if (typeof map[top] !== "undefined") {
			if (typeof map[top][right - 1] !== "undefined") {
				if (map[top][right - 1] === 1) {
					return true;
				}
			}
		}
		return false;
	};
	let isBlankBottom = () => {
		if (typeof map[bottom] !== "undefined") {
			if (typeof map[bottom][right - 1] !== "undefined") {
				if (map[bottom][right - 1] === 1) {
					return true;
				}
			}
		}
		return false;
	};
	let isBlankRight = () => {
		if (typeof map[top] !== "undefined") {
			if (typeof map[top - 1][right] !== "undefined") {
				if (map[top - 1][right] === 1) {
					return true;
				}
			}
		}
		return false;
	};
	let isBlankleft = () => {
		if (typeof map[top] !== "undefined") {
			if (typeof map[top - 1][left] !== "undefined") {
				if (map[top - 1][left] === 1) {
					return true;
				}
			}
		}
		return false;
	};

	return {
		top: top,
		left: left,
		bottom: bottom,
		right: right,
		isBlankTop: isBlankTop(),
		isBlankBottom: isBlankBottom(),
		isBlankRight: isBlankRight(),
		isBlankleft: isBlankleft(),
	};
}
function getRandomStartingPos() {
	let startingPositions = ["1,2", "1,11", "5,2", "8,1", "8,11"];
	let randomPos = startingPositions[getRandom(startingPositions.length)];
	let randomPosArr = randomPos.split(",");
	let randomPlayerX = (parseInt(randomPosArr[1]) + 0.5) * getColumnSize();
	let randomPlayerY = (parseInt(randomPosArr[0]) + 0.5) * getRowSize();
	return { x: randomPlayerX, y: randomPlayerY };
}
var randomPosition = getRandomStartingPos();

var map = [
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
	[1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
	[1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1],
	[1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
var canvas = document.getElementById("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var ctx = canvas.getContext("2d");

function drawMap() {
	for (let rows = 0; rows < map.length; rows++) {
		for (let cols = 0; cols < map[0].length; cols++) {
			if (map[rows][cols]) {
				ctx.fillStyle = "#0095DD";
				ctx.fillRect(
					cols * getColumnSize(),
					rows * getRowSize(),
					getColumnSize(),
					getRowSize()
				);
			}
		}
	}
}
function updatePlayer() {
	let neighbourTiles = getTileFromPosition(randomPosition);
	// console.log(neighbourTiles);
	console.log({
		0: neighbourTiles.isBlankRight,
		1: (neighbourTiles.left + 1) * getColumnSize(),
		2: randomPosition.x,
	});
	if (rightPressed) {
		if (
			(neighbourTiles.left + 1) * getColumnSize() >
			randomPosition.x + playerSize / 2
		) {
			randomPosition.x += 5;
			console.log("+5");
		} else if (
			(neighbourTiles.left + 1) * getColumnSize() >
			randomPosition.x + 5 + playerSize / 2
		) {
			console.log("+1");
			randomPosition.x++;
		}
	} else if (leftPressed) {
		randomPosition.x -= 5;
	} else if (upPressed) {
		randomPosition.y -= 5;
	} else if (downPressed) {
		randomPosition.y += 5;
	}
	ctx.beginPath();
	ctx.arc(randomPosition.x, randomPosition.y, playerSize, 0, Math.PI * 2);
	ctx.fillStyle = "red";
	ctx.fill();
	ctx.closePath();
	rightPressed = false;
	leftPressed = false;
	upPressed = false;
	downPressed = false;
}

function drawPlayer() {
	ctx.beginPath();
	ctx.arc(randomPosition.x, randomPosition.y, playerSize, 0, Math.PI * 2);
	ctx.fillStyle = "red";
	ctx.fill();
	ctx.closePath();
}

function keyHandler(e) {
	switch (e.key) {
		case "Right":
		case "ArrowRight":
			rightPressed = true;
			break;
		case "Left":
		case "ArrowLeft":
			leftPressed = true;
			break;
		case "Up":
		case "ArrowUp":
			upPressed = true;
			break;
		case "Down":
		case "ArrowDown":
			downPressed = true;
			break;
	}
}

window.onresize = () => (window.location.href = "/");
document.addEventListener("keydown", keyHandler);
document.addEventListener("keyup", keyHandler);

drawMap();
drawPlayer();
setInterval(() => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawMap();
	updatePlayer();
}, 500);
