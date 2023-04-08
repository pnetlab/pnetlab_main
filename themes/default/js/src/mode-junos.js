define("ace/mode/junos_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
    "use strict";

    var oop = require("../lib/oop");
    var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

    var JunosHighlightRules = function() {
        // regexp must not have capturing parentheses. Use (?:) instead.
        // regexps are ordered -> the first match is used

        this.$rules = {
            start: [{
                token: "comment.block.junos",
                regex: /\/\*/,
                push: [{
                    token: "comment.block.junos",
                    regex: /\*\/|/,
                    next: "pop"
                }, {
                    defaultToken: "comment.block.junos"
                }],
                comment: "Block Comment or annotation"
            }, {
                token: [
                    "comment.line.number-sign.junos",
                    "punctuation.definition.comment.junos",
                    "comment.line.number-sign.junos"
                ],
                regex: /(^|^\s|\s)(#)(.*$ ?)/,
                comment: "Line comment, anything following a hashtag (#)"
            }, {
                token: "entity.name.function.junos",
                regex: "(?<=^|\\s)(?:apply-groups|groups|access-profile|vlans|bridge-domains|routing-instances|dynamic-profiles|jsrc-partition|logical-systems)\\s{\\s*",
                TODO: "FIXME: regexp doesn't have js equivalent",
                originalRegex: "(?<=^|\\s)(apply-groups|groups|access-profile|vlans|bridge-domains|routing-instances|dynamic-profiles|jsrc-partition|logical-systems)(?:\\s{\\s*)",
                push: [{
                    token: "text",
                    regex: /\s{|;/,
                    next: "pop"
                }, {
                    token: "variable.language.junos",
                    regex: /[-\w_<>:\.\/]+/
                }],
                comment: "sections that have a user-defined sub-item, but modified to capture in stanza mode. Had to be its own capture, since it covers multiple lines."
            }, {
                token: "entity.name.function.junos",
                regex: "(?<=^|\\s)(?:system|forwarding-options|routing-options|routing-instances|logical-systems|vlans|bridge-domains|dynamic-profiles|interfaces|snmp|poe|ethernet-switching-options|security)(?=[ \n;])",
                TODO: "FIXME: regexp doesn't have js equivalent",
                originalRegex: "(?<=^|\\s)(system|forwarding-options|routing-options|routing-instances|logical-systems|vlans|bridge-domains|dynamic-profiles|interfaces|snmp|poe|ethernet-switching-options|security)(?=[ \n;])",
                comment: "Major sections of the configuration"
            }, {
                token: "entity.name.function.junos",
                regex: "(?<=^|\\s)(?:policy-options|protocols|chassis|firewall|applications|multi-chassis|redundant-power-system|version|services|virtual-chassis|event-options|class-of-service|access|accounting-options|diameter|fabric|multicast-snooping-options|switch-options|wlan|smtp|schedulers)(?=[ \n;])",
                TODO: "FIXME: regexp doesn't have js equivalent",
                originalRegex: "(?<=^|\\s)(policy-options|protocols|chassis|firewall|applications|multi-chassis|redundant-power-system|version|services|virtual-chassis|event-options|class-of-service|access|accounting-options|diameter|fabric|multicast-snooping-options|switch-options|wlan|smtp|schedulers)(?=[ \n;])",
                comment: "minor sections of the config."
            }, {
                token: "keyword.control.junos",
                regex: "(?<=^|\\s)(?:set|request|delete|edit|show|protect:?|inactive:|unprotect|deactivate|activate)(?= )",
                TODO: "FIXME: regexp doesn't have js equivalent",
                originalRegex: "(?<=^|\\s)(set|request|delete|edit|show|protect:?|inactive:|unprotect|deactivate|activate)(?= )",
                comment: "keywords captured without a major/minor section attached"
            }, {
                token: "invalid.illegal.junos",
                regex: "(?<=\\s)(?:deny|discard|reject)(?=\\s|;|$)",
                TODO: "FIXME: regexp doesn't have js equivalent",
                originalRegex: "(?<=\\s)(deny|discard|reject)(?=\\s|;|$)",
                comment: "Policy/filter denial/rejection actions"
            }, {
                token: "constant.language.junos",
                regex: "(?<=\\s)(?:accept|permit)(?=\\s|;|$)",
                TODO: "FIXME: regexp doesn't have js equivalent",
                originalRegex: "(?<=\\s)(accept|permit)(?=\\s|;|$)",
                comment: "Policy/filter accept/permit actions"
            }, {
                token: "support.class.junos",
                regex: /\b(?:(?:ge|et|so|fe|gr|xe|lt|vt|si|sp)-\d+\/\d+\/\d+|(?:st|lo|me|vme|ae)\d{1,3}|irb|vlan)(?:\.\d{1,5})?\b(?![-_<>])/,
                comment: "Interface names"
            }, {
                token: "constant.numeric.integer.long.octal.junos",
                regex: /\b(?:(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(?:[\/]\d{1,2})?\b/,
                comment: "IPv4 addresses, with or without a mask"
            }, {
                token: "constant.numeric.integer.long.octal.junos",
                regex: /\b(?:[0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}(?:[\/]\d{1,2})?\b/,
                comment: "MAC Addresses identified as a number"
            }, {
                token: "constant.numeric.integer.long.octal.junos",
                regex: /\s(?:(?:peer-)?unit|queue(?:-num)?|destination-port|source-port)[ ]\d{1,5}(?:-\d{1,5})?(?=[;]|$|\b)/,
                comment: "Unit numbers, port numbers, etc"
            }, {
                token: "keyword.operator.junos",
                regex: /\b(?:https?:|scp:|(?:s?|t?)ftp:)\/\/(?:[\da-zA-Z\.-]+\.[A-Za-z\.]{2,6}|\b(?:(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\b)(?:[\/\w\.&?=+-]*)*\/?/,
                comment: "URL Addresses, either matching character URL patterns, or http(s):// followed by an IPv4 address. "
            }, {
                token: "keyword.operator.junos",
                regex: "(?<=\\s)(?:[\\w\\d_-]+\\.)?(?:inet6?|mpls|inetflow|iso|bgp\\.l(?:2|3)vpn)\\.\\d{1,2}\\b",
                TODO: "FIXME: regexp doesn't have js equivalent",
                originalRegex: "(?<=\\s)([\\w\\d_-]+\\.)?(inet6?|mpls|inetflow|iso|bgp\\.l(2|3)vpn)\\.\\d{1,2}(?:\\b)",
                comment: "Routing table names"
            }, {
                token: "entity.name.function.junos",
                regex: "(?<=^|\\s)(?:logical-systems|\\sdynamic-profiles|\\sjsrc-partition|\\spartition|\\sfilter input|\\sfilter output|\\saccess-profile|\\sdscp|\\sdscp-ipv6|\\sexp|\\sieee-802\\.1|\\sieee-802\\.1ad|\\sinet-precedence|\\sscheduler-map|\\sscheduler-maps|\\sinput-traffic-control-profile-remaining|\\sinput-traffic-control-profile|\\straffic-control-profiles|\\soutput-traffic-control-profile-remaining|\\soutput-traffic-control-profile|\\soutput-forwarding-class-map|\\sscheduler-map-chassis|\\sfragmentation-maps|\\ssource-prefix-list|\\sbridge-domains|\\sgroup|\\smime-pattern|\\surl-pattern|\\slabel-switched-path|\\sadmin-groups|\\scustom-url-category|\\sprofile|\\surl-whitelist|\\surl-blacklist|\\sca-profile|\\sidp-policy|\\sactive-policy|\\sinterface-set|\\sinterface-range|\\scount|\\sdestination-prefix-list|\\sschedulers|\\sdrop-profiles|\\sforwarding-class|\\sforwarding-class-map|\\simport|\\sexport|\\sinstance|\\sutm-policy|\\sids-option|\\snext-hop-group|\\srouting-instances|\\srule|\\srule-set|\\spool|\\sclass|\\sunit|\\sport-mirror-instance|\\sfrom-zone|\\sto-zone|\\sapply-groups|\\sfile|\\shost-name|\\sdomain-name|\\spath|\\sdomain-search|\\scommunity delete|\\scommunity add|\\scommunity set|\\scommunity|\\strap-group|\\spolicy|\\spolicy-statement|\\simport-policy|\\sinstance-export|\\sinstance-import|\\svrf-import|\\svrf-export|\\simport|\\sexport|\\skeep-import|\\sinter-area-prefix-import|\\sinter-area-prefix-export|\\snetwork-summary-export|\\snetwork-summary-import|\\segress-policy|\\sbootstrap-import|\\sbootstrap-export|\\sfilter|\\sprefix-list|\\sproposal|\\saddress-set|\\sscheduler|\\srib-groups|\\sgroups|\\ssecurity-zone|\\sterm|\\sapplication|\\sapplication-set|\\svlans|\\sgateway|\\suser|\\spolicer|\\slsp|\\scondition)\\s{\\s*",
                TODO: "FIXME: regexp doesn't have js equivalent",
                originalRegex: "(?<=^|\\s)(logical-systems|\\sdynamic-profiles|\\sjsrc-partition|\\spartition|\\sfilter input|\\sfilter output|\\saccess-profile|\\sdscp|\\sdscp-ipv6|\\sexp|\\sieee-802\\.1|\\sieee-802\\.1ad|\\sinet-precedence|\\sscheduler-map|\\sscheduler-maps|\\sinput-traffic-control-profile-remaining|\\sinput-traffic-control-profile|\\straffic-control-profiles|\\soutput-traffic-control-profile-remaining|\\soutput-traffic-control-profile|\\soutput-forwarding-class-map|\\sscheduler-map-chassis|\\sfragmentation-maps|\\ssource-prefix-list|\\sbridge-domains|\\sgroup|\\smime-pattern|\\surl-pattern|\\slabel-switched-path|\\sadmin-groups|\\scustom-url-category|\\sprofile|\\surl-whitelist|\\surl-blacklist|\\sca-profile|\\sidp-policy|\\sactive-policy|\\sinterface-set|\\sinterface-range|\\scount|\\sdestination-prefix-list|\\sschedulers|\\sdrop-profiles|\\sforwarding-class|\\sforwarding-class-map|\\simport|\\sexport|\\sinstance|\\sutm-policy|\\sids-option|\\snext-hop-group|\\srouting-instances|\\srule|\\srule-set|\\spool|\\sclass|\\sunit|\\sport-mirror-instance|\\sfrom-zone|\\sto-zone|\\sapply-groups|\\sfile|\\shost-name|\\sdomain-name|\\spath|\\sdomain-search|\\scommunity delete|\\scommunity add|\\scommunity set|\\scommunity|\\strap-group|\\spolicy|\\spolicy-statement|\\simport-policy|\\sinstance-export|\\sinstance-import|\\svrf-import|\\svrf-export|\\simport|\\sexport|\\skeep-import|\\sinter-area-prefix-import|\\sinter-area-prefix-export|\\snetwork-summary-export|\\snetwork-summary-import|\\segress-policy|\\sbootstrap-import|\\sbootstrap-export|\\sfilter|\\sprefix-list|\\sproposal|\\saddress-set|\\sscheduler|\\srib-groups|\\sgroups|\\ssecurity-zone|\\sterm|\\sapplication|\\sapplication-set|\\svlans|\\sgateway|\\suser|\\spolicer|\\slsp|\\scondition)(?:\\s{\\s*)",
                push: [{
                    token: "text",
                    regex: /\s{|;/,
                    next: "pop"
                }, {
                    token: "variable.language.junos",
                    regex: /[-\w_<>:\.\/]+/
                }],
                comment: "Stanza double-line capture for user defined arbitrary names (such as filters, policy names, prefix-lists, etc)"
            }, {
                token: "variable.language.junos",
                regex: "(?<=\\slogical-systems|\\sdynamic-profiles|\\sjsrc-partition|\\spartition|\\sfilter input|\\sfilter output|\\saccess-profile|\\sdscp|\\sdscp-ipv6|\\sexp|\\sieee-802\\.1|\\sieee-802\\.1ad|\\sinet-precedence|\\sscheduler-map|\\sscheduler-maps|\\sinput-traffic-control-profile-remaining|\\sinput-traffic-control-profile|\\straffic-control-profiles|\\soutput-traffic-control-profile-remaining|\\soutput-traffic-control-profile|\\soutput-forwarding-class-map|\\sscheduler-map-chassis|\\sfragmentation-maps|\\ssource-prefix-list|\\sbridge-domains|\\sgroup|\\smime-pattern|\\surl-pattern|\\slabel-switched-path|\\sadmin-groups|\\scustom-url-category|\\sprofile|\\surl-whitelist|\\surl-blacklist|\\sca-profile|\\sidp-policy|\\sactive-policy|\\sinterface-set|\\sinterface-range|\\scount|\\sdestination-prefix-list|\\sschedulers|\\sdrop-profiles|\\sforwarding-class|\\sforwarding-class-map|\\simport|\\sexport|\\sinstance|\\sutm-policy|\\sids-option|\\snext-hop-group|\\srouting-instances|\\srule|\\srule-set|\\spool|\\sclass|\\sunit|\\sport-mirror-instance|\\sfrom-zone|\\sto-zone|\\sapply-groups|\\sfile|\\shost-name|\\sdomain-name|\\spath|\\sdomain-search|\\scommunity delete|\\scommunity add|\\scommunity set|\\scommunity|\\strap-group|\\spolicy|\\spolicy-statement|\\simport-policy|\\sinstance-export|\\sinstance-import|\\svrf-import|\\svrf-export|\\simport|\\sexport|\\skeep-import|\\sinter-area-prefix-import|\\sinter-area-prefix-export|\\snetwork-summary-export|\\snetwork-summary-import|\\segress-policy|\\sbootstrap-import|\\sbootstrap-export|\\sfilter|\\sprefix-list|\\sproposal|\\saddress-set|\\sscheduler|\\srib-groups|\\sgroups|\\ssecurity-zone|\\sterm|\\sapplication|\\sapplication-set|\\svlans|\\sgateway|\\suser|\\spolicer|\\slsp|\\scondition) [-\\w_<>:\\./]+(?=[;]|\\b)",
                TODO: "FIXME: regexp doesn't have js equivalent",
                originalRegex: "(?<=\\slogical-systems|\\sdynamic-profiles|\\sjsrc-partition|\\spartition|\\sfilter input|\\sfilter output|\\saccess-profile|\\sdscp|\\sdscp-ipv6|\\sexp|\\sieee-802\\.1|\\sieee-802\\.1ad|\\sinet-precedence|\\sscheduler-map|\\sscheduler-maps|\\sinput-traffic-control-profile-remaining|\\sinput-traffic-control-profile|\\straffic-control-profiles|\\soutput-traffic-control-profile-remaining|\\soutput-traffic-control-profile|\\soutput-forwarding-class-map|\\sscheduler-map-chassis|\\sfragmentation-maps|\\ssource-prefix-list|\\sbridge-domains|\\sgroup|\\smime-pattern|\\surl-pattern|\\slabel-switched-path|\\sadmin-groups|\\scustom-url-category|\\sprofile|\\surl-whitelist|\\surl-blacklist|\\sca-profile|\\sidp-policy|\\sactive-policy|\\sinterface-set|\\sinterface-range|\\scount|\\sdestination-prefix-list|\\sschedulers|\\sdrop-profiles|\\sforwarding-class|\\sforwarding-class-map|\\simport|\\sexport|\\sinstance|\\sutm-policy|\\sids-option|\\snext-hop-group|\\srouting-instances|\\srule|\\srule-set|\\spool|\\sclass|\\sunit|\\sport-mirror-instance|\\sfrom-zone|\\sto-zone|\\sapply-groups|\\sfile|\\shost-name|\\sdomain-name|\\spath|\\sdomain-search|\\scommunity delete|\\scommunity add|\\scommunity set|\\scommunity|\\strap-group|\\spolicy|\\spolicy-statement|\\simport-policy|\\sinstance-export|\\sinstance-import|\\svrf-import|\\svrf-export|\\simport|\\sexport|\\skeep-import|\\sinter-area-prefix-import|\\sinter-area-prefix-export|\\snetwork-summary-export|\\snetwork-summary-import|\\segress-policy|\\sbootstrap-import|\\sbootstrap-export|\\sfilter|\\sprefix-list|\\sproposal|\\saddress-set|\\sscheduler|\\srib-groups|\\sgroups|\\ssecurity-zone|\\sterm|\\sapplication|\\sapplication-set|\\svlans|\\sgateway|\\suser|\\spolicer|\\slsp|\\scondition)( [-\\w_<>:\\./]+)(?=[;]|\\b)",
                comment: "User defined arbitrary names (such as filters, policy names, prefix-lists, etc)"
            }, {
                token: "constant.numeric.integer.long.octal.junos",
                regex: /(?:\s|^)(?:(?=.*::)(?!.*::.+::)(?:::)?(?:[\dA-Fa-f]{1,4}:(?::|\b)|){5}|(?:[\dA-Fa-f]{1,4}:){6})(?:(?:[\dA-Fa-f]{1,4}(?:::|:\b|[\/]\d+|)|(?!\3\4)){2}|(?:(?:(?:2[0-4]|1\d|[1-9])?\d|25[0-5])\.?){4})(?:[\/]\d{1,3})?(?:\s|;)/,
                comment: "IPv6 Addresses. This will not fully validate the structure of the IP, so some invalid IPv6 addresses might be false positives. IPv6 addresses themselves should be validated by running commands against a Junos device."
            }, {
                token: "constant.numeric.integer.long.octal.junos",
                regex: "(?<!term )(?<=\\s)\\d+(?=[;]|\\s)",
                TODO: "FIXME: regexp doesn't have js equivalent",
                originalRegex: "(?<!term )(?<=\\s)(\\d+)(?=[;]|\\s)",
                comment: "Other general numbers"
            }, {
                token: "punctuation.definition.string.begin.junos",
                regex: /"/,
                push: [{
                    token: "punctuation.definition.string.end.junos",
                    regex: /"/,
                    next: "pop"
                }, {
                    token: "constant.character.escape.junos",
                    regex: /\\./
                }, {
                    defaultToken: "string.quoted.double.junos"
                }],
                comment: "Double quoted strings"
            }, {
                token: "punctuation.definition.string.begin.junos",
                regex: /'/,
                push: [{
                    token: "punctuation.definition.string.end.junos",
                    regex: /'/,
                    next: "pop"
                }, {
                    token: "constant.character.escape.junos",
                    regex: /\\./
                }, {
                    defaultToken: "string.quoted.single.junos"
                }],
                comment: "Single quoted strings"
            }, {
                token: "string.quoted.double.junos",
                regex: /\sdescription [-_\w<>':\.\/\[\]]+\b/,
                comment: "Descriptions should always look like strings, even if no quotations are needed"
            }]
        }

        this.normalizeRules();
    };

    JunosHighlightRules.metaData = {
        fileTypes: [
            "conf",
            "conf.1",
            "conf.2",
            "conf.3",
            "conf.4",
            "conf.5",
            "conf.6",
            "conf.7",
            "conf.8",
            "conf.9",
            "conf.10",
            "conf.11",
            "conf.12",
            "conf.13",
            "conf.14",
            "conf.15",
            "conf.16",
            "conf.17",
            "conf.18",
            "conf.19",
            "conf.20",
            "conf.21",
            "conf.22",
            "conf.23",
            "conf.24",
            "conf.25",
            "conf.26",
            "conf.27",
            "conf.28",
            "conf.29",
            "conf.30",
            "conf.31",
            "conf.32",
            "conf.33",
            "conf.34",
            "conf.35",
            "conf.36",
            "conf.37",
            "conf.38",
            "conf.39",
            "conf.40",
            "conf.41",
            "conf.42",
            "conf.43",
            "conf.44",
            "conf.45",
            "conf.46",
            "conf.47",
            "conf.48",
            "conf.49"
        ],
        name: "Junos",
        scopeName: "text.junos"
    }

    oop.inherits(JunosHighlightRules, TextHighlightRules);

    exports.JunosHighlightRules = JunosHighlightRules;
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

define("ace/mode/junos",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/abc_highlight_rules","ace/mode/folding/cstyle"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var JunosHighlightRules = require("./junos_highlight_rules").JunosHighlightRules;
// TODO: pick appropriate fold mode
var FoldMode = require("./folding/cstyle").FoldMode;

var Mode = function() {
    this.HighlightRules = JunosHighlightRules;
    this.foldingRules = new FoldMode();
};
oop.inherits(Mode, TextMode);

(function() {
    // this.lineCommentStart = ""/\\*"";
    // this.blockComment = {start: ""/*"", end: ""*/""};
    // Extra logic goes here.
    this.$id = "ace/mode/junos"
}).call(Mode.prototype);

exports.Mode = Mode;
});