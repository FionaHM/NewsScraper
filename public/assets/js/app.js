function openAndCloseArticle(id){
    var currentID = '#' + id;
    // click to show 
    if ($(currentID).hasClass("full-article")){
        // show everything
        $(currentID).removeClass("full-article");
        $.get("/article/" + id, function(){
            // get all comments etc and display them
            //** to do */
        })
    } else {
        $("#" + id).addClass("full-article");
    }

    // get id of user
    //  var userObj = {username: $('#username').val().trim()}
    var userid = $('#current-username').attr("data-id");
    console.log(userid);
        $('#form'+id).html('New Comment:<input  type="text" name="comment"/>');
        $('#form'+id).append('<input type="hidden" name="userid" value="' + userid + '">');
        $('#form'+id).append('<input type="hidden" name="articleid" value="' + id + '">');
        $('#form'+id).append("<button>Submit</button>");
      
    
}


function createOrFindUser(){
     var userObj = {username: $('#username').val().trim()}
     $.post("/user", userObj, function(data, success){
           console.log(data);
           if (success){
               $('.initial-data').hide();
               $('#user').append('<div id="current-username" data-id="'+data._id+'"> Welcome ' + data.username + '!></div>');
               $('.valid-user').show();
            //    $('.new-user-comment').html("<input type='hidden' name='id' value='" + data._id + "'>");

           }
     })

}