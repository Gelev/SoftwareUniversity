function scoreToTable(input){
    let tableObj = JSON.parse(input);
    
    let html = '<table>\n';
        html += `<tr><th>name</th><th>score</th>\n` ;
    for(obj of tableObj){
        html += `<tr><td>${htmlEscape(obj.name)}</td><td>${htmlEscape(obj.score)}</td>`;
    }
    html += `</table>`;
    return html;

    function htmlEscape(text){
        text = new String(text);
        let map = {'"': 'quot;', '&': '&amp;', "'": '&#39;' , '<': '&lt;', '>': '&gt;' };
        return text.replace(/[\"&'<>]/g, ch => map[ch]);
    }
}