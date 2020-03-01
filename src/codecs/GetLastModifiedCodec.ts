import { ExtNode, IDavCodec } from "../types";

export function fromXML(nodelist:NodeList) {
    var node = nodelist.item(0) as ExtNode;
    if ((node.nodeType === 3) || (node.nodeType === 4)) {
        return new Date(node.nodeValue as string);
    } else {
        return null;
    }
};
    
export function toXML(value:any, xmlDoc:XMLDocument) {
    function pad(text:string) {
        text = text.toString();
        while (text.length < 2) {
            text = '0' + text;
        }
        return text;
    }
    var wkday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var date1 = pad(value.getUTCDate()) + ' ' + month[value.getUTCMonth()] + ' ' + value.getUTCFullYear();
    var time = pad(value.getUTCHours()) + ':' + pad(value.getUTCMinutes()) + ':' + pad(value.getUTCSeconds());
    var cdata = xmlDoc.createCDATASection(wkday[value.getUTCDay()] + ', ' + date1 + ' ' + time + ' GMT');
    xmlDoc.documentElement.appendChild(cdata);
    return xmlDoc;
};

const codec:IDavCodec= {
    fromXML,
    toXML
};

export default codec;