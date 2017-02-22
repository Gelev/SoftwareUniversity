let sum1 = (arr) => Math.max.apply(null, arr);
let sum2 = (arr) => Math.max(...arr);

console.log(sum1([1, 44, 123, 33]));
console.log(sum2([1, 44, 123, 33]));