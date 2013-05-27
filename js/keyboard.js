
var kana = [[
    ["あ", "か", "さ", "た", "な", "は", "ま", "や", "ら", "わ"],
    ["い", "き", "し", "ち", "に", "ひ", "み", "ゆ", "り", "を"],
    ["う", "く", "す", "つ", "ぬ", "ふ", "む", "よ", "る", "ん"],
    ["え", "け", "せ", "て", "ね", "へ", "め", "", "れ", ""],
    ["お", "こ", "そ", "と", "の", "ほ", "も", "", "ろ", ""],
    ["", "", "", "", "", "小", "゛", "゜", "ー", "Ｘ"]
], [
    ["ア", "カ", "サ", "タ", "ナ", "ハ", "マ", "ヤ", "ラ", "ワ"],
    ["イ", "キ", "シ", "チ", "ニ", "ヒ", "ミ", "ユ", "リ", "ヲ"],
    ["ウ", "ク", "ス", "ツ", "ヌ", "フ", "ム", "ヨ", "ル", "ン"],
    ["エ", "ケ", "セ", "テ", "ネ", "ヘ", "メ", "", "レ", ""],
    ["オ", "コ", "ソ", "ト", "ノ", "ホ", "モ", "", "ロ", ""],
    ["", "", "", "", "", "小", "゛", "゜", "ー", "Ｘ"]
]];

var INPUT_TYPE_HIRAGANA = 0;
var INPUT_TYPE_KATAKANA = 1;

var SoftKeyBoard = function () {
    this.setInputType(INPUT_TYPE_HIRAGANA);
};

SoftKeyBoard.prototype = {
    
    dakuon: [{
        "か": "が", "き": "ぎ", "く": "ぐ", "け": "げ", "こ": "ご",
        "さ": "ざ", "し": "じ", "す": "ず", "せ": "ぜ", "そ": "ぞ",
        "た": "だ", "ち": "ぢ", "つ": "づ", "て": "で", "と": "ど",
        "は": "ば", "ひ": "び", "ふ": "ぶ", "へ": "べ", "ほ": "ぼ"
    }, {
        "カ": "ガ", "キ": "ギ", "ク": "グ", "ケ": "ゲ", "コ": "ゴ",
        "サ": "ザ", "シ": "ジ", "ス": "ズ", "セ": "ゼ", "ソ": "ゾ",
        "タ": "ダ", "チ": "ヂ", "ツ": "ヅ", "テ": "デ", "ト": "ド",
        "ハ": "バ", "ヒ": "ビ", "フ": "ブ", "ヘ": "べ", "ホ": "ボ"
    }],
            
    handakuon: [{
        "は": "ば", "ひ": "び", "ふ": "ぶ", "へ": "べ", "ほ": "ぼ"
    }, {
        "ハ": "パ", "ヒ": "ピ", "フ": "プ", "ヘ": "ペ", "ホ": "ポ"
    }],
            
    sutegana: [{
        "あ": "ぁ", "い": "ぃ", "う": "ぅ", "え": "ぇ", "お": "ぉ",
        "つ": "っ", "や": "ゃ", "ゆ": "ゅ", "よ": "ょ", "わ": "ゎ"
    }, {
        "ア": "ァ", "イ": "ィ", "ウ": "ゥ", "エ": "ェ", "オ": "ォ",
        "ツ": "ッ", "ヤ": "ャ", "ユ": "ュ", "ヨ": "ョ", "ワ": "ヮ"
    }],
        
    dakuon_regex: [
        /(か|き|く|け|こ|さ|し|す|せ|そ|た|ち|つ|て|と|は|ひ|ふ|へ|ほ)$/,
        /(カ|キ|ク|ケ|コ|サ|シ|ス|セ|ソ|タ|チ|ツ|テ|ト|ハ|ヒ|フ|ヘ|ホ)$/
    ],
            
    handakuon_regex: [
        /(は|ひ|ふ|へ|ほ)$/,
        /(ハ|ヒ|フ|ヘ|ホ)$/
    ],

    sutegana_regex: [
        /(あ|い|う|え|お|つ|や|ゆ|よ|わ)$/,
        /(ア|イ|ウ|エ|オ|ツ|ヤ|ユ|ヨ|ワ)$/
    ],
    
    setInputType: function (inputType) {
        this.inputType = inputType;
        this.keys = kana[inputType];
    },
    
    create: function () {
        var table = document.createElement("TABLE");
        table.setAttribute("border", "0");
        table.setAttribute("cellpadding", "0");
        
        for (var rowIndex in this.keys) {
            var row = this.keys[rowIndex];
            var tr = document.createElement("TR");
            for (var cellIndex in row) {
                var cell = row[cellIndex];
                var td = document.createElement("TD");
                var text = document.createTextNode(cell);
                td.setAttribute("align", "center");
                if (cell && cell.length) {
                    var a = document.createElement("A");
                    a.setAttribute("href", "#");
                    a.setAttribute("class", "css_softkey");
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
                var regex = this.dakuon_regex[this.inputType];
                var match = text.match(regex);
                if (match && match.length > 0) {
                    var dakuon = this.toDakuon(match[0]);
                    return text.replace(regex, dakuon);
                }
                return text;
            case "゜":
                var regex = this.handakuon_regex[this.inputType];
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
                var regex = this.sutegana_regex[this.inputType];
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
        if (this.dakuon[this.inputType][kana]) {
            return this.dakuon[this.inputType][kana];
        }
        return kana;
    },
            
    toHandakuon: function(kana) {
        if (this.handakuon[this.inputType][kana]) {
            return this.handakuon[this.inputType][kana];
        }
        return kana;
    },
            
    toSutegana: function(kana) {
        if (this.sutegana[this.inputType][kana]) {
            return this.sutegana[this.inputType][kana];
        }
        return kana;
    }
};