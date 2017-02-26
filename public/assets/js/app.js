function openAndCloseArticle(id){
    // function to show details of article including comments
    var currentID = '#' + id;
    if ($(currentID).hasClass("full-article")){
        // show everything
        $(currentID).removeClass("full-article");
        // get id of user from the DOM
        var userid = $('#current-user-id').attr("data-id");
        var username = $('#current-user-id').attr("data-username");
        // dynamically paint the DOM passing in user information that will be required later
        $('#form'+id).html('New Comment:<input  type="text" name="comment"/>');
        $('#form'+id).append('<input type="hidden" name="userid" value="' + userid + '">');
        $('#form'+id).append('<input type="hidden" name="articleid" value="' + id + '">');
        $('#form'+id).append('<input type="hidden" name="username" value="' + username + '">');
        $('#form'+id).append('<button class="waves-effect waves-light btn">Submit</button>');
    } else {
        $("#" + id).addClass("full-article");
    }       
}

function openAndCloseArticle2(id){
    // function to show details of article including comments
    var currentID = '#' + id;
    if ($(currentID).hasClass("full-article")){
        // show everything
        $(currentID).removeClass("full-article");
        // get id of user from the DOM
        var userid = $('#current-user-id').attr("data-id");
        var username = $('#current-user-id').attr("data-username");
        // dynamically paint the DOM passing in user information that will be required later
        $('#form'+id).html('New Comment:<input  type="text" name="comment"/>');
        $('#form'+id).append('<input type="hidden" name="userid" value="' + userid + '">');
        $('#form'+id).append('<input type="hidden" name="articleid" value="' + id + '">');
        $('#form'+id).append('<input type="hidden" name="username" value="' + username + '">');
        $('#form'+id).append('<button class="waves-effect waves-light btn">Submit</button>');
    } else {
        $("#" + id).addClass("full-article");
    }       
}

function verifyOwner(creatorId, commentId, articleId){
     var currentuserid = $('#current-user-id').attr("data-id");
     var currentusername = $('#current-user-id').attr("data-username");
     // verify that the user doing the delete is the owner / creator of the comment
     if (currentuserid === creatorId){
        $('#err-'+ articleId).html("");
        // allow the user to delete their own comments only
         var commentObj = { commentId: commentId, creatorId: creatorId, userid: currentuserid, username: currentusername};
         $.post("/comment/one", commentObj, function(data, success){

         }).done(function(data){
            // var dataObj = {username: data.username, id: data.id};
            // // redirects to main page - passing the username and id as parameters for use later
            // window.location.replace("/"+JSON.stringify(dataObj));
             window.location.replace("/article/"+data.username+"/"+data.id);
        })
     } else {
         // send error message if user tries to delete another users comment
         $('#err-'+ articleId).html("<div class='err-msg'>You can only delete your own comments!</div>")
     }

}

function createOrFindUser(){
     // function to find exiting user or create another one
     var userObj = {"username": $('#username').val().trim().toUpperCase()}
     // post user information to the database
     $.post("/user", userObj, function(data, success){

     }).done(function(data){
         // redirects to main page - passing the username and id as parameters for use later
         window.location.replace("/article/"+data.username+"/"+data._id);
     })

}

function showDetails(id){
    if ($("#"+id).hasClass("show-detail")){
        $("#"+id).removeClass("show-detail");
    } else {
        $("#"+id).addClass("show-detail");
    }
}

function saveArticle(articleId){
    var currentuserid = $('#current-user-id').attr("data-id");
    var currentusername = $('#current-user-id').attr("data-username");
    var articleObj = { userid: currentuserid, username: currentusername, article: articleId};
    $.post("/article/id/", articleObj, function(data, success){

    }).done(function(data){
        //  change button to show saved?
        console.log(data);
        if (data === "saved"){
            $("#saved-msg-"+articleId).html("Article Saved....");
            $("#saved-"+articleId).addClass("hide");
            $("#unsave-"+articleId).removeClass("hide");
    } else {
        $("#saved-msg-"+articleId).html("Article Already Saved");
        $("#saved-"+articleId).addClass("hide");
        $("#unsave-"+articleId).removeClass("hide");
    }
    //  window.location.replace("/article/"+currentusername+"/"+currentuserid);
})

}


function removeArticle(articleId){
    var currentuserid = $('#current-user-id').attr("data-id");
    var currentusername = $('#current-user-id').attr("data-username");
    var articleObj = { userid: currentuserid, username: currentusername, article: articleId};
         $.post("/article/id/one", articleObj, function(data, success){

         }).done(function(data){
            //  change button to show saved?
            console.log(data);
             if (data === "removed"){
                $("#saved-msg-"+articleId).html("Article Removed....");
                $("#saved-"+articleId).removeClass("hide");
                $("#unsave-"+articleId).addClass("hide");

            } else {
                $("#saved-msg-"+articleId).html("Article Already Saved");
                $("#saved-"+articleId).removeClass("hide");
                $("#unsave-"+articleId).addClass("hide");

            }
            //  window.location.replace("/article/"+currentusername+"/"+currentuserid);
        })

}

function removeFavArticle(articleId){
    var currentuserid = $('#current-user-id').attr("data-id");
    var currentusername = $('#current-user-id').attr("data-username");
    var articleObj = { userid: currentuserid, username: currentusername, article: articleId};
         $.post("/article/id/favorite", articleObj, function(data, success){

         }).done(function(data){

            //  change button to show saved?
            //  window.location.replace("/article/"+currentusername+"/"+currentuserid);
             window.location.replace("/userarticle/"+data.username+"/"+data.userid);
        })

}