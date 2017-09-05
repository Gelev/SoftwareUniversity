function startApp(){
    //clear user auth data
    sessionStorage.clear();

    showHideMenuLinks();
    showView('viewHome');

    const kinveyBaseUrl = "https://baas.kinvey.com/";
    const appKey = "kid_r1AebB4tZ";
    const appSecret = "6362e0cd9d9a4e87b2b25ba9824f417b";
    const kinveyAuthHeaders = {
        'Authorization': "Basic " + btoa(appKey + ":" + appSecret)
    }

    //Bind the navigation menu links
    $('#linkHome').click(showHomeView);
    $('#linkLogin').click(showLoginView);
    $('#linkRegister').click(showRegisterView);
    $('#linkListBooks').click(listBooks);
    $('#linkCreateBook').click(showCreateBookView);
    $('#linkLogout').click(logoutUser);


    //Bind the form submit buttons

    $('#buttonLoginUser').click(loginUser);
    $('#buttonRegisterUser').click(registerUser);
    $('#buttonCreateBook').click(createBook);
    $('#buttonEditBook').click(editBook);

    function showHideMenuLinks(){
        $("#menu a").hide();

        if(sessionStorage.getItem('authToken')){
            //logged in user
            $("#linkHome").show();
            $("#linkListBooks").show();
            $("#linkCreateBook").show();
            $("#linkLogout").show();
        } else {
            //no user logged in
            $("#linkLogin").show();
            $("#linkRegister").show();
        }
    }
    function showView(viewName){
        $('main > section').hide();
        $('#' + viewName).show();
    }
    function showHomeView(){
        showView('viewHome');
    }
    function showLoginView(){
        showView('viewLogin');
        showHideMenuLinks();
        $('#formLogin').trigger('reset');
    }
    function showRegisterView(){
        $('#formRegister').trigger('reset');
        showView('viewRegister');
    }
    function listBooks(){
        $('#books').empty();
        showView('viewBooks');

         $.ajax({
            method: "GET",
            url: kinveyBaseUrl+"appdata/"+appKey+"/books",
            headers: getKinveyUserAuthHeaders(),
            contentType: 'application/json',
            success: loadBooksSuccess,
            error: handleAjaxError
        });
        function loadBooksSuccess(books){
            let table = `
                <table>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>                
                </table>`;
            $('#books').append(table);
            for(let book of books){
                let links =[];
                
                let deleteLink = $("<a href = '#'>[Delete]</a>")
                    .click(function (){deleteBookById(book._id);});
                let editLink = $("<a href = '#'>[Edit]</a>")
                    .click(function (){loadBookForEdit(book._id);});
                if(book._acl.creator == sessionStorage.getItem("userId")){
                    links.push(deleteLink);
                    links.push(' ');
                    links.push(editLink);
                }

                $('#books table').append($('<tr>').append(($('<td>').text(book.title)),
                                                            ($('<td>').text(book.author)),
                                                            ($('<td>').text(book.description)),
                                                            ($('<td>').append(links))
                ));

            }
        }

    }
    function deleteBookById(bookId){
         $.ajax({
            method: "DELETE",
            url: kinveyBaseUrl+"appdata/"+appKey+"/books/"+bookId,
            headers: getKinveyUserAuthHeaders(),
            contentType: 'application/json',
            success: deleteBooksSuccess,
            error: handleAjaxError
        });
        function deleteBooksSuccess(){
            showInfo("Book deleted.");
            listBooks();
        }
    }
    function getKinveyUserAuthHeaders(){
        return {"Authorization" : "Kinvey "+ sessionStorage.getItem('authToken')};
    }
    function showCreateBookView(){
        showView('viewCreateBook');
        
    }
    function loginUser(){
         let userData = {
            username: $('#formLogin input[name=username]').val(),
            password: $('#formLogin input[name=passwd]').val()
        };

        $.ajax({
            method: "POST",
            url: kinveyBaseUrl+"user/"+appKey+"/login",
            headers: kinveyAuthHeaders,
            data: JSON.stringify(userData),
            contentType: 'application/json',
            success: loginSuccess,
            error: handleAjaxError
        });
        function loginSuccess(userInfo){
            saveAuthInSession(userInfo);
            showHideMenuLinks();
            showView('viewHome');
            showInfo('Login successful.');
        }
    }
    function logoutUser(){
        sessionStorage.clear();
        
        showView('viewLogin');
        showHideMenuLinks();
        $('#loggedInUser').text('');
        showInfo("Logout successful.");
    }
    function registerUser(){
        let userData = {
            username: $('#formRegister input[name=username]').val(),
            password: $('#formRegister input[name=passwd]').val()
        };

        $.ajax({
            method: "POST",
            url: kinveyBaseUrl+"user/"+appKey+"/",
            headers: kinveyAuthHeaders,
            data: JSON.stringify(userData),
            contentType: 'application/json',
            success: registerSuccess,
            error: handleAjaxError
        });
        function registerSuccess(userInfo){
            saveAuthInSession(userInfo);
            showHideMenuLinks();
            showView('viewHome');
            showInfo('User registration successful.');
        }
        
    }
    function handleAjaxError(response){
        let errorMsg = JSON.stringify(response);
        if(response.readyState === 0){
            errorMsg = "Cannot connect due to network error.";
        }
        if(response.responseJSON && response.responseJSON.description){
            errorMsg = response.responseJSON.description;
        }
        showError(errorMsg);

    }
    function showError(msg){
        $('#errorBox').text("Error: " + msg);
        $('#errorBox').show();
    }
    function saveAuthInSession(userInfo){
        sessionStorage.setItem('username', userInfo.username);
        sessionStorage.setItem('authToken', userInfo._kmd.authtoken);
        sessionStorage.setItem('userId',userInfo._id);
        $('#loggedInUser').text("Welcome, " + userInfo.username);
    }
    function showInfo(message){
        $('#infoBox').text(message);
        $('#infoBox').show();
        setTimeout(function(){
            $('#infobox').fadeOut();}, 3000);
    }
    
    function createBook(){
        let bookData = {
            title: $('#formCreateBook input[name=title]').val(),
            author: $('#formCreateBook input[name=author]').val(),
            description: $('#formCreateBook textarea[name=description]').val()
        };
         $.ajax({
            method: "POST",
            url: kinveyBaseUrl+"appdata/"+appKey+"/books",
            headers: getKinveyUserAuthHeaders(),
            data: bookData,
            success: createBookSuccess,
            error: handleAjaxError
        });

        function createBookSuccess(){
            showInfo('Book created.');
            listBooks();
        }
    }
    function loadBookForEdit(bookId){
         $.ajax({
            method: "GET",
            url: kinveyBaseUrl+"appdata/"+appKey+"/books/"+bookId,
            headers: getKinveyUserAuthHeaders(),
            contentType: 'application/json',
            success: loadBookForEditSuccess,
            error: handleAjaxError
        });
        function loadBookForEditSuccess(book){
            $('#formEditBook input[name=id]').val(book._id);
            $('#formEditBook input[name=title]').val(book.title);
            $('#formEditBook input[name=author]').val(book.author);
            $('#formEditBook textarea[name=description]').val(book.description);

            showView('viewEditBook');
        }
    }
    function editBook(){
        let bookData = {
            title: $('#formEditBook input[name=title]').val(),
            author: $('#formEditBook input[name=author]').val(),
            description: $('#formEditBook textarea[name=description]').val()
        };
         $.ajax({
            method: "PUT",
            url: kinveyBaseUrl+"appdata/"+appKey+"/books/"+$('#formEditBook input[name=id]').val(),
            headers: getKinveyUserAuthHeaders(),
            data: bookData,
            success: editBookSuccess,
            error: handleAjaxError
        });

        function editBookSuccess(){
            showInfo('Book edited.');
            listBooks();
        }
    }


    //info and error boxes hide on click
    $("#infoBox, #errorBox").click(function(){
        $(this).fadeOut();
    }); 
    // Ajax event listener
    $(document).on({
        ajaxStart: function(){$('#loadingBox').show()},
        ajaxStop: function(){$('#loadingBox').hide()}
    });


}