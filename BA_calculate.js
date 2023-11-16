// ==UserScript==
// @name         Calculating Loyalty and Tags - BA PPS
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Calculations inside BA theme
// @author       Lemniscata
// @match        https://brandanalytics.ru/report/12495931/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=br-analytics.ru
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    var zNode = document.createElement ('div');
    zNode.innerHTML = '<button id="loyalty" type="button">Лояльность</button>';
    zNode.setAttribute ('id', 'myContainer');
    document.body.appendChild (zNode);

    var zNode1 = document.createElement ('div');
    zNode1.innerHTML = '<button id="loyalty1" type="button">Лояльность (фильтры)</button>';
    zNode1.setAttribute ('id', 'myContainer1');
    document.body.appendChild (zNode1);

    var zNode2 = document.createElement ('div');
    zNode2.innerHTML = '<button id="tags" type="button">Теги</button>';
    zNode2.setAttribute ('id', 'myContainer2');
    document.body.appendChild (zNode2);

//--- Activate the newly added button.
    document.getElementById ("loyalty").addEventListener (
    "click", CalculateLoyalty, false
);
//--- Activate the newly added button.
    document.getElementById ("loyalty1").addEventListener (
    "click", CalculateLoyaltyFilter, false
);
//--- Activate the newly added button.
    document.getElementById ("tags").addEventListener (
    "click", CalculateTags, false
);

function CalculateLoyalty (zEvent) {
    var filters = document.getElementsByClassName("filter_list")
    var arrFilters = Array.from(filters);
    var messages = arrFilters[2];
    var tone = arrFilters[5];
    var messValues = Array.from(messages.getElementsByClassName("filter_item-nums"));
    var toneValues = Array.from(tone.getElementsByClassName("filter_item"));
    let positive = 0;
    let negative = 0;
    let neutral = 0;
    //подсчёт
    for (let i = 0; i < toneValues.length; i++) {
        if (toneValues[i].querySelector('#ftone_1')) {
            positive = Array.from(toneValues[i].getElementsByClassName("filter_item-nums"))[0].innerHTML;
        }
        else if (toneValues[i].querySelector('#ftone_-1')) {
            negative = Array.from(toneValues[i].getElementsByClassName("filter_item-nums"))[0].innerHTML;
        }
        else {
            neutral = Array.from(toneValues[i].getElementsByClassName("filter_item-nums"))[0].innerHTML;
        }
    }
    let all = messValues[1].innerHTML;
    positive = parseInt(positive);//.replace(/\s/g, ''));
    negative = parseInt(negative);
    neutral = parseInt(neutral);
    all = parseInt(all.replace(/\s/g, ''));
    let loyalty = (positive - negative) / all
    loyalty = loyalty.toFixed(2)
    let zNode = document.createElement ('p');
    zNode.innerHTML = "Лояльность: " + loyalty;
    document.getElementById ("myContainer").appendChild (zNode);
    //console.log(positive, negative, neutral); //debug output
}

function CalculateTags (zEvent) {
    var filters = document.getElementsByClassName("filter_list")
    var arrFilters = Array.from(filters);
    var custom = arrFilters[1]; // пользовательские фильтры
    var tags = arrFilters[7]; // теги

    var custValues = Array.from(custom.getElementsByClassName("filter_item"));
    var tagValues = Array.from(tags.getElementsByClassName("filter_item"));
    let bannedSM = 0;
    let tagArr = [];
    for (let j = 0; j < custValues.length; j++) {
        if (custValues[j].querySelector('#fcustom_7')) {
            bannedSM = Array.from(custValues[j].getElementsByClassName("filter_item-nums"))[0].innerHTML;
        }
    }
    for (var k = 0; k < tagValues.length; k++) {
        if (tagValues[k].textContent.includes("Не отвечаем")) {
            tagArr.push(tagValues[k].getElementsByClassName("active router-link-exact-active filters_link filter_item-name")[0].innerHTML, tagValues[k].getElementsByClassName("filter_item-nums")[0].innerHTML);
            //console.log(tagArr); //debug
        }
    }
    let tagStr = tagArr.toString();
    tagStr = tagStr.replace(/\t/g, '');
    tagStr = tagStr.replace(/\n/g, ',');
    let noAnswer = tagStr.split(',');
    noAnswer = noAnswer.filter(n => n);
    let noAnswerNumbers = noAnswer.filter(Number).map(function(str) {
         // using map() to convert array of strings to numbers
         return parseInt(str); });
    let noAnswerSum = noAnswerNumbers.reduce((a, b) => a + b, 0) + parseInt(bannedSM);
    let zNode2 = document.createElement ('p');
    zNode2.innerHTML = "Всего не отвечаем: " + noAnswerSum + "<br>" + noAnswer + "<br>Fb/IG/Twi: " + bannedSM;
    document.getElementById ("myContainer2").appendChild (zNode2);
    //console.log(tagArr); //debug
}

function CalculateLoyaltyFilter (zEvent) {
    var filters = document.getElementsByClassName("filter_list")
    var arrFilters = Array.from(filters);
    var messages = arrFilters[3];
    var tone = arrFilters[6];
    var messValues = Array.from(messages.getElementsByClassName("filter_item-nums"));
    var toneValues = Array.from(tone.getElementsByClassName("filter_item"));
    let positive = 0;
    let negative = 0;
    let neutral = 0;
    //подсчёт
    for (let i = 0; i < toneValues.length; i++) {
        if (toneValues[i].querySelector('#ftone_1')) {
            positive = Array.from(toneValues[i].getElementsByClassName("filter_item-nums"))[0].innerHTML;
        }
        else if (toneValues[i].querySelector('#ftone_-1')) {
            negative = Array.from(toneValues[i].getElementsByClassName("filter_item-nums"))[0].innerHTML;
        }
        else {
            neutral = Array.from(toneValues[i].getElementsByClassName("filter_item-nums"))[0].innerHTML;
        }
    }
    let all = messValues[1].innerHTML;
    positive = parseInt(positive);
    negative = parseInt(negative);
    neutral = parseInt(neutral);
    all = parseInt(all.replace(/\s/g, ''));
    let loyalty = (positive - negative) / all
    loyalty = loyalty.toFixed(2)
    let zNode1 = document.createElement ('p');
    zNode1.innerHTML = "Лояльность (фильтры): " + loyalty;
    document.getElementById ("myContainer1").appendChild (zNode1);
}

GM_addStyle(`#myContainer, #myContainer1, #myContainer2 {
        background:             orange;
        border:                 2px black;
        margin:                 5px;
        opacity:                0.9;
        z-index:                1100;
        padding:                5px 20px;
    }
    #myContainer {
        position:               absolute;
        top:                    0;
        left:                   0;
    }
    #myContainer1 {
        position:               absolute;
        top:                    64px;
        left:                   0;
    }
    #myContainer2 {
        position:               absolute;
        top:                    128px;
        left:                   0;
    }
`)
})();