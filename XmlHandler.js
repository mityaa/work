var xpath = require('xpath');
var dom = require('xmldom').DOMParser;


var XmlHandler = function () { };

/**
 * returns 1st node
 */
XmlHandler.byXpath = function (xml, xpathExpr, ns) {
    ns = ns || undefined;
    var doc = new dom().parseFromString(xml); // TODO: sometimes trow: [xmldom error] element parse error: Error: attribute equal must after attrName @#[line:7,col:4]
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
};

/**
 * returns all nodes
*/
XmlHandler.byXpathNew = function (xml, xpathExpr, ns) {
    ns = ns || undefined;
    var doc = new dom().parseFromString(xml);
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
};

/*
* ns is namespace like {"ns2": "http://www.ebxml.org/namespaces/messageHeader"}
*/
XmlHandler.setValueByXpath = function (xml, ns, xpathToFind, value) {
    var doc = new dom().parseFromString(xml);
    xpath.useNamespaces(ns)(xpathToFind, doc)[0].firstChild.data = value;
    return doc.toString();
};

// {xml, ns, xpathToFind, value}
XmlHandler.setValueByXpathNew = function (obj) {
    var xml = obj.xml || '';
    var ns = obj.ns || '';
    var xpathToFind = obj.xpath || './/*';
    var value = obj.value || '';
    var doc = new dom().parseFromString(xml);
    xpath.useNamespaces(ns)(xpathToFind, doc)[0].firstChild.data = value;
    return doc.toString();
};

// {xml, ns, xpathToFind, value}
XmlHandler.appendXmlByXpath = function (obj) {
    var xml = obj.xml || '';
    var ns = obj.ns || '';
    var xpathToFind = obj.xpath || './/*';
    var value = obj.value || '';
    var doc = new dom().parseFromString(xml);
    xpath.useNamespaces(ns)(xpathToFind, doc)[0].appendChild(new dom().parseFromString(value));
    return doc.toString();
};

// {xml, ns, xpathToFind, value}
XmlHandler.removeXmlByXpath = function (obj) {
    var xml = obj.xml || '';
    var ns = obj.ns || '';
    var xpathToFind = obj.xpath || './/*';
    var doc = new dom().parseFromString(xml);
    xpath.useNamespaces(ns)(xpathToFind + '/..', doc)[0].removeChild(xpath.useNamespaces(ns)(xpathToFind, doc)[0]);
    return doc.toString();
};

/*
* ns is namespace like {"ns2": "http://www.ebxml.org/namespaces/messageHeader"}
*/
XmlHandler.setAttrByXpath = function (xml, ns, xpathToFind, attr, value) {
    var doc = new dom().parseFromString(xml);
    xpath.useNamespaces(ns)(xpathToFind, doc)[0].setAttribute(attr, value);
    return doc.toString();
};

// {xml, ns, xpathToFind, attribute, value}
XmlHandler.setAttrByXpathNew = function (obj) {
    var xml = obj.xml || '';
    var ns = obj.ns || '';
    var xpathToFind = obj.xpath || undefined;
    var attribute = obj.attribute || '';
    var value = obj.value || '';
    var doc = new dom().parseFromString(xml);
    xpath.useNamespaces(ns)(xpathToFind, doc)[0].setAttribute(attribute, value);
    return doc.toString();
};

module.exports = XmlHandler;