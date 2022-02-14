// MADE BY RAFAEL LIUFE
// FEITO POR RAFAEL LIUFE
const canvas = document.querySelector('#screen')
const score = document.querySelector('#score')
const ctx = canvas.getContext('2d')
let tela = 0
let points = 0

const audio = {
	start: new Audio('audios/start.wav'),
	coleta: new Audio('audios/coleta.wav'),
	over: new Audio('audios/over.wav')
}

const gameOver = () => {
	tela = 2
	points = 0
	audio.over.play()
}

function getState() {
	const table = {
		width: 20,
		heigth: 20,
		Clear() {
			ctx.clearRect(0, 0, this.width, this.heigth)
		}
	}
	const player = {
		snake: [{x: 5, y: 15, direction: 'ArrowUp'},{x: 5, y: 16, direction: 'ArrowUp'},{x: 5, y: 17, direction: 'ArrowUp'}],
		velocity: 200,
		color: 'darkgreen',
		tunnels: [],
		Draw(snakePixel) {
			ctx.fillStyle = this.color
			ctx.fillRect(snakePixel.x, snakePixel.y, 1, 1)
		},
		Muv(snakePixel) {
			switch (snakePixel.direction) {
				case 'ArrowUp':
					snakePixel.y = snakePixel.y - 1
					break
				case 'ArrowLeft':
					snakePixel.x = snakePixel.x - 1
					break
				case 'ArrowDown':
					snakePixel.y = snakePixel.y + 1
					break
				case 'ArrowRight':
					snakePixel.x = snakePixel.x + 1
					break
				default:
					return
			}
			if (state.player.snake[0].x === state.fruit.position.x && state.player.snake[0].y === state.fruit.position.y) {
				let newPixel = {}
				let lastPixel = state.player.snake[state.player.snake.length - 2]
				switch (lastPixel.direction) {
					case 'ArrowUp':
						newPixel.x = lastPixel.x
						newPixel.y = lastPixel.y + 1
						newPixel.direction = lastPixel.direction
						break
					case 'ArrowLeft':
						newPixel.x = lastPixel.x + 1
						newPixel.y = lastPixel.y
						newPixel.direction = lastPixel.direction
						break
					case 'ArrowDown':
						newPixel.x = lastPixel.x
						newPixel.y = lastPixel.y - 1
						newPixel.direction = lastPixel.direction
						break
					case 'ArrowRight':
						newPixel.x = lastPixel.x - 1
						newPixel.y = lastPixel.y
						newPixel.direction = lastPixel.direction
						break
					default:
						return
				}
				points++
				audio.coleta.play()
				state.player.snake.push(newPixel)
				let newFruitX = Math.floor(Math.random() * state.table.width)
				let newFruitY = Math.floor(Math.random() * state.table.heigth)
				for (const pixelId in this.snake) {
					let SPixel = this.snake[pixelId]
					if (SPixel.x === newFruitX && SPixel.y === newFruitY) {
						newFruitX = Math.floor(Math.random() * state.table.width)
						newFruitY = Math.floor(Math.random() * state.table.heigth)
					} 
				}

				state.fruit.position = {x: newFruitX, y: newFruitY}
			}
			if (state.player.snake[0].x > canvas.width - 1 || state.player.snake[0].x < 0 || state.player.snake[0].y > canvas.height - 1 || state.player.snake[0].y < 0) {
				gameOver()
			}
			for (let i = 1; i < state.player.snake.length; i++) {
				let head = state.player.snake[0]
				if (head.x === state.player.snake[i].x && head.y === state.player.snake[i].y) {
					gameOver()
				}
			}
		},
		changeDirection(key) { // Adiciona um túnel
			const acceptedKeys = ['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight']
			const opposites = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft']
			if (acceptedKeys.indexOf(key) !== -1 && acceptedKeys.indexOf(key) !== opposites.indexOf(player.snake[0].direction)) {
				player.tunnels.push({x: player.snake[0].x, y: player.snake[0].y, direction: key, setadas: 0})
			}
		}
	}
	const fruit = {
		position: {x: Math.floor(Math.random() * table.width), y: Math.floor(Math.random() * table.heigth)},
		color: 'red',
		Draw() {
			ctx.fillStyle = this.color
			ctx.fillRect(this.position.x, this.position.y, 1, 1)
		}
	}

	return {
		table,
		player,
		fruit
	}
}
const state = getState()
const eventListener = createEventListener()
eventListener.subscribe(state.player.changeDirection, 'keydown')
eventListener.subscribe(clickChangeScreen, 'click')

