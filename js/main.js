$(document).ready(function() {

//Скрипт тоглла меню
	$(".toggle-menu").click(function() {
		$(".nav").slideToggle();
	});

//Скрипт добавления класса active элементам меню
    $('a[href="' + this.location.pathname + '"]').parent().addClass('active');

//Скрипт проверки и отправки сообщения
$(document).ready(function() {
    $('#send-message')
        .formValidation({
            message: 'Поле заполнено неверно!',
            icon: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
      err: {
          container: 'tooltip'
      },
            fields: {
                name: {
                    message: 'Имя введено неверно!',
                    validators: {
                        notEmpty: {
                            message: 'Введите имя'
                        },
                        stringLength: {
                            min: 1,
                            max: 64,
                            message: 'Длина поля "Имя" превышает максимум (64)!'
                        }
                    }
                },
                email: {
                    validators: {
                        notEmpty: {
                            message: 'Введите Email'
                        },
                        emailAddress: {
                            message: 'Email введен неверно'
                        }
                    }
                },
                subject: {
                    validators: {
                        notEmpty: {
                            message: 'Введите тему'
                        },
                        stringLength: {
                            min: 1,
                            max: 64,
                            message: 'Длина поля "Тема" превышает максимум (64)!'
                        }
                    }
                },
                message: {
                    validators: {
                        notEmpty: {
                            message: 'Введите сообщение'
                        },
                        stringLength: {
                            min: 1,
                            max: 512,
                            message: 'Длина сообщения превышает максимум (512)!'
                        }
                    }
                }
            }
        })
        .on('success.form.fv', function(e) {
            e.preventDefault();

            var $form = $(e.target);

            var bv = $form.data('formValidation');

            $.ajax({
                url: '/contacts/showResponse',
                type: 'POST',
                data: $form.serialize(),
                success: function(result) {
                    if(result === 'Сообщение успешно отправлено!') {
                      $(".message-result").removeClass("alert-danger").addClass("alert-success");
                      $("#send-message").trigger('reset');
                    } else {
                      $(".message-result").removeClass("alert-success").addClass("alert-danger");
                    }
                    $(".message-result").html(result);
                    $(".message-result").show('slow').delay(5000).hide('slow');
                }
            });
        });
});

//Скрипт проверки и загрузки webm
$(document).ready(function() {
    $('#webm-upload')
        .formValidation({
            message: 'Поле заполнено неверно!',
            icon: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            err: {
                container: 'tooltip'
            },
            fields: {
                webmUpload: {
                    validators: {
                      notEmpty: {
                            message: 'Выберите webm для загрузки!'
                        },
                        file: {
                            extension: 'webm',
                            type: 'video/webm',
                            maxSize: 8*1024*1024,
                            message: 'Выберите webm файл размером не более 8 МБ'
                        }
                    }
                },
                message: {
                    validators: {
                        stringLength: {
                            min: 0,
                            max: 128,
                            message: 'Длина сообщения превышает максимум (128)!'
                        }
                    }
                }
            }
        })
        .on('success.form.fv', function(e) {
            e.preventDefault();

             var formData = new FormData($('#webm-upload')[0]);

             $.ajax({
        xhr: function()
        {
          var xhr = new window.XMLHttpRequest();
          xhr.upload.addEventListener("progress", function(e){
            if (e.lengthComputable) {
              var percentComplete = Math.round((e.loaded / e.total) * 100);
              $(".upload-progress").val(percentComplete);
            }
          }, false);
          return xhr;
        },
        type: "POST",
          processData: false,
          contentType: false,
          url: '/add/showResponse', 
          data: formData,
          beforeSend: function(){
            $(".upload-progress").val(0);
          },
        success: function(result){
          if(result === 'Файл успешно загружен и отправлен на проверку!') {
            $(".webm-result").removeClass("alert-danger").addClass("alert-success");
            $("#webm-upload").trigger('reset');
          } else {
            $(".webm-result").removeClass("alert-success").addClass("alert-danger");
          }
          $(".webm-result").html(result);
          $(".webm-result").show('slow').delay(5000).hide('slow');
        },
      });
        });
});

//Скрипт кастомной кнопки выбора файла
$(document).on('change', '.btn-file :file', function() {
  var input = $(this),
      numFiles = input.get(0).files ? input.get(0).files.length : 1,
      label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
  input.trigger('fileselect', [numFiles, label]);
});

$(document).ready( function() {
    $('.btn-file :file').on('fileselect', function(event, numFiles, label) {
        
        var input = $(this).parents('.input-group').find(':text'),
            log = numFiles > 1 ? numFiles + ' files selected' : label;
        
        if( input.length ) {
            input.val(log);
        } else {
            if( log ) alert(log);
        }
        
    });
});
});

//Скрипт генерации случайной webm
function RandomWebm() {
  $('video').trigger('pause');
  $(".static").show(0);
  $(".static").trigger('play');
  setTimeout("$('#webm').load('/ #webm');", 1000);
  $('.play').prop('disabled', true);
  setTimeout("$('.play').prop('disabled', false);", 1000);
}