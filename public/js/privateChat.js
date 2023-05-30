const socket = io.connect();
const inbox = document.getElementById("thisinbox");
const contentMsg = document.getElementById("chat-imput");
const sendBtn = document.getElementById("send");
const channelEmail = thisUser.user;

function setUserType(type) {
  if (type === "true") {
    return "sistema";
  } else {
    return "user";
  }
}

function functionImputs() {
  if (contentMsg.value === "") {
    sendBtn.setAttribute("disabled", sendBtn);
  } else {
    sendBtn.removeAttribute("disabled");
  }
}

contentMsg.addEventListener("keyup", () => {
  contentMsg.setAttribute("value", contentMsg.value);
  functionImputs();
});

sendBtn.addEventListener("click", () => {
  console.log(msg)
  const msg = {
    to: channelEmail,
    firstname: `${thisUser.firstname} ${thisUser.lastname}`,
    email: thisUser.user,
    rol: setUserType(thisUser.rol),
    msg: contentMsg.value,
  };
  socket.emit("new-message", msg);
  contentMsg.value = "";
  functionImputs();
});


socket.on("start", (msg) => {
  socket.emit("join-room", thisUser.user);
  socket.emit("single-channel", thisUser.user);
});

socket.on("channel", (msg) => {
console.log(msg,"aaaa")
  const inboxs = msg
    .map(
      (msg) => `
          <div class=msg-container-${msg.rol}>
          <div class=mail-${msg.rol}>${msg.email} escribe:</div>
          <div class=msg-${msg.rol}>${msg.msg}</div>
          <div class=hora-${msg.rol}> enviado el: ${msg.date}</div>
          </div>
          `
    )
    .join("");
 inbox.innerHTML =inboxs;
});

socket.on("recibir-mensajes", (msg) => {
  const inboxs =msg
    .map(
      (msg) => `
          <div class=msg-container-${msg.rol}>
          <div class=mail-${msg.rol}>${msg.email} escribe:</div>
          <div class=msg-${msg.rol}>${msg.msg}</div>
          <div class=hora-${msg.rol}> enviado el: ${msg.date}</div>
          </div>
          `
    )
    .join("");
 inbox.innerHTML = inboxs;
});