function clickChangeScreen() {
	switch (tela) {
		case 0:
			tela++
			audio.start.play()
			break
		case 1:
			break
		case 2:
			state.player.snake = [{x: 5, y: 15, direction: 'ArrowUp'},{x: 5, y: 16, direction: 'ArrowUp'},{x: 5, y: 17, direction: 'ArrowUp'}]
			tela -= tela
	}
}

function createEventListener() {
	const keyObservers = []
	const clickObservers = []
	function subscribe(observerFunction, type) {
		switch (type) {
			case 'click':
				clickObservers.push(observerFunction)
				break
			case 'keydown':
				keyObservers.push(observerFunction)
		}
	}
	function notifyAll(Event) {
		switch (Event.type) {
			case 'click':
				for (observerFunction of clickObservers) {
					observerFunction()
				}
				break
			case 'keydown':
				for (observerFunction of keyObservers) {
					observerFunction(Event.key)
				}
		}
	}

	document.addEventListener('keydown', (Event) => {
		//const key = Event.key

		notifyAll(Event)
	})
	canvas.addEventListener('click', (Event) => {
		notifyAll(Event)
	})

	return {
		subscribe
	}
}

setInterval(() => { // Movimenta a cobra na sua velocidade
	if (tela === 1) {
		for (const pixelId in state.player.snake) {
			let snakePixel = state.player.snake[pixelId]
			
			if (state.player.tunnels.length !== 0) {
				//let tunnel = state.player.tunnels[state.player.tunnels.length - 1]
				for (const tunnelId in state.player.tunnels) {
					let actualTunnel = state.player.tunnels[tunnelId]
					if (actualTunnel.setadas >= state.player.snake.length) {
						state.player.tunnels.splice(state.player.tunnels.indexOf(actualTunnel), 1)
					}
				}
				for (const tunnelId in state.player.tunnels) {
					let actualTunnel = state.player.tunnels[tunnelId]
					if (actualTunnel.x === snakePixel.x && actualTunnel.y === snakePixel.y) {
						setDirection(actualTunnel)
						actualTunnel.setadas++
					}
				}
				function setDirection(tunnel) {
					if (snakePixel.x === tunnel.x && snakePixel.y === tunnel.y) {
						snakePixel.direction = tunnel.direction
					}
				}
			}
			state.player.Muv(snakePixel)
		}
	}
}, state.player.velocity)

function drawStart() {
	canvas.width = '400'
	canvas.height = '400'

	score.style.display = 'none'

	const image = new Image()
	image.src = 'imgs/Start.png'

	ctx.drawImage(image, 0, 0)
}
function drawGame() {
	canvas.width = '20'
	canvas.height = '20'

	state.fruit.Draw()
	for (const pixelId in state.player.snake) {
		let snakePixel = state.player.snake[pixelId]
		state.player.Draw(snakePixel)
	}

	score.style.display = 'block'
	score.innerHTML = `Score: ${points} <br> Size of the snake: ${state.player.snake.length}`
}
let overId = 1
function drawOver(imgId) {
	canvas.width = '400'
	canvas.height = '400'

	score.style.display = 'none'

	const image = new Image()
	image.src = `imgs/Over${imgId}.png`

	ctx.drawImage(image, 0, 0)
} setInterval(() => {
	if (overId === 2 && tela === 2) {overId--}
	else if (overId === 1 && tela === 2) {overId++}
}, 200)

const renderGame = () => {
	state.table.Clear()
	
	switch (tela) {
		case 0:
			drawStart()
			break
		case 1:
			drawGame()
			break
		case 2:
			drawOver(overId)
	}

	requestAnimationFrame(renderGame)
}
renderGame()