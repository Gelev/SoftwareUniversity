function processCommands(commands) {


    let commandProcessor = (function() {
        let text = '';
        return {
            append: (t) => text = text + t,
            removeStart: (count) => text = text.slice(count),
            removeEnd: (count) => text = text.slice(0, text.length - count),
            print: function() {
                console.log(text)
            }

        }

    })();


    for (let cmd of commands) {
        let [cmdName, arg] = cmd.split(' ');
        commandProcessor[cmdName](arg);
    }

}

/*Write a JS program that keeps a string inside it’s context and can execute different commands that modify or output the string on the console.
append(str) – add str to the end of the internal string
removeStart(n) – remove the first n characters from the string, n is an integer
removeEnd(n) – remove the last n characters from the string, n is an integer
print – output the stored string to the console
Input
You will receive an array of strings. Each element is a command that may be a single word or contain an argument, separated by space.
Output
Whenever you receive the command print, output should be the printed on the console. Any other operations are carried onto the internal storage of the function.

processCommands(['append 123', 'append 45',
'removeStart 2', 'removeEnd 1', 'print']); // 34

*/