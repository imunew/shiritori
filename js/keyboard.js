
var katakana = [
    ["ア", "カ", "サ", "タ", "ナ", "ハ", "マ", "ヤ", "ラ", "ワ"],
    ["イ", "キ", "シ", "チ", "ニ", "ヒ", "ミ", "ユ", "リ", "ヲ"],
    ["ウ", "ク", "ス", "ツ", "ヌ", "フ", "ム", "ヨ", "ル", "ン"],
    ["エ", "ケ", "セ", "テ", "ネ", "ヘ", "メ", "", "レ", ""],
    ["オ", "コ", "ソ", "ト", "ノ", "ホ", "モ", "", "ロ", ""],
    ["", "", "", "", "", "小", "゛", "゜", "ー", "Ｘ"]
];

var SoftKeyBoard = function (params) {
    if (!params.keys) { params.keys = katakana; }
    this.keys = params.keys;
    this.onSoftKeyPressed = params.onSoftKeyPressed;
};

SoftKeyBoard.prototype = {
    
    dakuon: {
        "カ": "ガ", "キ": "ギ", "ク": "グ", "ケ": "ゲ", "コ": "ゴ",
        "サ": "ザ", "シ": "ジ", "ス": "ズ", "セ": "ゼ", "ソ": "ゾ",
        "タ": "ダ", "チ": "ヂ", "ツ": "ヅ", "テ": "デ", "ト": "ド",
        "ハ": "バ", "ヒ": "ビ", "フ": "ブ", "ヘ": "べ", "ホ": "ボ"
    },
            
    handakuon: {
        "ハ": "パ", "ヒ": "ピ", "フ": "プ", "ヘ": "ペ", "ホ": "ポ"
    },
            
    sutegana: {
        "ア": "ァ", "イ": "ィ", "ウ": "ゥ", "エ": "ェ", "オ": "ォ",
        "ツ": "ッ", "ヤ": "ャ", "ユ": "ュ", "ヨ": "ョ", "ワ": "ヮ"
    },
    
    create: function () {
        var table = document.createElement("TABLE");
        
        for (var rowIndex in this.keys) {
            var row = this.keys[rowIndex];
            var tr = document.createElement("TR");
            for (var cellIndex in row) {
                var cell = row[cellIndex];
                var td = document.createElement("TD");
                var text = document.createTextNode(cell);
                if (cell && cell.length) {
                    var a = document.createElement("A");
                    a.setAttribute("href", "#");
                    if (this.onSoftKeyPressed) {
                        a.setAttribute("class", "css_softkey");
                        a.setAttribute("onmouseup", this.onSoftKeyPressed + "(this.firstChild.nodeValue);return false;");
                    }
                    a.appendChild(text);
                    td.appendChild(a);
                }
                else {
                    td.appendChild(text);
                }
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        
        return table;
    },
    
    inputKey: function(text, key) {
        switch (key) {
            case "゛":
                var regex = /(カ|キ|ク|ケ|コ|サ|シ|ス|セ|ソ|タ|チ|ツ|テ|ト|ハ|ヒ|フ|ヘ|ホ)$/;
                var match = text.match(regex);
                if (match && match.length > 0) {
                    var dakuon = this.toDakuon(match[0]);
                    return text.replace(regex, dakuon);
                }
                return text;
            case "゜":
                var regex = /(ハ|ヒ|フ|ヘ|ホ)$/;
                var match = text.match(regex);
                if (match && match.length > 0) {
                    var handakuon = this.toHandakuon(match[0]);
                    return text.replace(regex, handakuon);
                }
                return text;
            case "Ｘ":
                if (text && text.length > 0) {
                    return text.substring(0, (text.length - 1));
                }
                return text;
            case "小":
                var regex = /(ア|イ|ウ|エ|オ|ツ|ヤ|ユ|ヨ|ワ)$/;
                var match = text.match(regex);
                if (match && match.length > 0) {
                    var sutegana = this.toSutegana(match[0]);
                    return text.replace(regex, sutegana);
                }
                return text;
        }
        return (text + key);
    },
    
    toDakuon: function(kana) {
        if (this.dakuon[kana]) {
            return this.dakuon[kana];
        }
        return kana;
    },
            
    toHandakuon: function(kana) {
        if (this.handakuon[kana]) {
            return this.handakuon[kana];
        }
        return kana;
    },
            
    toSutegana: function(kana) {
        if (this.sutegana[kana]) {
            return this.sutegana[kana];
        }
        return kana;
    }
};