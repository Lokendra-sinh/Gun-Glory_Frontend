import io from "socket.io-client";
import axios from "axios";

const socket = io("https://gunglory-znay.onrender.com");


//init code

const welcomeModal = document.querySelector('.welcome-modal');
const modalGuestButton = document.querySelector('.modal-guest-button');
const guestButton = document.querySelector('.guest-button');

const createRoomBtn = document.querySelector('.create-room-button');
const joinRoomBtn = document.querySelector('.join-room-button');
const createRoomModal = document.querySelector('.create-room-modal');
const createRoomModalButton = document.querySelector('.create-room-modal-button');
const createRoomModalInput = document.querySelector('.create-room-modal-input');
const closeCreateRoomModalButton = document.querySelector('.close-create-room-modal-button');
const joinRoomModal = document.querySelector('.join-room-modal');
const joinRoomModalButton = document.querySelector('.join-room-modal-button');
const joinRoomModalInput = document.querySelector('.join-room-modal-input');
const closeJoinRoomModalButton = document.querySelector('.close-join-room-modal-button');


const roomLobbyOverlay = document.querySelector('.room-lobby-overlay');
const roomLobby = document.querySelector('.room-lobby');
const roomLobbyHeaderText = document.querySelector('.room-lobby-header-text');
const roomLobbyLeaveButton = document.querySelector('.room-lobby-leave-button');
const roomLobbyStartButton = document.querySelector('.room-lobby-start-button');

const playersContainer = document.querySelector('.players-container');

//room error modal and elements

const roomErrorOverlay = document.querySelector('.room-error-overlay');
const roomErrorText = document.querySelector('.room-error-text');
const roomErrorButton = document.querySelector('.room-error-button');

//game over modal and elements

const gameOverOverlay = document.querySelector('.game-over-overlay');
const gameOverModal = document.querySelector('.game-over-modal');
const gameOverText = document.querySelector('.game-over-text');
const gameOverCloseButton = document.querySelector('.game-over-close-button');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");
const dpi = window.devicePixelRatio || 1;
canvas.width = 1024;
canvas.height = 576;
ctx.scale(dpi, dpi);

let isWelcomeModalOpen = false;
let isCreateRoomModalOpen = false;
let isJoinRoomModalOpen = false;

let gameStarted = false;
let userLoggedIn = false;

const URL = "https://gunglory-znay.onrender.com";
const rooms = {};
const user = {
    name: '',
    email: '',
};



function handleWelcomeModalVisibility(){
    welcomeModal.style.display = isWelcomeModalOpen ? 'flex' : 'none';
  }

modalGuestButton.addEventListener('click', ()=> {
    isWelcomeModalOpen = false;
    handleWelcomeModalVisibility();
    canvas.style.display = 'flex';
})

closeCreateRoomModalButton.addEventListener('click', ()=> {
    createRoomModalInput.value = '';
    createRoomModal.style.display = 'none';
})

closeJoinRoomModalButton.addEventListener('click', ()=> {
    joinRoomModalInput.value = '';
    joinRoomModal.style.display = 'none';
})


//event listeners to handle modal closing

window.addEventListener('click', (e)=> {
    if(roomLobbyOverlay.style.display === 'flex' && !roomLobby.contains(e.target)){
        roomLobbyOverlay.style.display = 'none';
        gameStarted = false;
        socket.emit('gameStopped', roomId);
    }
});

//init code ends


//auth code starts

const authButton = document.querySelector(".auth-button");
const authModal = document.querySelector(".auth-modal");
const loginForm = document.querySelector(".login-form");
const signupForm = document.querySelector(".signup-form");
const signupButton = document.getElementById("signup-button");
const loginButton = document.getElementById("login-button");
const formToggleBtn = document.querySelector(".form-toggle-button");
const formToggleText = document.querySelector(".form-toggle-text");
const loginSpinner = document.querySelector(".login-spinner");
const signupSpinner = document.querySelector(".signup-spinner");

//email verification modal elements

const emailVerificationModalOverlay = document.querySelector(
  ".email-verification-modal-overlay"
);
const emailVerificationForm = document.querySelector(
  ".email-verification-form"
);
const emailVerificationSpinner = document.querySelector(
  ".email-verification-spinner"
);
const closeEmailVerificationModalButton = document.querySelector(
  ".close-email-verification-modal-button"
);

//verification result message elements

const verificationSuccessMessage = document.querySelector(
  ".verification-success"
);
const verificationFailureMessage = document.querySelector(
  ".verification-failure"
);

