// ==UserScript==
// @name         Playblink Random Giveaways Autojoin
// @namespace    http://sg.net/
// @version      0.3
// @description  Enter random giveaways on Playblink
// @author       SG
// @match        http://*.playblink.com/*
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

var output = true;
var delay = 5000; // 5 seconds
var myPoints = 0; // Player points
var totalGiveaways = 0;
var giveaways = null;
var index = 0;
$(document).ready(function(){
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
    if(totalGiveaways > 0)
        chooseGiveaway();
    else
       print("Bot Stopped");
});

function print(message){
    if(output) 
        console.log(message);
}

function chooseGiveaway(){
    if(totalGiveaways > 0) {
        index = totalGiveaways-1;
        var giveawayId = giveaways[index].getAttribute("id");
        var giveawayNumber = giveawayId.split("_")[1];
        var name = $(giveaways[index]).find(".name_wrap .name div").html();
        var cost = $(giveaways[index]).find(".stats tr:nth-child(3) div:nth-child(2)").html().split(" ")[5];

        print("# POINTS REMAINING (" + myPoints + ") || Giveaway info || NAME (" + name + ") || COST (" + cost + ") || NUMBER (" + giveawayNumber + ")");

        if(cost <= myPoints){
            myPoints -= cost;
                setTimeout(function() {
                    enterGiveaway(giveawayNumber, chooseGiveaway);
                }, delay);
            totalGiveaways--;
        } else {
            print("Not enough points.");
            print("Bot Stopped");
        }
    } else {
       print("No more giveawyas. Done.");
       print("Bot Stopped");
    }
}

function enterGiveaway(giveawayNumber, callback){
    //blink_load(giveawayNumber, 0, 1);
    var url = '/?do=blink&game=' + giveawayNumber + '&captcha=1';
    $.ajax(url, {
           method : "get",
           success : function(data){
                print("OK");
                print(data);
                callback();
            }
    });
}