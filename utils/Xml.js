var xpath = require('xpath');
var dom = require('xmldom').DOMParser;


class XML {
    constructor(xml) {
        this.content = xml;
    }

    /**
     * returns value of the 1st node by xpath
     * @param {string} xpathExpr - xpath exprssion
     * @param {string} ns - namespace
     */
    getValueByXpath(xpathExpr, ns) {
        ns = ns || undefined;
        var doc = new dom().parseFromString(this.content); // TODO: sometimeth trow: [xmldom error] element parse error: Error: attribute equal must after attrName @#[line:7,col:4]
        var nodes, valueFromResponse;
        try {
            if (ns === undefined) {
                nodes = xpath.select(xpathExpr, doc);
            } else {
                nodes = xpath.useNamespaces(ns)(xpathExpr, doc);
            }
        } catch (e) {
            // throw new Error('Seems like XPath is invalid: ' + xpathExpr + '\n\t' + e);
            console.log('Seems like XPath is invalid: ' + xpathExpr + '\n\t' + e);
        }
        try {
            if (xpathExpr.indexOf('count(') > -1) {
                valueFromResponse = nodes;
            } else {
                valueFromResponse = nodes[0].firstChild.data;
            }
        } catch (err) {
            valueFromResponse = "";
        }
        return valueFromResponse;
    }

    /**
     * returns all nodes by xpath
     * @param {string} xpathExpr - xpath exprssion
     * @param {string} ns - namespace
     */
    getValuesByXpath(xpathExpr, ns) {
        ns = ns || undefined;
        var doc = new dom().parseFromString(this.content);
        var nodes, valueFromResponse;
        try {
            if (ns === undefined) {
                nodes = xpath.select(xpathExpr, doc);
            } else {
                nodes = xpath.useNamespaces(ns)(xpathExpr, doc);
            }
        } catch (e) {
            throw new Error('Seems like XPath is invalid: ' + xpathExpr + '\n\t' + e);
        }
        try {
            valueFromResponse = nodes;
        } catch (err) {
            valueFromResponse = "";
        }
        return valueFromResponse;
    }

    /**
     * Sets value by given xpath
     * @param {*} ns - ns is namespace like {"ns2": "http://www.ebxml.org/namespaces/messageHeader"}
     * @param {*} xpathToFind 
     * @param {*} value 
     */
    setValueByXpath(ns, xpathToFind, value) {
        var doc = new dom().parseFromString(this.content);
        xpath.useNamespaces(ns)(xpathToFind, doc)[0].firstChild.data = value;
        this.content = doc.toString();
    }

    /**
     * Sets value by given xpath
     * @param {Object} obj - {ns, xpath, value}
     */
    setValueByXpathNew(obj) {
        var ns = obj.ns || '';
        var xpathToFind = obj.xpath || './/*';
        var value = obj.value || '';
        var doc = new dom().parseFromString(this.content);
        xpath.useNamespaces(ns)(xpathToFind, doc)[0].firstChild.data = value;
        this.content = doc.toString();
    }

    /**
     * Add a new XML as a child by xpath
     * @param {Object} obj - {ns, xpath, value}
     */
    appendXmlByXpath(obj) {
        var ns = obj.ns || '';
        var xpathToFind = obj.xpath || './/*';
        var value = obj.value || '';
        var doc = new dom().parseFromString(this.content);
        xpath.useNamespaces(ns)(xpathToFind, doc)[0].appendChild(new dom().parseFromString(value));
        this.content = doc.toString();
    }

    /**
     * Removes a part of XML by xpath
     * @param {Object} obj - {ns, xpath}
     */
    removeChildByXpath(obj) {
        var ns = obj.ns || '';
        var xpathToFind = obj.xpath || './/*';
        var doc = new dom().parseFromString(this.content);
        xpath.useNamespaces(ns)(xpathToFind + '/..', doc)[0].removeChild(xpath.useNamespaces(ns)(xpathToFind, doc)[0]);
        this.content = doc.toString();
    }

    /**
     * Sets the attribute of 1st node by given xpath
     * @param {*} ns - ns is namespace like {"ns2": "http://www.ebxml.org/namespaces/messageHeader"}
     * @param {*} xpathToFind 
     * @param {*} attr 
     * @param {*} value 
     */
    setAttrByXpathOld(ns, xpathToFind, attr, value) {
        var doc = new dom().parseFromString(this.content);
        xpath.useNamespaces(ns)(xpathToFind, doc)[0].setAttribute(attr, value);
        this.content = doc.toString();
    }

    /**
     * Sets the attribute of 1st node by given xpath
     * @param {Object} obj - {ns, xpath, attribute, value}
     */
    setAttrByXpath(obj) {
        var ns = obj.ns || '';
        var xpathToFind = obj.xpath || undefined;
        var attribute = obj.attribute || '';
        var value = obj.value || '';
        var doc = new dom().parseFromString(this.content);
        xpath.useNamespaces(ns)(xpathToFind, doc)[0].setAttribute(attribute, value);
        this.content = doc.toString();
    }
}

module.exports = XML;