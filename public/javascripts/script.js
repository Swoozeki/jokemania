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
  if(this.classList.contains('disallowed')) return false; //return false if user is not allowed to vote.
  const postId = this.dataset.postid;
  const vote = this.id;

  $.post(`/post/${postId}/${vote}`, function(response){
    $('#upvote').html(`+${response.upvotes}`);
    $('#downvote').html(`-${response.downvotes}`);
  });
});

$('.vote').popover({content:'You must log in to vote!', placement: 'bottom', trigger: 'manual'});

$('.vote').on('mouseenter', function(e){
  if(this.classList.contains('disallowed')) $(this).popover('show');
});
$('.vote').on('mouseleave', function(e){
  if(this.classList.contains('disallowed')) $(this).popover('hide');
});
