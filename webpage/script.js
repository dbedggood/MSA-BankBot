function openChat() {
    var frame = document.getElementById("chat-frame");
    frame.className = "";
    var img = document.getElementById("chat-button");
    img.className = "hide";
}

function closeChat() {
    var frame = document.getElementById("chat-frame");
    frame.className = "hide";
    var img = document.getElementById("chat-button");
    img.className = "";
}