var AIMaker = new function(){
  
  var editor;
  
  function init(){
    // if(editor == null){
      makeFreshEditor();
    // }else{
    //   updateEditor();
    // }
  }
  
  function makeFreshEditor(){
    editor = CodeMirror.fromTextArea("user_ai", {
      autoMatchParens: true,
      lineNumbers: true,
      textWrapping: false,
      saveFunction: function(ev){
        $('#save-code').click();
      },
      parserfile: ["tokenizejavascript.js", "parsejavascript.js"],
      path: "/javascripts/frameworks/code-mirror/",
      stylesheet: "/stylesheets/code-mirror/jscolors.css",
      initCallback: function(){
        AIMaker.ensureCurrentCode();
      }
    });
  }
  
  function updateEditor(){
    ensureCurrentCode();
  }
  
  function setCode(code){
    editor.setCode(code);
  }
  
  function getCode(){
    return editor.getCode();
  }
  
  function ensureCurrentCode(){
    $('textarea#user_ai').val(getCode());
    var UserAI = wrapCode($('textarea#user_ai').val());
    AIDriver.setAI(UserAI);
  }
  
  function wrapCode(code){
    try{
      return new Function(code +"return {move:move};")();
    }catch (e){
      Logger.error(e.name + ': '+e.message);
      throw e;
    }
  }
  
  
  return {
    init: init,
    setCode: setCode,
    getCode: getCode,
    ensureCurrentCode: ensureCurrentCode,
    wrapCode: wrapCode
  };
}();

$('a#add-code-show').live('click', function(){
  $('a#add-code-show').hide();
  $('a#add-code-hide').show();
  $('form#new_ai_implementation').show();
  WindowHandler.resize();
});

$('#show-help').live('click', function(ev){
  Help.show();
});

$('.publishing-actions input[type=submit]').live('click',function(ev){
  ev.preventDefault();
  var publishForm = $(this).closest('form');
  var listItem = $(this).closest('li');
  var actionsWrapper = $(this).closest('.publishing-actions');
  actionsWrapper.find('.publish').hide();
  actionsWrapper.find('.unpublish').hide();
  publishForm.find('.form-loader').show();
  publishForm.find('input.publish-input').val($(this).attr('data-publish'));
  publishForm.ajaxSubmit({
    dataType: 'json',
    type: 'put',
    success: function(data){
      publishForm.find('.form-loader').hide();
      if(data.ai_implementation.published){
        actionsWrapper.find('.publish').hide();
        actionsWrapper.find('.unpublish').show();
        listItem.removeClass('unpublished').addClass('published');
        // actionsWrapper.show();

      }else{
        actionsWrapper.find('.publish').show();
        actionsWrapper.find('.unpublish').hide();
        listItem.removeClass('published').addClass('unpublished');
        // actionsWrapper.show();
      }
    }
  });
  return false;
});

$('a#add-code-hide').live('click', function(){
  $('a#add-code-show').show();
  $('a#add-code-hide').hide();
  var form = $('#new_ai_implementation').hide();
  form.find('input[type=text]').each(function(index){
    $(this).val('');
  });
  WindowHandler.resize();
});

$('#new_ai_implementation').live('submit', function(ev){
  var theForm = $(this);
  ev.preventDefault();
  theForm.find('fieldset.buttons').hide();
  theForm.find('.form-loader').show();
  theForm.ajaxSubmit({
    dataType: 'js',
    success: function(data){
      
      $('#ai-code-list').find('li.selected').removeClass('selected');
      var newItem = $(data);
      $('#ai-code-list').find('li.add-form-wrapper').after(newItem);
      newItem.click();
      $('a#add-code-hide').click();
        theForm.find('fieldset.buttons').show();
        theForm.find('.form-loader').hide();
      WindowHandler.resize();
      }
  });
  return false;
});

$('#save-code').live('click', function(){
  $('textarea#user_ai').val(AIMaker.getCode());
  Account.saveCode($('textarea#user_ai').val());
});

$('li.load-ai-code:not(.selected)').live('click', function(){
  var self = $(this);
  $.get(self.attr('data-service-url'), function(data){
    $('li.load-ai-code.selected').removeClass('selected');
    self.addClass('selected');
    $('textarea#user_ai').val(data.ai_implementation.code);
    AIMaker.setCode(data.ai_implementation.code);
    Account.setCode(data.ai_implementation.id);
    $('textarea#user_ai').blur();
  }, 'json');
});

$('textarea#user_ai').live('blur', function(){
  AIMaker.ensureCurrentCode();
});

shortcut.add("Ctrl+s",function() {
  $('#save-code').click();
});
shortcut.add("Ctrl+m",function() {
  Help.show();
});