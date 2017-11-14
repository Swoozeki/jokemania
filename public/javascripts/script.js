const modal = $('#portal-modal');
modal.on('show.bs.modal', function(event){
  const button = $(event.relatedTarget);
  const type =  button.data('type');

  if(type==='create-account'){
    modal.find('.modal-title').text('Create New Account');
    modal.find('#portal-form').attr('action', '/register');
    // history.pushState(null, null, 'register');
  }else{
    modal.find('.modal-title').text('Log In');
    modal.find('#portal-form').attr('action', '/login');
    // history.pushState(null, null, 'login');
  }
});

$('.vote').on('click', function(e){
  const postId = this.dataset.postid;
  const vote = this.id;

  $.post(`/${postId}/${vote}`, function(response){
    $('#upvote').html(`+${response.upvotes}`);
    $('#downvote').html(`-${response.downvotes}`);
  });
});

$('#next').on('click', function(e){
  console.log('next was just clicked!');
  $.get('/');
});
