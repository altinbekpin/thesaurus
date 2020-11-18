const LabelEnum = Object.freeze({"descriptor":1, "definition":2, "question":3, "gyphonim":4})
function DoSubmit(question, lang = null) {
    $('#result').html("<div class='d-flex justify-content-center'><div class='spinner-border text-primary' role='status'> <span class='sr-only'Loading...</span></div></div>");
    $('#question').val(question);
    $.ajax({
        type:'POST',
        url:'../ask/',
        data: {
          question:$('#question').val(),
          language: lang==null ? $('#lang').val() : lang,
          csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
        },
        success:function(data) {
          $('#result').html(data);
        }
      });
    //$.post('server.php', $('#theForm').serialize())
    
}

function DoSubmitUniturk(question, lang = null) {
  $('#uniturk_result').html("<div class='d-flex justify-content-center'><div class='spinner-border text-primary' role='status'> <span class='sr-only'Loading...</span></div></div>");
  $('#uniturk').val(question);
  $.ajax({
      type:'POST',
      url:'../getuniturk/',
      data: {
        uniturk:question,
        language: lang==null ? $('#lang').val() : lang,
        csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
      },
      success:function(data) {
        $('#uniturk_result').html(data);
      }
    });
  //$.post('server.php', $('#theForm').serialize())
  
}

function AddLabel(modalform,modal_result,uniturk,label,type)
{
  $(modal_result).html("");
  
  
  if ((uniturk=="") || (label=="") || (type==""))
  {
    alert("Мәліметтерді толық енгізіңіз");
    return;
  }
  $(modal_result).html("<div class='d-flex justify-content-center'><div class='spinner-border text-primary' role='status'> <span class='sr-only'Loading...</span></div></div>");
  $.ajax({
    type:'POST',
    url:'../addlabel/',
    data: {
      uniturk:uniturk,
      language:$('#lang').val(),
      label:label,
      type:type,
      csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
    },
    success:function(data) {
      alert(data);
      if (data=='Сәтті қосылды')
      {
          $(modal_result).html("");
          $(modalform +"  .close").click();
          DoSubmitUniturk(uniturk);
      }

    }
  });
  
}
function EditLabel(modalform,modal_result,uniturk,label,oldlabel,type)
{
  
  $(modal_result).html("");
  if ((uniturk=="") || (label=="") || (type==""))
  {
    alert("Мәліметтерді толық енгізіңіз");
    return;
  }
  $(modal_result).html("<div class='d-flex justify-content-center'><div class='spinner-border text-primary' role='status'> <span class='sr-only'Loading...</span></div></div>");
  $.ajax({
    type:'POST',
    url:'../editlabel/',
    data: {
      uniturk:uniturk,
      language:$('#lang').val(),
      label:label,
      oldlabel:oldlabel,
      type:type,
      csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
    },
    success:function(data) {
      alert(data);
      if (data=='Сәтті өзгертілді')
      {
          $(modal_result).html("");
          $(modalform +"  .close").click();
          DoSubmitUniturk(uniturk);
      }

    }
  });
  
}
function writeToFile(filename, text){
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(text, null, 2)], {
    type: "text/plain"
  }));
  a.setAttribute("download", filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
function SendAudio(pos,diff)
{
  
  var files = [];
  $('#wav_result').html("<div class='d-flex justify-content-center'><div class='spinner-border text-primary' role='status'> <span class='sr-only'Loading...</span></div></div>");
  var start = new Date();
  let promises = [];
for (i = pos; i <pos + 1000; i++) {
  if (i>=$('#wavFiles')[0].files.length)
    break;
  var fileContent = new FormData();
  fileContent.append("audio",$('#wavFiles')[0].files[i]);
  fileContent.append("processorid",$( "#model" ).val());
  fileContent.append("csrfmiddlewaretoken",$('input[name=csrfmiddlewaretoken]').val());
  promises.push(
    window.axios.post(($( "#model" ).val() == 0 ?'http://localhost:5000/model/predict': '../audiohub/'),fileContent, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },})
   .then(response => {
      // do something with response
      let arrData = response.data;
      
      if (arrData.status != 'error')
        {
          var obj = {
           "filename" :  i,
           "json" : arrData.embedding,
          }
         files.push(obj) ;
        }
    })
  )
}

Promise.all(promises).then(() => 
{

  var final = new Date();
  var count = final - start;
  diff = diff  + count; //milliseconds interval
  var min = Math.floor((diff/1000/60) << 0);
  var sec = Math.floor((diff/1000) % 60);
  $('#wav_result').html("<p>Обработанов "+ i.toString() + " файлов за " + min.toString() +" минут " + sec.toString() +" секунд </p>");
  writeToFile('result.json',files); 
  if (i<$('#wavFiles')[0].files.length)
    SendAudio(i, diff);
});


 

  


}
function SelectLanguage() {
  var x = document.getElementById("lang").value;
  curl = window.location.href.split('/');
  curl = window.location.href+ 'lang/'+ x;
  
  $.ajax({
    type:'POST',
    url:curl,
    data: {csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
  },
    success:function(data) {
      $('#treeview').html(data);
    }
  });
}

function DeleteUniturk(uniturk)
{
  $('#modal_result_remove_gyphonim').html("");
 
  $('#modal_result_remove_gyphonim').html("<div class='d-flex justify-content-center'><div class='spinner-border text-primary' role='status'> <span class='sr-only'Loading...</span></div></div>");
  $.ajax({
    type:'POST',
    url:'../removeuniturk/',
    data: {
      uniturk:uniturk,
      language:$('#lang').val(),
      csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
    },
    success:function(data) {
      alert(data);
      if (data=='Сәтті өшірілді')
      {
          $('#modal_result_remove_gyphonim').html("");
          $("#removeGyphonim  .close").click();
          DoSubmitUniturk($('#uniturk').val());
      }

    }
  });
}