let isAuthModalOpen = false;
let isSignUpModalOpen = false;
let isLoginModalOpen = false;
let isEmailVerificationModalOpen = false;

// automatic user login based on token value

fetchUserData();

async function fetchUserData() {

    const token = localStorage.getItem("token");
    console.log("token from handleUserlogin is: ", token);
    if(!token){
        console.log("no token found");
        return;
    }

    try {
      const response = await axios.post(
        URL + "/login",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": token,
          },
        }
      );
  
      const userData = await response.data;
      console.log("user data is: ", userData);
      user.name = userData.name;
      user.email = userData.email;
      guestButton.textContent = user.name;
      userLoggedIn = true;
      authButton.textContent = 'Logout';
  
    } catch (error) {
      console.log("error while logging user: ", error);
    }
  }

function handleAuthModalVisibility() {
  authModal.style.display = isAuthModalOpen ? "flex" : "none";
  loginForm.style.display = isLoginModalOpen ? "flex" : "none";
  signupForm.style.display = isSignUpModalOpen ? "flex" : "none";
  formToggleBtn.textContent = isSignUpModalOpen ? "Sign in" : "Sign Up";
  formToggleText.textContent = isSignUpModalOpen
    ? `Already have an account?`
    : `Don't have an account?`;

    loginForm.reset();
    signupForm.reset();
}

function handleEmailVerificationModalVisibility() {
  emailVerificationModalOverlay.style.display = isEmailVerificationModalOpen
    ? "flex"
    : "none";
}

async function handleEmailVerification(verificationCode) {
  try {
    const response = await axios.post(
      URL + "/verify-email",
      {
        verificationCode,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const userData = await response.data;
    console.log("user data is: ", userData);
    console.log("token is: ", userData.token);
    
    localStorage.setItem("token", userData.token);
    verificationSuccessMessage.style.display = "flex";
    setTimeout(() => {
      verificationSuccessMessage.style.display = "none";
      isEmailVerificationModalOpen = false;
      handleEmailVerificationModalVisibility();
      isAuthModalOpen = true;
      isLoginModalOpen = true;
      isSignUpModalOpen = false;
      handleAuthModalVisibility();
    }, 2000);
  } catch (error) {
    console.log("error while verifying email: ", error);
    verificationFailureMessage.style.display = "flex";
  }
}

emailVerificationForm.addEventListener("submit", (event) => {
  event.preventDefault();
  // emailVerificationSpinner.style.display = 'flex';
  const verificationCode = document
    .querySelector(".email-verification-otp")
    .value.trim("");
  handleEmailVerification(verificationCode);
});

authButton.addEventListener("click", (event) => {
  event.preventDefault();

  //if user is already logged in, log them out

  if(userLoggedIn){
    userLoggedIn = false;
    authButton.textContent = 'Sign in/up';
    guestButton.textContent = 'Guest';
    return;
  }

  isAuthModalOpen = !isAuthModalOpen;
  if (isAuthModalOpen) {
    isLoginModalOpen = true;
    isSignUpModalOpen = false;
  }
  handleAuthModalVisibility();
});

formToggleBtn.addEventListener("click", (event) => {
  event.preventDefault();
  if (isSignUpModalOpen) {
    isSignUpModalOpen = false;
    isLoginModalOpen = true;
  } else {
    isSignUpModalOpen = true;
    isLoginModalOpen = false;
  }
  handleAuthModalVisibility();
});

signupForm.addEventListener("submit", function (event) {
  event.preventDefault();
  signupSpinner.style.display = "flex";
  console.log("inside signup form: ", signupButton);
  signupButton.disabled = true;
  extractSignupFormValues();
});

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();
  loginSpinner.style.display = "flex";
  console.log("inside login form: ", loginButton);
  loginButton.disabled = true;
  extractLoginFormValues();
});

closeEmailVerificationModalButton.addEventListener("click", (event) => {
  isEmailVerificationModalOpen = false;
  handleEmailVerificationModalVisibility();
});

