
var username = localStorage.getItem('username')
const input = document.querySelector('#input')
const messages = document.querySelector('#messages')
const send = document.querySelector('#send')

$(document).ready(function () {
	if (this.username) {
		$("#userContent").hide();
	}else{
	$("#chatContent").hide();
	$('#usernameForm').submit(function (e) {
		e.preventDefault(); 
	    username = $('#usernameInput').val(); 
		if (username.trim() !== '') { 
			localStorage.setItem('username',username);
			$("#chatContent").show();
			$("#userContent").hide();
		} else {
			alert('Please enter a username.'); 
		}
	});
	}

});



const ws = new WebSocket('ws://127.0.0.1:8000/ws');

ws.onmessage = function (msg) {
	
	if (username == JSON.parse(msg.data).username) {
		insertMessage(JSON.parse(msg.data), true)
	}else{
		insertMessage(JSON.parse(msg.data), false)
	}
};

send.onclick = () => {
    const message = {
		username: this.username,
		content: input.value,
		avatar: localStorage.getItem('selectedAvatar')
	}
    ws.send(JSON.stringify(message));
    input.value = "";
};

/**
 * Insert a message into the UI
 * @param {Message that will be displayed in the UI} messageObj
 */

window.addEventListener('load', () => {
    const cachedMessages = localStorage.getItem('chatMessages');
    if (cachedMessages) {
        messages.innerHTML = cachedMessages;
    }
});

function insertMessage(messageObj, isOut) {
    // Create a new list item element
    const listItem = document.createElement('li');

	if (isOut == true) {
		listItem.setAttribute('class', 'out');
	}else{
    listItem.setAttribute('class', 'in'); // Assuming 'in' is the class for incoming messages
	}

    // Create the div for the chat body
    const chatBodyDiv = document.createElement('div');
    chatBodyDiv.setAttribute('class', 'chat-body');
    
    // Create the div for the chat image
    const chatImgDiv = document.createElement('div');
    chatImgDiv.setAttribute('class', 'chat-img');
    const img = document.createElement('img');
    img.setAttribute('alt', 'Avatar');
    img.setAttribute('src', messageObj.avatar);
    chatImgDiv.appendChild(img);
    
    // Create the div for the chat message
    const chatMessageDiv = document.createElement('div');
    chatMessageDiv.setAttribute('class', 'chat-message');
    
    // Create the heading for the message
    const heading = document.createElement('h5');
    heading.textContent = messageObj.username;
    
    // Create the paragraph for the message content
    const paragraph = document.createElement('p');
    paragraph.textContent = messageObj.content;
    
    // Append heading and paragraph to the chat message div
    chatMessageDiv.appendChild(heading);
    chatMessageDiv.appendChild(paragraph);
    
    // Append chat message div to chat body div
    chatBodyDiv.appendChild(chatMessageDiv);
    
    // Append chat image div to the list item
    listItem.appendChild(chatImgDiv);
    
    // Append chat body div to the list item
    listItem.appendChild(chatBodyDiv);
    
    // Append the list item to the messages list
    const messages = document.getElementById('messages');
    messages.appendChild(listItem);
    
    // Save messages to localStorage
    localStorage.setItem('chatMessages', messages.innerHTML);
}

function handleAvatarClick(event) {
    // Remover a classe 'selected' de todas as imagens de avatar
    const avatarImages = document.querySelectorAll('.avatar-image');
    avatarImages.forEach(image => {
        image.classList.remove('selected');
    });

    // Adicionar a classe 'selected' à imagem de avatar clicada
    event.target.classList.add('selected');

    // Obter o URL da imagem do atributo 'data-src' da imagem clicada
    const selectedAvatar = event.target.dataset.src;

    // Armazenar o URL do avatar selecionado em localStorage
    localStorage.setItem('selectedAvatar', selectedAvatar);
}

// Adicionar um evento de clique a todas as imagens de avatar
const avatarImages = document.querySelectorAll('.avatar-image');
avatarImages.forEach(image => {
    image.addEventListener('click', handleAvatarClick);
});
