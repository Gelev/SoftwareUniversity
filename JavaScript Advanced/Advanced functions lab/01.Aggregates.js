function reducer(arr) {
    var input = arr,
    i;

    function sum() {
        var output = 0;
        for(i = 0; i < arr.length; i += 1){
            output += arr[i];
        }
        return output;
    }
    function min(){
       var output1 = Number.MAX_VALUE;
       for (i = 1; i < input.length; i += 0) {
           if(input[i] < input[i - 1] && input[i] < output1){
               output1 = input[i];
           }
           else {
               output1 = input[0];
           }
       }
       return output1;
    }
    console.log("Sum = " + sum());
    console.log("Min = " + min());
    console.log("Max = " + 
        reduce(arr, (a,b) => Math.max(a, b)));
    console.log("Product = " + 
        reduce(arr, (a,b) => Number(a) * Number(b)));
    console.log("Join = " + arr.join);
}







/*Write a JS program that uses a reducer function to display information about an input array.
Input
You will receive an array of numeric values.
Output
The output should be the printed on the console. Display the sum of all elements in the array, the value of the smallest, the value of the biggest, the product of all elements and a string of all elements joined together.
Examples
Sample Input	Output
[2,3,10,5]	Sum = 20
Min = 2
Max = 10
Product = 300
Join = 23105
[5, -3, 20, 7, 0.5]	Sum = 29.5
Min = -3
Max = 20
Sum = -1050
Join = 5-32070.5*/
