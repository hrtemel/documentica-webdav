import { IDavCodec } from "../types";

export function fromXML (nodelist:NodeList) {
    let res = undefined;

    Array.prototype.filter.call(nodelist, i => i.nodeType != 3).forEach(i => {
        res = i.textContent;
    });

    return res;
};

export function toXML (value:any, xmlDoc:XMLDocument) {
   /* switch (value) {
        case CheckoutCodec.COLLECTION:*/
            var collection = xmlDoc.createElementNS('DAV:', 'collection');
            xmlDoc.documentElement.appendChild(collection);
            /*break;
        case CheckoutCodec.PRINCIPAL:
            var collection = xmlDoc.createElementNS('DAV:', 'principal');
            xmlDoc.documentElement.appendChild(collection);
            break;
    }*/
    return xmlDoc;
};

const codec:IDavCodec= {
    fromXML,
    toXML
};

export default codec;
