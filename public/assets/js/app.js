function openAndCloseArticle(id){
    var currentID = '#' + id;
    // click to show details of article including comments
    // console.log("currentID", currentID);
    if ($(currentID).hasClass("full-article")){
        // show everything
        $(currentID).removeClass("full-article");
        // $.get("/article/" + id, function(){
        //     // get all comments etc and display them
        //     //** to do */
        // })
    } else {
        $("#" + id).addClass("full-article");
    }

    // get id of user
    //  var userObj = {username: $('#username').val().trim()}
    var userid = $('#current-user-id').attr("data-id");
    var username = $('#current-user-id').attr("data-username");
    $('#form'+id).html('New Comment:<input  type="text" name="comment"/>');
    $('#form'+id).append('<input type="hidden" name="userid" value="' + userid + '">');
    $('#form'+id).append('<input type="hidden" name="articleid" value="' + id + '">');
    $('#form'+id).append('<input type="hidden" name="username" value="' + username + '">');
    $('#form'+id).append("<button>Submit</button>");
         
}

function verifyOwner(creatorId, commentId, articleId){
     var currentuserid = $('#current-user-id').attr("data-id");
     var currentusername = $('#current-user-id').attr("data-username");
     console.log(currentuserid, "currentuserid",creatorId, "creatorId" );
     if (currentuserid===creatorId){
        $('#err-'+ articleId).html("");
        // allow the user to delete their own comments only
         console.log(true);
         var commentObj = { commentId: commentId, creatorId: creatorId, userid: currentuserid, username: currentusername};
         console.log("commentObj", commentObj);
         $.post("/comment/one", commentObj, function(data, success){


         }).done(function(data){
        //    console
            var dataObj = {username: data.username, id: data.id};
            console.log("dataObj", dataObj);
            window.location.replace("/"+JSON.stringify(dataObj));

        })



     } else {
         console.log('#err-'+ articleId);
         $('#err-'+ articleId).append("<div class='err-msg'>You can only delete your own comments!</div>")
     }

}

function createOrFindUser(){
     var userObj = {"username": $('#username').val().trim()}
     console.log(userObj);
     $.post("/user", userObj, function(data, success){
        //    console.log("post data", data);
        //    if (success){
        //        $('.initial-data').hide();
        //        $('#user').append('<div id="current-username" data-id="'+data._id+'"> Welcome ' + data.username + '!></div>');
               
        //     //    $('.new-user-comment').html("<input type='hidden' name='id' value='" + data._id + "'>");

        //    }
     }).done(function(data){
        
         var dataObj = {username: data.username, id: data._id};
         console.log("dataObj", dataObj);
         window.location.replace("/"+JSON.stringify(dataObj));

     })

}

// $('document').on('load', function(){

// })
// function saveUser(userid){
//     console.log("userid", userid);
// }