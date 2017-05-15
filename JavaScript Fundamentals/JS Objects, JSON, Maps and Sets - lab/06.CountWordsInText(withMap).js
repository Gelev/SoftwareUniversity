function countWordsInText(input){
    let text = input.join('\n').toLowerCase()
                    .split(/[^A-Za-z0-9_]+/)
                    .filter(w => w != '');
    let wordsCounter = new Map();
    for(let word of text){
        if(wordsCounter.has(word)){
            wordsCounter.set(word, wordsCounter.get(word)+1);
        } else{
            wordsCounter.set(word, 1);
        }
        console.log(wordsCounter);
    }
    let output = Array.from(wordsCounter.keys()).sort();
    return output;
}

countWordsInText(['JS and Node.js', 'JS again and again', 'Oh, JS?']);