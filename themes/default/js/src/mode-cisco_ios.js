define("ace/mode/cisco_ios_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
    "use strict";

    var oop = require("../lib/oop");
    var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

    var CiscoIOSHighlightRules = function() {
        // regexp must not have capturing parentheses. Use (?:) instead.
        // regexps are ordered -> the first match is used

        this.$rules = {
            start: [{
                include: "#comment"
            }, {
                include: "#control"
            }, {
                include: "#ip_address"
            }, {
                include: "#number"
            }, {
                include: "#variable"
            }, {
                include: "#operator"
            }, {
                include: "#url"
            }, {
                include: "#router"
            }, {
                include: "#interface_clause"
            }],
            "#comment": [{
                token: [
                    "puncuation.definition.comment.ios",
                    "comment.line.number-sign.ios"
                ],
                regex: /(!)(.*$)/
            }],
            "#control": [{
                token: "keyword.control.ios",
                regex: /\b(?:no|no sh|shut|shutdown|reload|reset|activate)\b/
            }],
            "#interface_clause": [{
                token: [
                    "meta.interface.ios",
                    "entity.name.type.interface.ios",
                    "meta.interface.ios"
                ],
                regex: /^(\s*)(interface|int)(\s+)(?=[A-Za-z-]+[0-9\/. ]*)/,
                push: [{
                    token: "meta.interface.ios",
                    regex: /\s*$/,
                    next: "pop"
                }, {
                    include: "#interface_id"
                }, {
                    token: "invalid.illegal.interface-id.ios",
                    regex: /.*$/
                }, {
                    defaultToken: "meta.interface.ios"
                }]
            }],
            "#interface_id": [{
                token: "support.constant.type.interface.ios",
                regex: /\b(?:(?:fast|gigabit|)ethernet|null|bvi|virtual-?[a-z]*|fa|gi|e|se|serial|lo|loopback|tun|tunnel)(?=\s?[0-9])/,
                caseInsensitive: true,
                push: [{
                    token: "constant.numeric.interface-number.ios",
                    regex: /[0-9][0-9\/. ]*\b/,
                    next: "pop"
                }, {
                    defaultToken: "meta.interface-id.ios"
                }]
            }],
            "#ip_address": [{
                token: "constant.numeric.ip-address.ios",
                regex: /\s(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\s/
            }, {
                token: "invalid.illegal.ip-address.ios",
                regex: /\s(?:25[6-9]|2[6-9][0-9]|[3-9]?[0-9][0-9]?)\.\b/
            }],
            "#number": [{
                token: "constant.numeric.integer.ios",
                regex: /\b(?:[1-9]+[0-9]*|0)\b/
            }],
            "#operator": [{
                token: "keyword.operator.comparison.ios",
                regex: /\b(?:eq|neq|gt|lt|range|ge|le)\b/,
                caseInsensitive: true
            }],
            "#router": [{
                token: [
                    "meta.router.ios",
                    "entity.name.type.router.ios",
                    "meta.router.ios"
                ],
                regex: /^(\s*)(router)(\s+)(?=[A-Za-z-]+[0-9 ]*)/,
                push: [{
                    token: "meta.router.ios",
                    regex: /\s*$/,
                    next: "pop"
                }, {
                    include: "#router_id"
                }, {
                    token: "invalid.illegal.router-id.ios",
                    regex: /.*$/
                }, {
                    defaultToken: "meta.router.ios"
                }]
            }],
            "#router_id": [{
                token: "support.constant.type.router.ios",
                regex: /\b(?:eigrp|rip|isis|odr|ospf|bgp|mobile)/,
                caseInsensitive: true,
                push: [{
                    token: [],
                    regex: /(?:\s+[0-9]+|[A-Z]+|)\b/,
                    next: "pop"
                }, {
                    defaultToken: "meta.router-id.ios"
                }]
            }],
            "#url": [{
                token: "string.unquoted.ios",
                regex: /\b(?:https?|t?ftps?|flash|disk[0-9]|scp|ssh|telnet):(?=[A-Za-z0-9_.\/-])/,
                push: [{
                    token: "string.unquoted.ios",
                    regex: /(?=\s+)/,
                    next: "pop"
                }, {
                    defaultToken: "string.unquoted.ios"
                }]
            }],
            "#variable": [{
                token: "variable.parameter.ios",
                regex: /\b[A-Z]+[A-Z0-9_ -]*\b/,
                comment: "User created objects"
            }]
        }

        this.normalizeRules();
    };

    CiscoIOSHighlightRules.metaData = {
        fileTypes: ["ios"],
        foldingStartMarker: "^\\s*.+$",
        foldingStopMarker: "^\\s*!.*$",
        name: "Cisco IOS",
        scopeName: "text.ios"
    }


    oop.inherits(CiscoIOSHighlightRules, TextHighlightRules);

    exports.CiscoIOSHighlightRules = CiscoIOSHighlightRules;
});