async function handleUserRegistration(name, email, password) {
  console.log("inside handleUserRgistration");
  try {
    const response = await axios.post(
      URL + "/register",
      {
        name,
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    isAuthModalOpen = false;
    signupSpinner.style.display = "none";
    signupButton.disabled = false;
    handleAuthModalVisibility();
    isEmailVerificationModalOpen = true;
    handleEmailVerificationModalVisibility();
  } catch (error) {
    console.log("error is: ", error);
    // spinner.style.display = "none";
  }
}

async function handleUserLogin(email, password) {
  try {
    const token = localStorage.getItem("token");
    console.log("token from handleUserlogin is: ", token);
    const response = await axios.post(
      URL + "/login",
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,
        },
      }
    );

    const userData = await response.data;
    console.log("user data is: ", userData);

    setTimeout(() => {
      loginSpinner.style.display = "none";
      loginButton.disabled = false;
      isAuthModalOpen = false;
    handleAuthModalVisibility();
    }, 2000);

    user.name = userData.name;
    user.email = userData.email;
    guestButton.textContent = user.name;

  } catch (error) {
    console.log("error while logging user: ", error);
  }
}
async function extractSignupFormValues() {
  const name = document.getElementById("signup-name").value.trim("");
  const email = document.getElementById("signup-email").value.trim("");
  const password = document.getElementById("signup-password").value.trim("");
  console.log("inside extactSignUpForm");
  await handleUserRegistration(name, email, password);
}

async function extractLoginFormValues() {
  const email = document.getElementById("login-email").value.trim("");
  const password = document.getElementById("login-password").value.trim("");
  await handleUserLogin(email, password);

  console.log("Login Form Values:");
  console.log("Email:", email);
  console.log("Password:", password);
}



//auth code ends

const frontendPlayers = {};
let frontendBullets = {};
const keys = {
  "ArrowUp": false,
  "ArrowDown": false,
  "ArrowLeft": false,
  "ArrowRight": false,
};
let requestNumber = 0;
const playerRequests = [];
const playerSpeed = 15;
const t = 0.05;
let activeParticles = [];
let roomId = "";
let hostId = socket.id;


function clearExistingPlayersList() {
  playersContainer.innerHTML = "";
}

function renderNewPlayersList() {

  for (const id in frontendPlayers) {
    const playerRow = document.createElement("div");
    console.log("frontendPlayers[id]: ", frontendPlayers[id]);
    playerRow.classList.add("player-row");
    playerRow.innerHTML = `
    <p class="player-name">${frontendPlayers[id].playerName}</p>
    <p class="player-role">${frontendPlayers[id].host ? 'Host' : 'Player'}</p>
    `;
    playersContainer.appendChild(playerRow);
  }
}

function handleCreateRoomModalVisibility() {
  createRoomModal.style.display = isCreateRoomModalOpen ? "flex" : "none";
  handleRoomLobbyVisibility();
}

function handleJoinRoomModalVisibility() {
  joinRoomModal.style.display = isJoinRoomModalOpen ? "flex" : "none";
  handleRoomLobbyVisibility();
}

function handleRoomLobbyVisibility() {
  roomLobbyOverlay.style.display =
    isCreateRoomModalOpen === false && isJoinRoomModalOpen === false
      ? "flex"
      : "none";
  roomLobbyHeaderText.textContent = roomId;
}

function displayRoomError(error) {
  roomErrorOverlay.style.display = "flex";
  roomErrorText.textContent = error.message;
};

function updateGameStartButtonState() {
  if (hostId !== socket.id) {
    roomLobbyStartButton.classList.add('nonHostCursor');
    roomLobbyStartButton.disabled = true;
  } else {
    roomLobbyStartButton.classList.remove('nonHostCursor');
    roomLobbyStartButton.disabled = false;
  }
}


// roomErrorButton.addEventListener("click", () => {
//   roomErrorOverlay.style.display = "none";
//   joinRoomModalInput.value = "";
// });

createRoomBtn.addEventListener("click", () => {
  isCreateRoomModalOpen = !isCreateRoomModalOpen;
  isJoinRoomModalOpen === true ? (isJoinRoomModalOpen = false) : "";
  handleJoinRoomModalVisibility();
  handleCreateRoomModalVisibility();
});

joinRoomBtn.addEventListener("click", () => {
  console.log("inside join room");
  isJoinRoomModalOpen = !isJoinRoomModalOpen;
  isCreateRoomModalOpen === true ? (isCreateRoomModalOpen = false) : "";
  handleCreateRoomModalVisibility();
  console.log("isJoinRoomModalOpen: ", isJoinRoomModalOpen);
  handleJoinRoomModalVisibility();
});

createRoomModalButton.addEventListener("click", (e) => {
  e.stopPropagation();
  isCreateRoomModalOpen = false;
  roomId = createRoomModalInput.value.trim('');
  hostId = socket.id;
  if(!roomId) return alert('Please enter a room id');
  const playerName = user.name ? user.name : 'Guest';
  const sentTime = Date.now();
  console.log("create room sent time: ", sentTime)
  socket.emit("createRoom", roomId, playerName, sentTime);
  updateGameStartButtonState();
  handleCreateRoomModalVisibility();
});

