// ==UserScript==
// @name         Playblink Random Giveaways Autojoin
// @namespace    www.sg.net/
// @version      0.3.1
// @description  Enter random giveaways on Playblink
// @author       Sérgio Gonçalves
// @match        *.playblink.com/*
// @downloadURL	https://raw.githubusercontent.com/goncalvessergio/PlayBlinkAutoJoin/master/PlayBlinkAutoJoin.js
// @updateURL	https://raw.githubusercontent.com/goncalvessergio/PlayBlinkAutoJoin/master/PlayBlinkAutoJoin.js
// @grant        none
// ==/UserScript==
/* jshint -W097 */

/*global $,console */

var output = true;
var delay = 5000; // 5 seconds
var myPoints = 0; // Player points
var totalGiveaways = 0;
var giveaways = null;
var index = 0;

function print(message) {
    'use strict';
    if (output) {
        console.log(message);
    }
}

function enterGiveaway(giveawayNumber, callback) {
    'use strict';
    var url = '/?do=blink&game=' + giveawayNumber + '&captcha=1';
    $.ajax(url, {
        method : "get",
        success : function (data) {
            print(data);
            callback();
        }
    });
}

function chooseGiveaway() {
    'use strict';
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
        } else {
            print("Not enough points.");
            print("Bot Stopped");
        }
    } else {
        print("No more giveawyas. Done.");
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
    myPoints = $("#points").html().trim().split(" ")[0];
    print("Points available: " + myPoints);
    
    // Hide some stuff
    $(".toptitle, .leaderboard, .dyk_box, .socialLinks").hide();
    
    // Select giveawyas (Elements with class "game_box" and attribute id not empty)
    giveaways = $(".game_box[id]");
    totalGiveaways = giveaways.length;
    print(totalGiveaways + " giveaways in this page");
    
    print("Now entering giveaways");
    if (totalGiveaways > 0) {
        chooseGiveaway();
    } else {
        print("Bot Stopped");
    }
});