define("ace/mode/folding/cstyle",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode"], function(require, exports, module) {
    "use strict";

    var oop = require("../../lib/oop");
    var Range = require("../../range").Range;
    var BaseFoldMode = require("./fold_mode").FoldMode;

    var FoldMode = exports.FoldMode = function(commentRegex) {
        if (commentRegex) {
            this.foldingStartMarker = new RegExp(
                this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.start)
            );
            this.foldingStopMarker = new RegExp(
                this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.end)
            );
        }
    };
    oop.inherits(FoldMode, BaseFoldMode);

    (function() {

        this.foldingStartMarker = /(\{|\[)[^\}\]]*$|^\s*(\/\*)/;
        this.foldingStopMarker = /^[^\[\{]*(\}|\])|^[\s\*]*(\*\/)/;
        this.singleLineBlockCommentRe= /^\s*(\/\*).*\*\/\s*$/;
        this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/;
        this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/;
        this._getFoldWidgetBase = this.getFoldWidget;
        this.getFoldWidget = function(session, foldStyle, row) {
            var line = session.getLine(row);

            if (this.singleLineBlockCommentRe.test(line)) {
                if (!this.startRegionRe.test(line) && !this.tripleStarBlockCommentRe.test(line))
                    return "";
            }

            var fw = this._getFoldWidgetBase(session, foldStyle, row);

            if (!fw && this.startRegionRe.test(line))
                return "start"; // lineCommentRegionStart

            return fw;
        };

        this.getFoldWidgetRange = function(session, foldStyle, row, forceMultiline) {
            var line = session.getLine(row);

            if (this.startRegionRe.test(line))
                return this.getCommentRegionBlock(session, line, row);

            var match = line.match(this.foldingStartMarker);
            if (match) {
                var i = match.index;

                if (match[1])
                    return this.openingBracketBlock(session, match[1], row, i);

                var range = session.getCommentFoldRange(row, i + match[0].length, 1);

                if (range && !range.isMultiLine()) {
                    if (forceMultiline) {
                        range = this.getSectionRange(session, row);
                    } else if (foldStyle != "all")
                        range = null;
                }

                return range;
            }

            if (foldStyle === "markbegin")
                return;

            var match = line.match(this.foldingStopMarker);
            if (match) {
                var i = match.index + match[0].length;

                if (match[1])
                    return this.closingBracketBlock(session, match[1], row, i);

                return session.getCommentFoldRange(row, i, -1);
            }
        };

        this.getSectionRange = function(session, row) {
            var line = session.getLine(row);
            var startIndent = line.search(/\S/);
            var startRow = row;
            var startColumn = line.length;
            row = row + 1;
            var endRow = row;
            var maxRow = session.getLength();
            while (++row < maxRow) {
                line = session.getLine(row);
                var indent = line.search(/\S/);
                if (indent === -1)
                    continue;
                if  (startIndent > indent)
                    break;
                var subRange = this.getFoldWidgetRange(session, "all", row);

                if (subRange) {
                    if (subRange.start.row <= startRow) {
                        break;
                    } else if (subRange.isMultiLine()) {
                        row = subRange.end.row;
                    } else if (startIndent == indent) {
                        break;
                    }
                }
                endRow = row;
            }

            return new Range(startRow, startColumn, endRow, session.getLine(endRow).length);
        };
        this.getCommentRegionBlock = function(session, line, row) {
            var startColumn = line.search(/\s*$/);
            var maxRow = session.getLength();
            var startRow = row;

            var re = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/;
            var depth = 1;
            while (++row < maxRow) {
                line = session.getLine(row);
                var m = re.exec(line);
                if (!m) continue;
                if (m[1]) depth--;
                else depth++;

                if (!depth) break;
            }

            var endRow = row;
            if (endRow > startRow) {
                return new Range(startRow, startColumn, endRow, line.length);
            }
        };

    }).call(FoldMode.prototype);

});

define("ace/mode/cisco_ios",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/abc_highlight_rules","ace/mode/folding/cstyle"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var CiscoIOSHighlightRules = require("./cisco_ios_highlight_rules").CiscoIOSHighlightRules;
// TODO: pick appropriate fold mode
var FoldMode = require("./folding/cstyle").FoldMode;

var Mode = function() {
    this.HighlightRules = CiscoIOSHighlightRules;
    this.foldingRules = new FoldMode();
};
oop.inherits(Mode, TextMode);

(function() {
    // this.lineCommentStart = ""//"";
    // this.blockComment = {start: ""/*"", end: ""*/""};
    // Extra logic goes here.
    this.$id = "ace/mode/cisco_ios"
}).call(Mode.prototype);

exports.Mode = Mode;
});