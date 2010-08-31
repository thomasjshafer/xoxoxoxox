$('a#add-code-show').live('click', function(){
  $('a#add-code-show').hide();
  $('a#add-code-hide').show();
  $('form#new_ai_implementation').show();
  WindowHandler.resize();
});

//TODO render list item from view not create on client
$('.publishing-actions input[type=submit]').live('click',function(ev){
  ev.preventDefault();
  var publishForm = $(this).closest('form');
  var listItem = $(this).closest('li');
  var actionsWrapper = $(this).closest('.publishing-actions');
  publishForm.find('input.publish-input').val($(this).attr('data-publish'));
  publishForm.ajaxSubmit({
    dataType: 'json',
    success: function(data){
      if(data.ai_implementation.published){
        actionsWrapper.find('.publish').hide();
        actionsWrapper.find('.unpublish').show();
        listItem.removeClass('unpublished').addClass('published');
      }else{
        actionsWrapper.find('.publish').show();
        actionsWrapper.find('.unpublish').hide();
        listItem.removeClass('published').addClass('unpublished');
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
  ev.preventDefault();
  $(this).ajaxSubmit({
    dataType: 'json',
    type: 'put',
    success: function(data){
      var newItem = $('<li>').addClass('load-ai-code').attr('data-service-url', data.ai_implementation.service_url);
      newItem.text(data.ai_implementation.name);
      $('li.add-form-wrapper').after(newItem);
      newItem.click();
      $('a#add-code-hide').click();
      }
  });
  return false;
});

$('#save-code').live('click', function(){
  Account.saveCode($('textarea#user_ai').val());
});

$('li.load-ai-code:not(.selected)').live('click', function(){
  var self = $(this);
  $.get(self.attr('data-service-url'), function(data){
    $('li.load-ai-code.selected').removeClass('selected');
    self.addClass('selected');
    $('textarea#user_ai').val(data.ai_implementation.code);
    Account.setCode(data.ai_implementation.id);
    $('textarea#user_ai').blur();
  }, 'json');
});

$('textarea#user_ai').live('blur', function(){
  var userCode = $('textarea#user_ai').val() +"return {move:move};";
  var UserAI = new Function(userCode)();
  AIDriver.setAI(UserAI);
});