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
		let txt = document.createTextNode("\u00D7");
		span.className = "close";
		span.appendChild(txt);
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
		console.log(item)
		let url = 'http://127.0.0.1:5000/usuario?login=' + item;
		fetch(url, {
		  method: 'delete'
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