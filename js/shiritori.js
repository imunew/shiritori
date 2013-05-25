
function is_hiragana(text) {
    return (text.match(/^[\u3040-\u309F]+$/));
}

function getFirstCharacter(text) {
    return text.substring(0, 1);
}

function getLastCharacter(text, position) {
    return text.substring(text.length - (1 + position), text.length - position);
}

function getNextCharacter(lastText) {
    var nextCharacter = getLastCharacter(lastText, 0);

    if (nextCharacter === 'ー') {
        var character = getLastCharacter(lastText, 1);
        nextCharacter = getVowel(character);
    }
    else {
        var match = searchYouonAt(lastText, -1);
        if (match && match.length > 0) {
            nextCharacter = match[0];
        }
    }
    return nextCharacter;
}

function parseJapanese(text, callback) {
    
    var url = "http://api-imunew.rhcloud.com/jlp.php";
    var parameters = {
        "sentence": text
    };
    $.get(url, parameters, function(data){
        var ma_result = $(data).find("ma_result");
        var total_count = ma_result.find("total_count").text();
        var filtered_count = ma_result.find("filtered_count").text();
        var surface = "";
        var reading = "";
        var pos = "";
        var word = ma_result.find("word");
        if (word && word.length) {
            surface = word.find("surface").text();
            reading = word.find("reading").text();
            pos = word.find("pos").text();
        }
        parseInt();
        var result = {
            "total_count": parseInt(total_count),
            "filtered_count": parseInt(filtered_count),
            "surface": surface,
            "reading": reading,
            "pos": pos
        };
        callback(result);
    });
}

function checkShiritori(lastText, currentText){

    var lastCharacter = getLastCharacter(lastText, 0);
    var firstCharacter = getFirstCharacter(currentText);

    if (lastCharacter === 'ー') {
        var character = getLastCharacter(lastText, 1);
        lastCharacter = getVowel(character);
    }
    else {
        var match = searchYouonAt(lastText, -1);
        if (match && match.length > 0) {
            lastCharacter = match[0];
            match = searchYouonAt(currentText, 0);
            if (match && match.length > 0) {
                firstCharacter = match[0];
            }
        }
    }

    return {
        result: firstCharacter === lastCharacter,
        firstCharacter: firstCharacter,
        lastCharacter: lastCharacter
    };
}

function getHistory() {
    var row_history = localStorage["shiritori.history"];
    var list = new Array();
    if (row_history) {
        list = eval(row_history);
    }
    return list;
}

function checkInHistory(reading) {
    var history = getHistory();
    for (var index in history) {
        var word = history[index];
        if (reading === word.reading) {
            return word;
        }
    }
    return null;
}

function addHistory(list, word) {
    list.push(word);
    localStorage["shiritori.history"] = JSON.stringify(list);
}

function hasHistory() {
    return (typeof(localStorage["shiritori.history"]) === "string");
}

function popHistory(list) {
    list.pop();
    localStorage["shiritori.history"] = JSON.stringify(list);
}

function getPlayers() {
    return parseInt(localStorage["shiritori.players"]);
}

function setPlayers(players) {
    localStorage["shiritori.players"] = players;
}

function initializeShiritori() {
    localStorage.removeItem("shiritori.history");
    localStorage.removeItem("shiritori.players");
}

function getVowel(character){
    switch (character) {
        case "あ": case "か": case "さ": case "た": case "な":
        case "は": case "ま": case "や": case "ら": case "わ":
        case "が": case "ざ": case "だ": case "ば": case "ぱ":
        case "ぁ": case "ゃ": case "ゎ":
            return "あ";
        case "い": case "き": case "し": case "ち": case "に":
        case "ひ": case "み": case "り": case "ゐ":
        case "ぎ": case "じ": case "ぢ": case "び": case "ぴ":
        case "ぃ":
            return "い";
        case "う": case "く": case "す": case "つ": case "ぬ":
        case "ふ": case "む": case "ゆ": case "る":
        case "ぐ": case "ず": case "づ": case "ぶ": case "ぷ":
        case "ぅ": case "ゅ":
            return "う";
        case "え": case "け": case "せ": case "て": case "ね":
        case "へ": case "め": case "れ": case "ゑ":
        case "げ": case "ぜ": case "で": case "べ": case "ぺ":
        case "ぇ":
            return "え";
        case "お": case "こ": case "そ": case "と": case "の":
        case "ほ": case "も": case "よ": case "ろ": case "を":
        case "ご": case "ぞ": case "ど": case "ぼ": case "ぽ":
        case "ぉ": case "ょ":
            return "お";
    }
    return "";
}

/**
 * 先頭、もしくは末尾の拗音（ようおん）を検索する
 * @param {string} text
 * @param {int} position (0:先頭、-1:末尾)
 * @returns {array} マッチした拗音（ようおん）
 */
function searchYouonAt(text, position) {
    var regex = "(きゃ|きゅ|きょ|しゃ|しゅ|しょ|ちゃ|ちゅ|ちょ|にゃ|にゅ|にょ|ひゃ|ひゅ|ひょ|みゃ|みゅ|みょ|りゃ|りゅ|りょ|ぎゃ|ぎゅ|ぎょ|じゃ|じゅ|じょ|ぢゃ|ぢゅ|ぢょ|びゃ|びゅ|びょ|ぴゃ|ぴゅ|ぴょ)";
    if (position === 0) {
        return text.match(new RegExp("^" + regex));
    }
    return text.match(new RegExp(regex + "$"));
}

function checkHatsuonAtEnd(text) {
    return /(ん|んっ|んー)$/.test(text);
}

