//Definimos los elementos HTML
const board = document.getElementById('game-board')
const instructionText = document.getElementById('instruction-text')
const logo = document.getElementById('logo')
const score = document.getElementById('score')
const highScoreText = document.getElementById('max-score')

//Definimos las variables del juego
const gridSize = 20  // Tamaño del tablero
let snake = [{x:10, y:10}];
let food = generateFood(); /*FUNCION FOOD, llama a generateFood para que le brinde las coordenadas para posicionar la comida que pide drawFood*/
let highScore = 0
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;


//Dibuja el mapa, la serpiente y la comida.
const draw = ()=>{
    board.innerHTML = '',
    drawSnake();
    drawFood();
    updateScore();
}

//Hacemos la serpiente

const drawSnake = ()=>{
    snake.forEach((segment)=>{ //Cada segmento es cada posicion (x:10, y:10)
        const snakeElement = createGameElement('div', 'snake'); // Creamos un cubo nuevo (un div) con la clase snake
        setPosition(snakeElement, segment) //Seteamos la posicion mandando el tamaño de la serpiente y donde esta ubicada
        board.appendChild(snakeElement)
    })
}

// Crear la serpiente o cubo de comida / div

const createGameElement = (tag, className)=>{
    const element = document.createElement(tag); // Creamos un cubo nuevo (un div) (tag)
    element.className = className //Con la clase snake / Comida
    return element
}

// Setear la posicion de la serpiente o la comida

const setPosition = (element, position)=>{ //setPosition recibe element que puede ser serpiente o comida
    element.style.gridColumn = position.x //Y position que que es donde tiene que ubicar cada uno 
    element.style.gridRow = position.y   // dentro de su respectivo eje
}

// Test funcion draw

// draw()

//Hacer aparecer comida
function drawFood (){
    if(gameStarted){
    const foodElement = createGameElement('div', 'food'); //Crea un elemento div de comida
    setPosition(foodElement, food); // Manda a posicionar el cubo (foodElement), con las coordenadas que le de food
    board.appendChild(foodElement);}
}

function generateFood(){
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return {x, y}
}

//Mover a la serpiente
const move = ()=>{
    const head = {...snake[0]}
    switch(direction){
    case 'right':
        head.x++;
        break;
    case 'left':
        head.x--;
        break;
    case 'up':
        head.y--;
        break;
    case 'down':
        head.y++;
    break;
}
    snake.unshift(head); // Ubica la cabeza en la nueva posición
    // snake.pop();        // y borra la anterior para dar el efecto de que se mueve
    if(head.x === food.x  && head.y === food.y){  //Si la cabeza choca con la comida
        food = generateFood();                  // Genera una comida nueva
        increaseSpeed();                       // Aumenta la velocidad
        clearInterval(gameInterval)           // y como no hay .pop() se stackea la serpiente
        gameInterval = setInterval(()=>{
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay)      
    } else{
        snake.pop()
    }
}

//Test movimiento
// setInterval(()=>{
//     move() // Hacemos que se mueva
//     draw() // Hacemos que se dibuje devuelta
// },gameSpeedDelay)


//Funcion que empieza el juego

const startGame = ()=>{
    gameStarted = true;  //Trackeamos que el juego este corriendo
    instructionText.style.display = 'none';   //Desaparece el texto  
    logo.style.display = 'none';             // y logo cuando aprieta espacio  
    gameInterval = setInterval(()=>{
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay)
}

// Key event listener

const handleKeyPress = (e)=>{
    if((!gameStarted && e.code === 'Space') ||  //Si aprieta espacio el juego comienza
        (!gameStarted && e.key === 'Space')){
        startGame()
    } else{
        switch(e.key){
            case 'ArrowUp':
                direction = 'up'
                break;
            case 'ArrowDown':
                direction = 'down'          // Flechas para el movimiento
                break;
            case 'ArrowLeft':
                direction = 'left'
                break;
            case 'ArrowRight':
                direction = 'right'
                break;
        }
    }
}

document.addEventListener('keydown', handleKeyPress)  // Listener al teclado

const increaseSpeed = ()=>{
    if(gameInterval > 150){
        gameSpeedDelay -= 5;
    }   else if (gameSpeedDelay > 100){
        gameSpeedDelay -=3;
    }   else if (gameSpeedDelay > 50){
        gameSpeedDelay -=2;
    }   else if (gameSpeedDelay > 25){
        gameSpeedDelay -=1;
    }   
}

//Checkea colisiones
const checkCollision = ()=>{
    const head = snake[0]
    if(head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize){
        resetGame();    //Si la serpiente se choca contra una pared
    }

    for (let i = 1; i < snake.length; i++){
        if(head.x === snake[i].x && head.y === snake[i].y){ 
            resetGame() //Si la serpiente se come a sí misma
        }
    }
}

//Resetear el juego, devuelve todos los valores a default
const resetGame = ()=>{
    updateHighScore();
    stopGame();
    snake = [{x:10, y:10}];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
}


const updateScore = ()=>{
    const currentScore = snake.length - 1
    score.textContent = currentScore.toString().padStart(3, '0') //padStart es para poder agregar el score a los 3 digitos, sino no estarian los 0's
}

const stopGame = ()=>{
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block'
    logo.style.display = 'block'
}

const updateHighScore = ()=>{
    const currentScore = snake.length - 1;
    if (currentScore > highScore){
        highScore = currentScore
        highScoreText.textContent = highScore.toString().padStart(3,'0')
    }
    highScoreText.style.display = 'block'
}