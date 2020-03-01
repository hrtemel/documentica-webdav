import { ExtNode, IDavCodec } from "../types";

export function fromXML(nodelist:NodeList) {
    var returnValue = null;

    // Assertions whether the formed XML is correct
    var hrefNode = nodelist.item(0) as Node;
    //TODO:uygulamaya eklenen kod kontrol et
    if (hrefNode.nodeType === 3) {
        returnValue = hrefNode.nodeValue;
    } else if ((hrefNode.nodeType === 1) &&
        (hrefNode.namespaceURI === 'DAV:') &&
        ((hrefNode as ExtNode).localName === 'href')) {
        var node = hrefNode.childNodes.item(0);

        if ((node.nodeType === 3) || (node.nodeType === 4)) { // Make sure text and CDATA content is stored
            returnValue = node.nodeValue;
        }
    }
    return returnValue;
};

export function toXML(value:any, xmlDoc:XMLDocument) {
    if (value){
        var hrefNode = xmlDoc.createElementNS('DAV:', 'href');
        hrefNode.appendChild(xmlDoc.createCDATASection(value.toString()));
        xmlDoc.documentElement.appendChild(hrefNode);
    }
    return xmlDoc;
};

const codec:IDavCodec= {
    fromXML,
    toXML
};

export default codec;