var username
const input = document.querySelector('#input')
const messages = document.querySelector('#messages')
const send = document.querySelector('#send')
// Adicionar um evento de clique a todas as imagens de avatar
const avatarImages = document.querySelectorAll('.avatar-image');
const ws = new WebSocket('ws://localhost:8000/ws');
import {keysGenerate, encrypt, decrypt} from "./RSA.js"
import {generateRandomKey, decryptAES, encryptAES} from "./AES.js"

//NECESSÁRIO PARA CONVERTER JSON {BIGINT} EM STRING 
BigInt.prototype.toJSON = function() { return this.toString() }


$(document).ready(function () {
    username = localStorage.getItem('username');
	if (username) {
		$("#userContent").hide();
	}else{
        var keys = keysGenerate();
	$("#chatContent").hide();
	$('#usernameForm').submit(function (e) {
		e.preventDefault(); 
	    username = $('#usernameInput').val(); 
		if (username.trim() !== '') { 
			localStorage.setItem('username',username);
            localStorage.setItem('privateKey',JSON.stringify(keys.privateKey))
            localStorage.setItem('publicKey',JSON.stringify(keys.publicKey))

            ws.send(JSON.stringify({event:'newkey', data:{'publicKey': keys.publicKey, 'username': username}}))


			$("#chatContent").show();
			$("#userContent").hide();
		} else {
			alert('Please enter a username.'); 
		}
	});
	}

});

ws.onmessage = function (msg) {
    msg = JSON.parse(msg.data)
    if (msg.event == "message"){

        if (username != msg.data.username) {
            const key = decrypt(msg.data.AesKey, JSON.parse(localStorage.getItem('privateKey')))
            msg.data.content =  decryptAES(msg.data.content, key)
            insertMessage(msg.data, false)
        }
    }
    
    else if (username != msg.data.username){ //newkey
        localStorage.setItem('targetKey', JSON.stringify(msg.data.publicKey))
        ws.send(JSON.stringify({event:'newkey', data:{'publicKey': keys.publicKey, 'username': username}}))
        return
    }
    //QUANDO RECEBER A DELE ENVIAR A MINHA
};


function getCurrentDate(){
    // Criar um novo objeto de data
var dataAtual = new Date();

// Obtendo a data
var dia = dataAtual.getDate();
var mes = dataAtual.getMonth() + 1; // Os meses são baseados em zero, então adicionamos 1
var ano = dataAtual.getFullYear();

// Obtendo a hora
var hora = dataAtual.getHours();
var minuto = dataAtual.getMinutes();
var segundo = dataAtual.getSeconds();

// Formatar a data e hora como uma string
return hora + ':' + minuto + ':' + segundo;

}


send.onclick = () => {
    const message = {
		username: username,
		content: input.value,
		avatar: localStorage.getItem('selectedAvatar'),
        date: getCurrentDate(),
        AesKey: generateRandomKey(5)
	}
    insertMessage(message, true)    

    //CRIPTOGRAFIA
    message.content =  encryptAES(message.content, message.AesKey)
    message.AesKey = encrypt(message.AesKey,JSON.parse(localStorage.getItem('targetKey')));

/*     message.content =  encrypt(message.content,JSON.parse(localStorage.getItem('targetKey'))); */
    ws.send(JSON.stringify({event: 'message', data: message }));
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

//Para cada imagem adicione o evento handleAvatarClick
avatarImages.forEach(image => {
    image.addEventListener('click', handleAvatarClick);
});


function insertMessage(messageObj, isOut) {

    const listItem = document.createElement('li');

	if (isOut == true) {
		listItem.setAttribute('class', 'out');
	}else{
        listItem.setAttribute('class', 'in');
	}

    const chatBodyDiv = document.createElement('div');
    chatBodyDiv.setAttribute('class', 'chat-body');

    const chatImgDiv = document.createElement('div');
    chatImgDiv.setAttribute('class', 'chat-img');
    const img = document.createElement('img');
    img.setAttribute('alt', 'Avatar');
    img.setAttribute('src', messageObj.avatar);
    chatImgDiv.appendChild(img);
    
    const chatMessageDiv = document.createElement('div');
    chatMessageDiv.setAttribute('class', 'chat-message');
    
    const heading = document.createElement('h5');
    heading.textContent = messageObj.username;
    
    const paragraph = document.createElement('p');
    paragraph.textContent = messageObj.content;

    const date = document.createElement('div');
    date.setAttribute('class', 'hour-format')
    date.textContent = messageObj.date;

    chatMessageDiv.appendChild(heading);
    chatMessageDiv.appendChild(paragraph);
    chatMessageDiv.appendChild(date);
    
    chatBodyDiv.appendChild(chatMessageDiv);
    
    listItem.appendChild(chatImgDiv);
    
    listItem.appendChild(chatBodyDiv);
    
    const messages = document.getElementById('messages');
    messages.appendChild(listItem);
    
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

