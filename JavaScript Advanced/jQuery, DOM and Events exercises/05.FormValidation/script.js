function solve(){
    let allFieldsAreValid = true;
    let isItACompany = false;

    $('#company').click(function(){
        if($('#company:checked')){
            $('#companyInfo').slideDown();
            isItACompany = true;   
        } 
        if($('#company:checked').length === 0){
            $('#companyInfo').slideUp();
            isItACompany = false;
        }
    });
    
    $('#submit').click(function(event){
        event.preventDefault();
        checkFields();

        if (allFieldsAreValid) {
        $('#valid').css('display', 'block');
    }
    });

    function checkFields(){
        let username = $('#username');
        if(!username.val().match(/^[a-zA-Z0-9]{3,20}$/)){
            $(username).css('border-color', 'red');
            allFieldsAreValid = false;
        } else {
            username.css('border', 'none');
        }

        let email = $('#email');
        if(!email.val().match(/.*@.*?\..*?/)){
            email.css('border-color', 'red');
            allFieldsAreValid = false;
        } else {
            email.css('border', 'none');
        }

        let password = $('#password');
        let confirmPass = $('#confirm-password');

        if(!password.val().match(/\w{5,15}/) || password.val() != confirmPass.val()){
            password.css('border-color', 'red');
            confirmPass.css('border-color', 'red');
            allFieldsAreValid = false;
        } else {
            password.css('border', 'none');
            confirmPass.css('border', 'none');
        }

        if(isItACompany){
            let companyNumber = $('#companyNumber');
            if(companyNumber.val() < 1000 || companyNumber.val() > 9999){
                companyNumber.css('border-color', 'red');
                allFieldsAreValid = false;
            } else {
                companyNumber.css('border', 'none');
            }
        }
    }
}