import { IDavCodec } from "../types";


export function  fromXML(nodelist:NodeList) {
    var node = nodelist.item(0) as Node;
    if ((node.nodeType === 3) || (node.nodeType === 4)) {
        return parseInt(node.nodeValue||"0");
    } else {
        return null;
    }
};

export function toXML(value:any, xmlDoc:XMLDocument) {
    var cdata = xmlDoc.createCDATASection(value.toString());
    xmlDoc.documentElement.appendChild(cdata);
    return xmlDoc;
};

const codec:IDavCodec= {
    fromXML,
    toXML
};

export default codec;