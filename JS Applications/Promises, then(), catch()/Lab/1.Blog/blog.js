$(document).ready(function(){

    const kinveyAppId = "kid_BJ3KW4y_-";
    const serviceUrl = "https://baas.kinvey.com/appdata/" + kinveyAppId;
    const kinveyUsername = "peter1";
    const kinveyPassword = "p";
    const base64auth = btoa(kinveyUsername +":"+kinveyPassword);
    const authHeaders = {"Authorization": "Basic " + base64auth};

    $("#btnLoadPosts").click(loadPostsClicked);
    $("#viewPosts").click(viewPostClicked);

    function loadPostsClicked() {
        let getPostsRequest = {
                method: "GET",
                url: serviceUrl + "/posts",
                headers: authHeaders,
            };
        $.ajax(getPostsRequest)
            .then(displayPostsInDropDown)
            .catch(displayError);
    }
    function displayPostsInDropDown(posts) {
        // $('#posts').empty();
        for(let post of posts){
            let option = $("<option>");
            option.text(post.title);
            option.val(post._id);
            $('#posts').append(option);
        }
    }
    function displayError(error) {
        
        let errDiv = $("<div>").text("Error : "+ error.status + " " + error.statusText);
        $(document.body).prepend(errDiv);

        setTimeout(function() {
            errDiv.fadeOut(function(){errDiv.remove()});
        }, 2000);
    }

    function viewPostClicked(){
        let selectedPost = $("#posts").val();
        let getSelectedPostRequest = {
                method: "GET",
                url: serviceUrl + "/posts/"+ selectedPost,
                headers: authHeaders,
            };
        $.ajax(getSelectedPostRequest)
            .then(displayPostBody)
            .catch(displayError);

    }
    function displayPostBody (post){
        $('#post-title').text(post.title);
        $('#post-body').text(post.body);
        let selectedPost = $("#posts").val();
        let getSelectedPostCommentRequest = {
                method: "GET",
                url: serviceUrl + "/comments/"+ `?query={"post_id":"${selectedPost}"}`,
                headers: authHeaders,
            };
        $.ajax(getSelectedPostCommentRequest)
            .then(displayComment)
            .catch(displayError);
    }

    function displayComment(comments){
        $('#post-comments').empty();
        for(let comment of comments){
            ($('<li>').text(comment.text)).appendTo('#post-comments');
        }
    }
});