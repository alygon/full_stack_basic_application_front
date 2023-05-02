/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
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
    Função para inserir registros na tabela mais abaixo na página
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
		insertButton(row.insertCell(-1))
		removeElement()
	}

/*
    --------------------------------------------------------------------------------------
    Função que cria botão para apagar registro da lista
    --------------------------------------------------------------------------------------
  */
	const insertButton = (parent) => {
		let span = document.createElement("span");
		let imagem = document.createElement("img");
		imagem.src = "https://cdn-icons-png.flaticon.com/512/126/126468.png";
		imagem.height = "15";
		imagem.width = "15";
		span.className = "close";
		span.appendChild(imagem);
		parent.appendChild(span);
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
    Função para deletar um registro da lista do servidor via requisição DELETE
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
  Função para colocar um comentário na lista do servidor via requisição POST
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