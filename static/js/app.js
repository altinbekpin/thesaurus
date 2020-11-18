function DoSubmit(question) {
    $('#result').html("<div class='d-flex justify-content-center'><div class='spinner-border text-primary' role='status'> <span class='sr-only'Loading...</span></div></div>");
    $('#question').val(question);
    $.ajax({
        type:'POST',
        url:'ask/',
        data: {
          question:$('#question').val(),
          language:$('#lang').val(),
          csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
        },
        success:function(data) {
          $('#result').html(data);
        }
      });
    //$.post('server.php', $('#theForm').serialize())
    
}