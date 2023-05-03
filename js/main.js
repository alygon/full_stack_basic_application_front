/*
--------------------------------------------------------------------------------------
Função para obter a lista de usuários existentes do servidor 
--------------------------------------------------------------------------------------
*/
const getList = async () => {

	let url = 'http://127.0.0.1:5000/usuarios';
	fetch(url, {
		method: 'get',
	})
		.then((response) => response.json())
		.then((data) => {
		data.usuarios.forEach(item => insertList(item.login, item.nome))
		})
		.catch((error) => {
		console.error('Error:', error);
		});
}

/*
--------------------------------------------------------------------------------------
Chamada da função para carregamento inicial dos dados
--------------------------------------------------------------------------------------
*/
getList()

/*
--------------------------------------------------------------------------------------
Função para inserir registros na tabela principal da página
--------------------------------------------------------------------------------------
*/
const insertList = (login, nome) => {
	
	var usuario = [login, nome]
	var table = document.getElementById('myTable');
	var row = table.insertRow();
	
	for (var i = 0; i < usuario.length; i++) {
		var cel = row.insertCell(i);
		cel.textContent = usuario[i];
	}

	insertButtonExcluir(row.insertCell(-1))
	removeElement()
	insertButtonDetalhar(row.insertCell(-1))
	getElement()
}

/*
--------------------------------------------------------------------------------------
Função que cria botão para apagar registros da lista de usuários
--------------------------------------------------------------------------------------
*/
const insertButtonExcluir = (parent) => {

	let spanExcluir = document.createElement("span");
	let imagemExcluir = document.createElement("img");
	imagemExcluir.src = "https://cdn-icons-png.flaticon.com/512/126/126468.png";
	imagemExcluir.height = "20";
	imagemExcluir.width = "20";
	spanExcluir.className = "close";
	spanExcluir.appendChild(imagemExcluir);
	parent.appendChild(spanExcluir);
}

/*
--------------------------------------------------------------------------------------
Função que cria botão para detalhar registros de usuários da lista
--------------------------------------------------------------------------------------
*/
const insertButtonDetalhar = (parent) => {

	let spanDetalhar = document.createElement("span");
	let imagemDetalhar = document.createElement("img");
	imagemDetalhar.src = "https://cdn-icons-png.flaticon.com/512/126/126474.png";
	imagemDetalhar.height = "20";
	imagemDetalhar.width = "20";
	spanDetalhar.className = "detalhar";
	spanDetalhar.appendChild(imagemDetalhar);
	parent.appendChild(spanDetalhar);
}

/*
--------------------------------------------------------------------------------------
Função para remover registro da lista de acordo com o click no botão close
--------------------------------------------------------------------------------------
*/
const removeElement = () => {
	
	let close = document.getElementsByClassName("close");
	let i;
	for (i = 0; i < close.length; i++) {
		close[i].onclick = function () {
		let div = this.parentElement.parentElement;
		const nomeItem = div.getElementsByTagName('td')[0].innerHTML
		if (confirm("Confirma Exclusão?")) {
			div.remove()
			deleteItem(nomeItem)
			alert("Dados Apagados!")
		}
		}
	}
}

/*
--------------------------------------------------------------------------------------
Função para deletar um registro da lista do servidor 
--------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
	let url = 'http://127.0.0.1:5000/usuario?login=' + item;
	fetch(url, {
		method: 'delete'
	})
		.then((response) => response.json())
		.catch((error) => {
		console.error('Error:', error);
		});
}

/*
--------------------------------------------------------------------------------------
Função para recuperar dados do usuário
--------------------------------------------------------------------------------------
*/
const getElement = () => {
	let detalhar = document.getElementsByClassName("detalhar");
	let i;
	for (i = 0; i < detalhar.length; i++) {
		detalhar[i].onclick = function () {
		document.getElementById("divTabelaComentarios").style.display = "block";
		let div = this.parentElement.parentElement;
		const nomeItem = div.getElementsByTagName('td')[0].innerHTML
			detalharItem(nomeItem)
		}
	}
}

