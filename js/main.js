$(function() {

	'use strict';

	var contactForm = function() {

		if ($('#contactForm').length > 0 ) {
			$( "#contactForm" ).validate( {
				rules: {
					login:"required",
					nome:"required",
					senha:"required",
				},
				messages: {
					login: "Sem o login não conseguimos te identificar",
					nome: "Sem seu nome, como iremos te chamar?",
					senha: "Sem a senha a gente não termina o cadastro",
				},

				/* submit via ajax */
				submitHandler: function(form) {		
					
					var $submit = $('.submitting'),
						waitText = 'Enviando ...';

					const formData = new FormData();
					formData.append('login', login);
					formData.append('nome', nome);
					formData.append('senha', senha);

					$.ajax({   	
				      type: "POST",
				      url: "http://127.0.0.1:5000/usuario",
				      data: $(formData).serialize(),

				      beforeSend: function() { 
				      	$submit.css('display', 'block').text(waitText);
				      },
					  
				      success: function(msg) {
		               if (msg == 'OK') {
		               	$('#form-message-warning').hide();
				            setTimeout(function(){
		               		$('#contactForm').fadeOut();
		               	}, 1000);
				            setTimeout(function(){
				               $('#form-message-success').fadeIn();   
		               	}, 1400);
			               
			            } else {
			               $('#form-message-warning').html(msg);
				            $('#form-message-warning').fadeIn();
				            $submit.css('display', 'none');
			            }
				      },
				      error: function() {
				      	$('#form-message-warning').html("Something went wrong. Please try again.");
				         $('#form-message-warning').fadeIn();
				         $submit.css('display', 'none');
				      }
			      });    		
		  		}
				
			} );
		}
	};
	contactForm();

});