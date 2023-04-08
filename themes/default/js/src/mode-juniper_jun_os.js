define("ace/mode/juniper_jun_os_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var JuniperJunOSHighlightRules = function() {

    this.$rules = {
        start: [{
            token: "constant.language.juniper",
            regex: /\b(?:access|^access-profile|^accounting-options|^apply-groups|^chassis|^class-of-service|^demux|^diameter|^ethernet-switching-options|^event-options|^firewall|^forwarding-options|^groups|^interfaces|^jsrc|^jsrc-partition|^poe|^policy-options|^protocols|^routing-instances|^routing-options|^security|^services|^snmp|^system|^virtual-chassis|^vlans)/
        }, {
            token: "constant.language.juniper.system",
            regex: /\b(?:accounting|apply-groups|apply-groups-except|archival|arp|authentication-order|autoinstallation|backup-router|commit|compress-configuration-files|default-address-selection|domain-name|domain-search|extensions|host-name|inet6-backup-router|internet-options|kernel-replication|license|location|login|max-configurations-on-flash|mirror-flash-on-disk|name-server|no-compress-configuration-files|no-multicast-echo|no-neighbor-learn|no-ping-record-route|no-ping-time-stamp|no-redirects|no-saved-core-context|ntp|ports|processes|radius-options|radius-server|root-authentication|saved-core-context|saved-core-files|scripts|services|static-host-mapping|syslog|tacplus-options|tacplus-server|time-zone|tracing|use-imported-time-zones)\b/
        }, {
            token: "constant.language.juniper.system.syslog",
            regex: /\b(?:archive|console|file|host|source-address|time-format|user)\b/
        }, {
            token: "constant.language.juniper.system.services",
            regex: /\b(?:apply-groups|apply-groups-except|dhcp|finger|ftp|netconf|outbound-ssh|service-deployment|ssh|telnet|web-management|xnm-clear-text|xnm-ssl)\b/
        }, {
            token: "constant.numeric.juniper",
            regex: /(?:\w{1,4}(?::\w{1,4}){7}|(?!(?:.*\w(?::|$)){7,})(?:\w{1,4}(?::\w{1,4}){0,5})?::(?:\w{1,4}(?::\w{1,4}){0,5})?)|(?:\w{1,4}(?::\w{1,4}){5}:|(?!(?:.*\w:){5,})(?:\w{1,4}(?::\w{1,4}){0,3})?::(?:\w{1,4}(?::\w{1,4}){0,3}:)?)?(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(?:\.(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|\/\d{1,3}/
        }, {
            token: "support.type.interface.juniper",
            regex: /(?:at-|fe-|ge-|xe-|se-|so-|ae-|(?:lo|fxp)[0-9].[0-9]{1,4}|t1-|es-|gr-|mo-|mt-|sp-|vlan.[0-9]{1,4})|[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{1,2}/
        }, {
            token: "comment.line.number-sign.juniper",
            regex: /##.*$/
        }, {
            token: "comment.line.description.juniper",
            regex: /\bdescription\b/
        }, {
            token: "string.quoted.double.juniper",
            regex: /"/,
            push: [{
                token: "string.quoted.double.juniper",
                regex: /"/,
                next: "pop"
            }, {
                defaultToken: "string.quoted.double.juniper"
            }]
        }, {
            token: "keyword.other.system.juniper",
            regex: /\b(?:authentication-order|domain-name|host-name|login|name-server|ntp|radius-options|radius-server|root-authentication|services|syslog|time-zone)\b/
        }]
    }
    
    this.normalizeRules();
};

JuniperJunOSHighlightRules.metaData = {
    fileTypes: ["junos"],
    firstLineMatch: "(^## Last commit|^version |system {)",
    foldingStartMarker: "/\\*\\*|\\{\\s*$",
    foldingStopMarker: "\\*\\*/|^\\s*\\}",
    keyEquivalent: "@J",
    name: "Juniper JunOS",
    scopeName: "source.juniper-junos-config"
}


oop.inherits(JuniperJunOSHighlightRules, TextHighlightRules);

exports.JuniperJunOSHighlightRules = JuniperJunOSHighlightRules;
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

define("ace/mode/juniper_jun_os",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/juniper_jun_os_highlight_rules","ace/mode/folding/cstyle"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var JuniperJunOSHighlightRules = require("./juniper_jun_os_highlight_rules").JuniperJunOSHighlightRules;
var FoldMode = require("./folding/cstyle").FoldMode;

var Mode = function() {
    this.HighlightRules = JuniperJunOSHighlightRules;
    this.foldingRules = new FoldMode();
};
oop.inherits(Mode, TextMode);

(function() {
    this.$id = "ace/mode/juniper_jun_os"
}).call(Mode.prototype);

exports.Mode = Mode;
});
