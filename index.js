const { fork } = require("child_process");
var devnull = require("dev-null")
var tries = 0, hits = 0
var children = []


const count = 6
console.log(`starting ${count} processes`.yellow)

for(var i = 0; i < count; i++){
    children[i] = fork("worker.js", [], { detatched: false, stdio: "pipe" })
    children[i].stdout.setEncoding('utf8')
    children[i].stdout.on("data", (data) => {
        if(data == "+") {
            hits++
            tries++
        } else {
            tries++
        }
    }).pipe(devnull())
}

process.on("SIGTERM", () => {
    children.forEach((val) => {
        val.kill("SIGTERM")
    })
})

console.log("all processes started".green)

import('log-update').then(mod => {
    const frames = ['-', '\\', '|', '/'];
    var index = 0;
    setInterval(() => {
	    const frame = frames[index = ++index % frames.length];
        mod.default(`${frame} tries: ${tries}; hits: ${hits} ${frame}`);
    }, 1);
});