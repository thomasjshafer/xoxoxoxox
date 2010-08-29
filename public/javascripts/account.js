$('#login-link').live('click', function(ev){
  $('form#new_user_session').show();
});

$('#logout-link').live('click', function(ev){
  ev.preventDefault();
  $.get($(this).attr('href'));
  return false;
});

$('#signup-link').live('click', function(ev){
  $('form#new_user').show();
});

$('form#new_user_session').live('submit', function(ev){
  ev.preventDefault();
  $(this).ajaxSubmit({success: function(responseText, statusText, xhr){
    log(responseText)
  }});
  return false;
});

$('form#new_user').live('submit', function(ev){
  ev.preventDefault();
  $(this).ajaxSubmit({success: function(responseText, statusText, xhr){
    log(responseText)
  }});
  return false;
});

var Account = new function(){
  
  var userId, gameId;
  
  function login(newUserId){
    userId = newUserId;
  }
  
  function startGame(){
    if(userId == null){return;}
    $.post('/users/'+userId+'/games', function(data){
      gameId = data.game_id
      log(data, 'startGame')
    }, 'json');
  }
  
  function markMove(player, space){
    if(userId == null){return;}
    $.post('/users/'+userId+'/games/'+gameId+'/mark_move',{'move[player]': player, 'move[space]': space}, function(data){
      log(data, 'markMove');
    }, 'json')
  }
  
  function logout(){
    userId = null;
    gameId = null;
  }
  
  function endGame(){
    if(userId == null){return;}
    log('Insert AJAX call here to end game')
  }
  
  return {login: login, logout :logout, startGame: startGame, markMove: markMove, endGame: endGame}
}();