joinRoomModalButton.addEventListener("click", (e) => {
  e.stopPropagation();
  isJoinRoomModalOpen = false;
  roomId = joinRoomModalInput.value.trim('');
  if(!roomId) return alert('Please enter a room id');
  const playerName = user.name ? user.name : 'Guest';
  socket.emit("joinRoom", roomId, playerName);
  updateGameStartButtonState();
  
});

roomLobbyLeaveButton.addEventListener("click", (e) => {
  e.stopPropagation();
  if(hostId === socket.id) {
    socket.emit("deleteRoom", roomId);
  } else {
    socket.emit("leaveRoom", roomId);
  }
});

roomLobbyStartButton.addEventListener("click", (e) => {
  e.stopPropagation();
  if(hostId !== socket.id){
    return alert('Only host can start the game');
  }
  // if(Object.keys(frontendPlayers).length < 2) return alert('Atleast 2 players are required to start the game');
  socket.emit("gameStarted", roomId);
  // roomLobbyOverlay.style.display = "none";
  // gameStarted = true;
  // socket.emit("gameStarted", roomId);
  // // animate();
});

gameOverCloseButton.addEventListener('click', ()=> {
  gameOverOverlay.classList.add('closing');
  setTimeout(() => {
      gameOverOverlay.style.display = 'none';
      gameOverOverlay.classList.remove('closing');
      window.location.reload();
  }, 300);
})

socket.on("connect", () => {
  console.log("client connected successfully: ", socket.id);
});

socket.on("roomCreated", (roomId, sentTime) => {
  const receivedTime = Date.now();
  const totalTime = receivedTime - sentTime;
  console.log("total time taken: ", totalTime);
  console.log("room created with roomId: ", roomId);
  hostId = socket.id;
});

socket.on("roomDeleted", (roomId) => {
  console.log("room deleted with roomId: ", roomId);
  hostId = "";
  roomLobbyOverlay.style.display = "none";
  gameStarted = false;
});

socket.on("playerCreated", (player) => {
  frontendPlayers[socket.id] = player;
  clearExistingPlayersList();
  renderNewPlayersList();
});

socket.on("roomError", (error) => {
  console.log("room error: ", error);
  displayRoomError(error);
});

socket.on("roomJoined", (roomId) => {
  console.log("room joined with roomId: ", roomId);
  handleJoinRoomModalVisibility();
});

socket.on("playerLeftTheRoom", (playerId) => {
  if(playerId === socket.id) {
    roomLobbyOverlay.style.display = "none";
  }
  delete frontendPlayers[playerId];
  clearExistingPlayersList();
  renderNewPlayersList();
});

socket.on("existingPlayers", (players) => {
  for (const id in players) {
    frontendPlayers[id] = players[id];
  }
  clearExistingPlayersList();
  renderNewPlayersList();
});

socket.on("newPlayer", (player) => {
  console.log("new player joined: ", player);
  const playerId = player.playerId;
  frontendPlayers[playerId] = player;
  clearExistingPlayersList();
  renderNewPlayersList();
});

socket.on("gameStarted", (roomId) => {
  roomLobbyOverlay.style.display = "none";
  gameStarted = true;
  animate();
});

socket.on("updatedPlayersGameState", (players) => {
  for (const id in players) {
    if (!frontendPlayers[id]) {
      frontendPlayers[id] = players[id];
    } else {
      //  apply linear interpolation for smooth player movements
      frontendPlayers[id].x = lerp(frontendPlayers[id].x, players[id].x, t);
      frontendPlayers[id].y = lerp(frontendPlayers[id].y, players[id].y, t);
    }
  }

  // deleting frontend players
  for (const id in frontendPlayers) {
    if (!players[id]) {
      if (id === socket.id) {
        roomLobbyOverlay.style.display = "none";
        gameStarted = false;
      }
      delete frontendPlayers[id];
    }
  }
  
});

socket.on("playerHit", (playerId) => {
  if(frontendPlayers[playerId]) {
    
    activeParticles = createParticles(frontendPlayers[playerId].x, frontendPlayers[playerId].y);
    delete frontendPlayers[playerId];

    setTimeout(() => {
      if(playerId === socket.id) {
        roomId = '';
        gameStarted = false;
        gameOverOverlay.style.display = 'flex';
        gameOverText.textContent = 'You fought bravely but the enemy was too strong. Better luck next time!';
      }
    }, 1500);
  }
});

