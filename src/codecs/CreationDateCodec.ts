import { ExtNode, IDavCodec } from "../types";

export function fromXML(nodelist:NodeList) {
    var node = nodelist.item(0) as ExtNode;
    if ((node.nodeType === 3) || (node.nodeType === 4)) { // Make sure text and CDATA content is stored
        return new Date(node.nodeValue as string);
    } else { // If the node is not text or CDATA, then we don't parse a value at all
        return null;
    }
};
    
export function toXML(value:any, xmlDoc:XMLDocument) {
    var cdata = xmlDoc.createCDATASection(value.toISOString());
    xmlDoc.documentElement.appendChild(cdata);
    return xmlDoc;
};

const codec:IDavCodec= {
    fromXML,
    toXML
};

export default codec;

