function jsonToHtmlTable(input){
    let data = JSON.parse(input),
        output = '',
        isThAvailble = false;

    output += `<table>\n`;
    
    for(obj of data){
        if(!isThAvailble){
            output += `<tr><th>${htmlEscape((Object.keys(obj))[0])}</th><th>${htmlEscape((Object.keys(obj))[1])}</th></tr>\n`;
            isThAvailble = true;
        }
        output += `<tr><td>${htmlEscape(obj[(Object.keys(obj))[0]])}</td><td>${htmlEscape(obj[(Object.keys(obj))[1]])}</td></tr>\n`;
    }

    output += '</table>';
    return output;

    function htmlEscape(text){
        text = new String(text);
        let map = {'"': 'quot;', '&': '&amp;', "'": '&#39;' , '<': '&lt;', '>': '&gt;' };
        return text.replace(/[\"&'<>]/g, ch => map[ch]);
    }
}

jsonToHtmlTable('[{"Name":"Tomatoes & Chips","Price":2.35},{"Name":"J&B Chocolate","Price":0.96}]');
jsonToHtmlTable('[{"X":5,"Y":7},{"X":2,"Y":4}]');