


const text = "Time limit: 1.0 second\nMemory limit: 64 MB\n";
const regex = /\d+(\.\d+)?\ssecond/;
const memoryLimitRegex = /\d+\sMB/;

console.log(text.match(regex)[0]);
console.log(text.match(memoryLimitRegex)[0]);