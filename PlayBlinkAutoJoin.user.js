// ==UserScript==
// @name         Playblink Random Giveaways Autojoin
// @namespace    www.sg.net
// @version      0.3.3
// @description  Enter random giveaways on Playblink
// @author       Sérgio Gonçalves
// @match        http://*.playblink.com/*
// @match        http://www.playblink.com/
// @match        http://www.playblink.com/*
// @downloadURL	 https://raw.githubusercontent.com/goncalvessergio/PlayBlinkAutoJoin/master/PlayBlinkAutoJoin.user.js
// @updateURL	 https://raw.githubusercontent.com/goncalvessergio/PlayBlinkAutoJoin/master/PlayBlinkAutoJoin.user.js
// @grant        none
// ==/UserScript==
/* jshint -W097 */

/*global $,console,alert */

var output = true; // outputs console messages
var delay = 5000; // 5 seconds between giveaway
var myPoints = 0; // Player points
var totalGiveaways = 0; // Number of random giveaways detected
var giveaways = null;
var index = 0;
var plajStats, plajPoints, plajGiveaways, plajBtnStartStop, plajRunning; // Objects added to body
var running = false; // bot running

function print(message) {
    'use strict';
    if (output) {
        console.log(message);
    }
}

function enterGiveaway(giveawayNumber, callback) {
    'use strict';
    var url = '/?do=blink&game=' + giveawayNumber + '&captcha=1';
    callback();
    /*
    $.ajax(url, {
        method: "get",
        success: function (data) {
            print(data);
            callback();
        }
    });
    */
}

function updateFloatingDiv() {
    'use strict';
    plajBtnStartStop.html(running ? 'Stop' : 'Start');
    
    if (myPoints === 0 || totalGiveaways === 0) {
        plajBtnStartStop.attr('disabled', 'true');
    } else {
        plajBtnStartStop.removeAttr('disabled');
    }
    
    plajGiveaways.html(totalGiveaways);
    plajPoints.html(myPoints);
    plajRunning.html(running ? 'Yes' : 'No');
}

function chooseGiveaway() {
    'use strict';
    if (running) {
        if (totalGiveaways > 0) {
            index = totalGiveaways - 1;
            var giveawayId, giveawayNumber, name, cost;
            giveawayId = giveaways[index].getAttribute("id");
            giveawayNumber = giveawayId.split("_")[1];
            name = $(giveaways[index]).find(".name_wrap .name div").html();
            cost = $(giveaways[index]).find(".stats tr:nth-child(3) div:nth-child(2)").html().split(" ")[5];

            print("# POINTS REMAINING (" + myPoints + ") || Giveaway info || NAME (" + name + ") || COST (" + cost + ") || NUMBER (" + giveawayNumber + ")");

            if (cost <= myPoints) {
                myPoints -= cost;
                setTimeout(function () {
                    enterGiveaway(giveawayNumber, chooseGiveaway);
                }, delay);
                totalGiveaways = totalGiveaways - 1;
                updateFloatingDiv();
            } else {
                running = false;
                print("Not enough points.");
                print("Bot Stopped");
            }
        } else {
            running = false;
            print("No more giveawyas. Done.");
            print("Bot Stopped");
        }
    }
}

function addFloatingDiv() {
    'use strict';
    plajBtnStartStop = $("<button id='plajBtnStartStop' />").html(running ? 'Stop' : 'Start');
    plajGiveaways = $('<span id="plajGiveaways"/>').html(totalGiveaways);
    plajPoints = $('<span id="plajPoints"/>').html(myPoints);
    plajRunning = $('<span id="plajRunning" />').html(running ? 'Yes' : 'No');
    
    plajStats = $("<div style='position: fixed; display: block; background:white; z-index: 999; padding: 5px;' id='plajStats'/>");
    plajStats.append('<b>PlayBlink Auto Join</b><br/><br/>');
    plajStats.append("<b>Points: </b>").append(plajPoints).append("<br/>");
    plajStats.append("<b>Giveaways: </b>").append(plajGiveaways).append("<br/>");
    plajStats.append("<b>Running: </b>").append(plajRunning).append("<br/>");
    plajStats.append(plajBtnStartStop);
    
    $("body").before(plajStats);
    
    updateFloatingDiv();
}

function doSomething() {
    'use strict';
    running = !running;
    updateFloatingDiv();
    if (running) {
        print("Now entering giveaways");
        if (totalGiveaways > 0) {
            chooseGiveaway();
        } else {
            running = false;
            print("Bot Stopped. No giveaways.");
        }
    } else {
        print("Bot Stopped");
    }
}

$(document).ready(function () {
    'use strict';
    print("Bot ready!");

    // Remove some stuff so its easy to get the points
    $("#points img").remove();
    $("#points a").remove();

    // Get the user points
    myPoints = parseInt($("#points").html().trim().split(" ")[0], 10);
    print("Points available: " + myPoints);

    // Hide some stuff
    $(".toptitle, .leaderboard, .dyk_box, .socialLinks").hide();

    // Select giveawyas (Elements with class "game_box" and attribute id not empty)
    giveaways = $(".game_box[id]");
    totalGiveaways = giveaways.length;
    print(totalGiveaways + " giveaways in this page");

    addFloatingDiv();
    
    $(document).on('click', "#plajBtnStartStop", function () {
        doSomething();
    });
});
