function attachEvents(){
    const baseUrl = "https://baas.kinvey.com/appdata/";
    const appID = "kid_BJu3xFTdb";
    const base64auth = btoa("user1:pass1");
    const authorizationHeader = {authorization: `Basic ${base64auth}`};

    $(".add").on('click', createCatch);
    $(".load").on('click', loadCatches);
    function createCatch(){
        let newJSONcatch = JSON.stringify({
            angler: $(".angler").val(),
            weight: $(".weight").val(),
            species: $(".species").val(),
            location: $(".location").val(),
            bait: $(".bait").val(),
            captureTime: $(".captureTime").val()
        });

        $.ajax({
            method: "POST",
            url: baseUrl + appID + "/biggestCatches",
            headers: authorizationHeader,
            contentType: "application/json",
            success: function catchCreated(){loadCatches();},
            error: displayError,
            data: newJSONcatch
        });
    }
    function deleteCatch(id){
            $.ajax({
                method: "DELETE",
                url: baseUrl + appID + "/biggestCatches/" + id,
                headers: authorizationHeader,
                contentType: "application/json",
                success: function fadeOut(){
                    $(`#${id}`).fadeOut();
                     },
                error: displayError
            });
    }

    function loadCatches(){
        $("#catches").empty();
        $.ajax({
            method: "GET",
            url: baseUrl + appID + "/biggestCatches",
            headers: authorizationHeader,
            contentType: "application/json",
            success: function drawCatches(catches){
                for(let singleCatch of catches){

                    $("#catches").append(
                        `<fieldset id="${singleCatch._id}"> 
                        <label>Angler</label>
                        <input type="text" class="input1" value="${singleCatch.angler}"/>
                        <label>Weight</label>
                        <input type="number" class="input2" value="${singleCatch.weight}"/>
                        <label>Species</label>
                        <input type="text" class="input3" value="${singleCatch.species}"/>
                        <label>Location</label>
                        <input type="text" class="input4" value="${singleCatch.location}"/>
                        <label>Bait</label>
                        <input type="text" class="input5" value="${singleCatch.bait}"/>
                        <label>Capture Time</label>
                        <input type="number" class="input6" value="${singleCatch.captureTime}"/>
                        </fieldset>`);
                         $(`#${singleCatch._id}`).append($('<button>')
                            .addClass('update').text('Update').on('click', () => updateCatch(singleCatch._id)))
                            .append($('<button>')
                            .addClass('delete').text('Delete').on('click', () => deleteCatch(singleCatch._id)));    
                        }        
                    }       
                }
            )};

        function updateCatch(id){
            let updateJSONcatch = JSON.stringify({
            angler: $(`#${id} input.input1`).val(),
            weight: $(`#${id} input.input2`).val(),
            species: $(`#${id} input.input3`).val(),
            location: $(`#${id} input.input4`).val(),
            bait: $(`#${id} input.input5`).val(),
            captureTime: $(`#${id} input.input6`).val()
            });

            $.ajax({
                method: "PUT",
                url: baseUrl + appID + "/biggestCatches/" + id,
                contentType: "application/json",
                headers: authorizationHeader,
                data: updateJSONcatch
            })
                .then (loadCatches)
                .catch (displayError);
        }
        function displayError(error) {
            alert("Error!" + error);
}

}