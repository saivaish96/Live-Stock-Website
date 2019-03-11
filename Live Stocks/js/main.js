var wsUri = "ws://stocks.mnet.website"; // URI here
let map = new Map(); // Map of company values
let prev = new Map(); // Map to hold prev and curr values
let curr = new Map();
let timer = new Map(); // Map to hold timer values
var color = "#808080"; // default font color
jQuery(document).ready(function ($) {
    testWebSocket(); // call socket functions
});

function testWebSocket() {
    websocket = new WebSocket(wsUri);

    websocket.onopen = function (evt) {
        onOpen(evt)
    };

    websocket.onmessage = function (evt) {
        onMessage(evt)
    };

    websocket.onerror = function (evt) {
        onError(evt)
    };
}

function onOpen(evt) {
    console.log("Connected to Socket");
}

function onMessage(evt) {
    console.log("Message Received")
    parseJSON(evt.data);
}

function onError(evt) {
    alert("Check your connection and please try again.");
}

// Fetch current time
function timeNow() {
    var d = new Date(),
    h = (d.getHours() < 10 ? '0' : '') + d.getHours(),
    m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    s = d.getSeconds();
    time = h + ':' + m + ':' + s;
    return time;
}

// Parse received data
function parseJSON(data) {
    var obj = JSON.parse(data);
    var arr = [], len;
    for (key in obj) {
        arr.push(key);
    }
    len = arr.length;
    for (var i = 0; i < len; i++) {
        var objj = obj[i]
        var name = objj[0];
        var value = objj[1];
        map.set(name, value);
        timer.set(name, timeNow());
    }
    createRow(map,timer);
}

// Create table structure dynamically
function createRow(map, timer) {
    $(".dynamic").remove();
    var name, value;
    var arr = map.keys();
    for(var key of arr) {
        name = key;
        value = map.get(key);
        curr.set(key, value);
 
        if (prev.has(key)) {
            if (prev.get(key) > curr.get(key)) {
                color = "#c0392b";
            }
            else if (prev.get(key) < curr.get(key)) {
                color = "#16a085";
            }
        }
        else {
            color = "#808080";
        }
        time = timer.get(key);
        var divElementRow = document.createElement("div");
        divElementRow.className = "row dynamic";

        var divElementCell1 = document.createElement("div");
        divElementCell1.className = "cell";
        divElementCell1.innerHTML = name.toUpperCase().bold();

        var divElementCell2 = document.createElement("div");
        divElementCell2.className = "cell";
        divElementCell2.innerHTML = parseFloat(value).toFixed(5);
        divElementCell2.style.color = color;

        var divElementCell4 = document.createElement("div");
        divElementCell4.className = "cell";
        divElementCell4.innerHTML = time;

        divElementRow.appendChild(divElementCell1);
        divElementRow.appendChild(divElementCell2);
        divElementRow.appendChild(divElementCell4);
        $('#stockTable').append(divElementRow);
        prev.set(key, value);
    }
}