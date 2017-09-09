function startApp() {

    sessionStorage.clear();
    showHideMenuLinks();
    showView('viewHome');

    $(document).on({
        ajaxStart: function(){$('#loadingBox').show()},
        ajaxStop: function(){$('#loadingBox').hide()}
    });

    const baseUrl = "https://baas.kinvey.com/";
    const appKey = "kid_H1x0IdTKb";
    const appSecret = "cf1f5046d84c4d50ac34418e0e3d7439";
    const authHeaders = {
        'Authorization': "Basic " + btoa(appKey + ":" + appSecret)
    };

    $('#buttonLoginUser').click(loginUser);
    $('#buttonRegisterUser').click(registerUser);
    $('#linkLogout').click(logOutUser);
    $('#buttonCreateAd').click(createAd);
    $('#buttonEditAd').click(editAd);

    function showView(viewToShow){
        $('main section').hide();
        $('#'+viewToShow).show();
        if(viewToShow === 'viewLogin' || viewToShow == 'viewRegister'){
            $('#formLogin').trigger('reset');
            $('#formRegister').trigger('reset');
        }
    }
    function showHideMenuLinks(){
        $('#menu a').hide();
        $('#menu span').hide();

        if(sessionStorage.getItem('authToken')){
            $('#linkHome').show().click(function (){showView ('viewHome');});
            $('#linkListAds').show().click(function (){listAds()});
            $('#linkCreateAd').show().click(function (){showView ('viewCreateAd');});
            $('#linkLogout').show().click(function (){showView ('viewHome');});
            $('#loggedInUser').show();
        } else {
            $('#linkHome').show().click(function (){showView ('viewHome');});
            $('#linkLogin').show().click(function (){showView ('viewLogin');});
            $('#linkRegister').show().click(function (){showView ('viewRegister');});
        }
    }

    function showInfo(message){
        $('#infoBox').text(message).show();
    }

    function loginUser(){
        let loginData = {
            username: $('#formLogin input[name=username]').val(),
            password: $('#formLogin input[name=passwd]').val()
        };

        $.ajax({
            method: "POST",
            url: baseUrl + 'user/' + appKey + '/login',
            headers: authHeaders,
            data: JSON.stringify(loginData),
            contentType: 'application/json',
            success: loginSuccess,
            error: handleAjaxError
        });

        function loginSuccess(userInfo) {
            sessionStorage.setItem('username', userInfo.username)
            sessionStorage.setItem('authToken', userInfo._kmd.authtoken);
            sessionStorage.setItem('userID', userInfo._id);
            showHideMenuLinks();
            $('#loggedInUser').text('Welcome, ' + userInfo.username);
            showView('viewHome');
        }
    }

    function registerUser(){
        let userData = {
            username: $('#formRegister input[name=username]').val(),
            password: $('#formRegister input[name=passwd]').val()
        };

        $.ajax({
            method: "POST",
            url: baseUrl + 'user/' + appKey,
            headers: authHeaders,
            data: JSON.stringify(userData),
            contentType: 'application/json',
            success: registerUserSuccess,
            error: handleAjaxError
        });

        function registerUserSuccess(userInfo) {
            sessionStorage.setItem('username', userInfo.username)
            sessionStorage.setItem('authToken', userInfo._kmd.authtoken);
            sessionStorage.setItem('userID', userInfo._id);
            showHideMenuLinks();
            $('#loggedInUser').text('Welcome, ' + userInfo.username);
            showView('viewHome');
            showInfo('Registration successful.');
        }
    }
    function logOutUser(){
        sessionStorage.removeItem('authToken');
        $('#loggedInUser').text('');
        showHideMenuLinks();
        showView('viewHome');
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

    function showError(message){
        $('#errorBox').show().text(message);
    }
    function createAd(){
        let adData = {
            title: $('#formCreateAd input[name=title]').val(),
            description: $('#formCreateAd textarea[name=description]').val(),
            date: $('#formCreateAd input[name=datePublished]').val(),
            price: $('#formCreateAd input[name=price]').val(),
            publisher: sessionStorage.getItem('username')
        };

        $.ajax({
            method: "POST",
            url: baseUrl + 'appdata/' + appKey + '/products',
            headers: {'Authorization': "Kinvey " + sessionStorage.getItem('authToken')},
            data: adData,

            success: createProductSuccess,
            error: handleAjaxError
        });
        function createProductSuccess(){
            listAds();
            showInfo('Product added successfuly.');
        }
    }
    function editAd(){
       let adData = {
            title: $('#formEditAd input[name=title]').val(),
            description: $('#formEditAd textarea[name=description]').val(),
            date: $('#formEditAd input[name=datePublished]').val(),
            price: $('#formEditAd input[name=price]').val(),
            publisher: sessionStorage.getItem('username')
        };

        $.ajax({
            method: "PUT",
            url: baseUrl + 'appdata/' + appKey + '/products/' +  $('#formEditAd input[name=id]').val(),
            headers: {'Authorization': "Kinvey " + sessionStorage.getItem('authToken')},
            data: adData,
            success: editProductSuccess,
            error: handleAjaxError
        });
        function editProductSuccess(){
            listAds();
            showInfo('Product updated successfuly.');
        }
    }
    function listAds() {
        $('#ads').empty();
        showView('viewAds');

        $.ajax({
            method: "GET",
            url: baseUrl + 'appdata/' + appKey + '/products',
            headers: {'Authorization': "Kinvey " + sessionStorage.getItem('authToken')},
            success: getProductsSuccess,
            error: handleAjaxError
        });
        function getProductsSuccess(products){
            
        let table = $('#ads').append($('<table>')
        .append(`<tr>
                    <th>Title</th>
                    <th>Publisher</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Date Published</th>
                    <th>Actions</th>
        </tr>`));
            
            for(let product of products){
                let links = [];
                let deleteButton = $('<a href ="#">[DELETE]</a>')
            .click(function(){deleteEntry(product._id)});
                let editButton = $('<a href = "#">[EDIT]</a>')
            .click(function(){editEntry(product._id)});

            if(sessionStorage.getItem('username') == product.publisher){
                links.push(deleteButton);
                links.push(" ");
                links.push(editButton);
            }
                $('#ads table').append($('<tr>')
                    .append('<td>'+product.title+'</td>')
                    .append('<td>'+product.publisher+'</td>')
                    .append('<td>'+product.description+'</td>')
                    .append('<td>'+product.price+'</td>')
                    .append('<td>'+product.date+'</td>')
                    .append($('<td>').append(links)));
            }
        }
    }
    function deleteEntry(entryId){
        $.ajax({
            method: "DELETE",
            url: baseUrl + 'appdata/' + appKey + '/products/' + entryId,
            headers: {'Authorization': "Kinvey " + sessionStorage.getItem('authToken')},
            success: deleteEntrySuccess,
            error: handleAjaxError
        });
        function deleteEntrySuccess(){
            showView('viewAds');
            showInfo('Product removed.');
        }
    }
    function editEntry(entryId){
         showView('viewEditAd');

        $.ajax({
            method: "GET",
            url: baseUrl + 'appdata/' + appKey + '/products/'+entryId,
            headers: {'Authorization': "Kinvey " + sessionStorage.getItem('authToken')},
            success: getProductDataSuccess,
            error: handleAjaxError
        });
        function getProductDataSuccess(productData){
            $('#formEditAd input[name=id]').val(productData._id);
            $('#formEditAd input[name=publisher]').val(productData.publisher);
            $('#formEditAd input[name=title]').val(productData.title);
            $('#formEditAd textarea[name=description]').val(productData.description);
            $('#formEditAd input[name=datePublished]').val(productData.datePublished);
            $('#formEditAd input[name=price]').val(productData.price);
        }
    }

}