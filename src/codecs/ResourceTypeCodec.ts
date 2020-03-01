import { ExtNode, IDavCodec } from "../types";

export const COLLECTION = 1;
export const UNSPECIFIED = 2;
export const PRINCIPAL = 4;

export function fromXML(nodelist:NodeList) {
    for (var i = 0; i < nodelist.length; i++) {
        var node = nodelist.item(i) as ExtNode;
        if (node.namespaceURI === 'DAV:') {
            switch (node.localName) {
                case 'collection':
                    return COLLECTION;
                case 'principal':
                    return PRINCIPAL;
            }
        }
    }
    return UNSPECIFIED;
};

export function toXML(value:any, xmlDoc:XMLDocument) {
    switch (value) {
        case COLLECTION:
            var collection = xmlDoc.createElementNS('DAV:', 'collection');
            xmlDoc.documentElement.appendChild(collection);
            break;
        case PRINCIPAL:
            var collection = xmlDoc.createElementNS('DAV:', 'principal');
            xmlDoc.documentElement.appendChild(collection);
            break;
    }
    return xmlDoc;
};


const codec:IDavCodec= {
    fromXML,
    toXML
};

export default codec;