socket.on("playerWon", (playerId) => {
  if(frontendPlayers[playerId]) {
    delete frontendPlayers[playerId];
    setTimeout(() => {
      if(playerId === socket.id) {
        roomId = '';
        gameStarted = false;
        gameOverOverlay.style.display = 'flex';
        gameOverText.textContent = 'Congratulations. You Won!';
      }
    }, 1500);
  }
});

socket.on("updatedBulletsGameState", (bullets) => {
  frontendBullets = {};
  for (const id in bullets) {
   frontendBullets[id] = bullets[id];
  }
  
});


socket.on("playerLeftTheRoom", (playerId) => {
  delete frontendPlayers[playerId];
});

function lerp(start, end, t) {
  return start + (end - start) * t;
}

window.addEventListener("keydown", (event) => {
  for(const key in keys){
    if(key === event.key) {
      keys[key] = true;
    }
  }
});

window.addEventListener("keyup", (event) => {
  for(const key in keys){
    if(key === event.key) {
      keys[key] = false;
    }
  }
});

function updatePlayersPosition() {
  if (keys["ArrowUp"]) {
    socket.emit("keydown", "ArrowUp", roomId);
  }

  if (keys["ArrowDown"]) {
    socket.emit("keydown", "ArrowDown", roomId);
  }

  if (keys["ArrowLeft"]) {
    socket.emit("keydown", "ArrowLeft", roomId);
  }

  if (keys["ArrowRight"]) {
    socket.emit("keydown", "ArrowRight", roomId);
  }
}

canvas.addEventListener("click", (event) => {
  // if(!GameStarted) return;
  const c = canvas.getBoundingClientRect();
  // console.log("canvas: ", c.top, c.left);
  const player = {
    x: frontendPlayers[socket.id].x,
    y: frontendPlayers[socket.id].y,
  };
  console.log(
    "player: ",
    frontendPlayers[socket.id].x,
    frontendPlayers[socket.id].y
  );

  const mouseX = (event.clientX - c.left) / dpi;
  const mouseY = (event.clientY - c.top) / dpi;

  console.log("mousecanvas: ", mouseX, mouseY);
  const shotAngle = Math.atan2(mouseY - player.y, mouseX - player.x);
  console.log(shotAngle);

  const bullet = {
    x: player.x,
    y: player.y,
    angle: shotAngle,
    roomId,
  };

  console.log("bullet: ", bullet.x, bullet.y);
  socket.emit("addBullet", bullet);
});

function animate() {
  requestAnimationFrame(animate);
  ctx.fillStyle = "rgba(0,0,0,1)";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updatePlayersPosition();
  for (const id in frontendPlayers) {
    const player = frontendPlayers[id];
    drawPlayer(player);
  }
  for (const id in frontendBullets) {
    const bullet = frontendBullets[id];
    drawBullet(bullet);
  }

  activeParticles = animateParticles(activeParticles);
}

function drawPlayer({ x, y, radius, color, playerName }) {
  ctx.beginPath();
  ctx.shadowColor = color;
  ctx.shadowBlur = 30;
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();

  ctx.font = "12px Arial";
  ctx.fillStyle = color;
  ctx.fillText(playerName ? playerName : 'Guest', x, y + radius + 10);
}

function drawBullet({ x, y, radius, color }) {
  ctx.beginPath();
  ctx.shadowColor = color;
  ctx.shadowBlur = 30;
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

function createParticles(x, y){
  let particles = [];
  for(let i = 0; i < 20; i++){
       particles.push({
            x,
            y,
            color: `hsl(${Math.random() * 360}, ${100}%, ${50}%)`,
            radius: Math.random() * 5,
            velocityX: Math.random() * 5 - 2.5,
            velocityY: Math.random() * 5 - 2.5,
            lifeSpan: 50,
        })
       }

       return particles;
  }

  function animateParticles(particles){
       particles.forEach((particle, index) => {
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;
        particle.lifeSpan -= 1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = particle.color;
        ctx.fill();
        ctx.closePath();
       });

       return particles.filter(particle => particle.lifeSpan > 0);
  }

  // window.addEventListener('resize', () => {
  //   const oldWidth = canvas.width;
  //   const oldHeight = canvas.height;
  //   canvas.width = window.innerWidth;
  //   canvas.height = window.innerHeight;
  //   ctx ? ctx.scale(canvas.width / oldWidth, canvas.height / oldHeight) : '';
  // });