/*
--------------------------------------------------------------------------------------
Função para obter a lista existente do servidor 
--------------------------------------------------------------------------------------
*/
const detalharItem = async (item) => {
	let url = 'http://127.0.0.1:5000/usuario?login=' + item;
	fetch(url, {
		method: 'get',
	})
	.then((response) => response.json())
	.then((data) => {
		populaFormulario(data.comentarios)
	})
	.catch((error) => {
	console.error('Error:', error);
	});
}

/*
--------------------------------------------------------------------------------------
Função para popular a popup com os comentários dos usuários
--------------------------------------------------------------------------------------
*/
const populaFormulario = (comentarios) => {

	var tabelaComentarios = document.getElementById('tabelaComentarios');
	for (var i = 0; i < comentarios.length; i++) {
		var row = tabelaComentarios.insertRow();
		var cel = row.insertCell();
		cel.textContent = comentarios[i].descricao;
	}
}

/*
--------------------------------------------------------------------------------------
Função para colocar um comentário na lista do servidor 
--------------------------------------------------------------------------------------
*/
const inserirComentario = async (loginValor, descricaoValor) => {
	const formData = new FormData();
	formData.append('descricao', descricaoValor);
	formData.append('login', loginValor);
 
	let url = 'http://127.0.0.1:5000/comentario';
	fetch(url, {
	  method: 'post',
	  body: formData
	})
	  .then((response) => response.json())
	  .catch((error) => {
		console.error('Error:', error);
	  });
}


/*
--------------------------------------------------------------------------------------
Função principal, que recupera os dados do formulário e grava os dados no banco
--------------------------------------------------------------------------------------
*/
$(function() {

	var contactForm = function() {

		if ($('#contactForm').length > 0 ) {
			$( "#contactForm" ).validate( {
				rules: {
					login:"required",
					nome:"required",
					comentario: {
						required: true,
						minlength: 5
					}
				},
				messages: {
					login: "Sem o login não conseguimos te identificar",
					nome: "Sem seu nome, como iremos te chamar?",
					comentario: "Sem o comentário não rola! :-)"
				},

				/* submit via ajax */
				submitHandler: function(form) {		
					$.ajax({   	
				      type: "POST",
				      url: "http://127.0.0.1:5000/usuario",
				      data: $(form).serialize(),
					  
				      success: function(msg) {
						setTimeout(function(){
							$('#form-message-success').fadeIn();   
						}, 500);
						$('#form-message-warning').css('display', 'none');
						insertList(msg.login, msg.nome);
						console.log(form.comentario.value);
						inserirComentario(msg.login, form.comentario.value);
				      },

				      error: function(msg) {
						$('#form-message-success').css('display', 'none');
				      	$('#form-message-warning').html(msg.responseJSON.mensagem);
				        $('#form-message-warning').fadeIn();

				      }

			      });    		
		  		}
			} );
		}
	};

	contactForm();
});

function openForm() {
	document.getElementById("tabelaComentarios").style.display = "block";
}
  
function closeForm() {
		
	var linhas = document.getElementById("tabelaComentarios").rows;
	var tabela = document.getElementById("tabelaComentarios");
	while (linhas.length > 1) {
		tabela.deleteRow(1)
	}
		document.getElementById("divTabelaComentarios").style.display = "none";
}


var modal = document.getElementById("divTabelaComentarios");

var span = document.getElementsByClassName("fechar")[0];
 
/*
--------------------------------------------------------------------------------------
Função que fecha a modal com os comentários, excluindo registros da página
--------------------------------------------------------------------------------------
*/
span.onclick = function() {
   
	var linhas = document.getElementById("tabelaComentarios").rows;
	var tabela = document.getElementById("tabelaComentarios");
	while (linhas.length > 1) {
		tabela.deleteRow(1)
	}
	modal.style.display = "none";
}
 

/*
--------------------------------------------------------------------------------------
Função que fecha a modal com os comentários, excluindo registros da página
--------------------------------------------------------------------------------------
*/
window.onclick = function(event) {
   if (event.target == modal) {
	var linhas = document.getElementById("tabelaComentarios").rows;
	var tabela = document.getElementById("tabelaComentarios");
	while (linhas.length > 1) {
		tabela.deleteRow(1)
	}
	 modal.style.display = "none";
   }
}