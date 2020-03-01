import { IDavCodec } from "../types";

function parseLockDiscovery(nodelist:NodeList, type:string) {
    let res = undefined;
    let hasOwner = false;
    Array.prototype.filter.call(nodelist, i => i.nodeType != 3).forEach(i => (i.localName == type) && (hasOwner = true));
    if (hasOwner)
        Array.prototype.filter.call(nodelist, i => i.nodeType != 3).forEach(i => {
            if (i.localName === type) {
                Array.prototype.filter.call(i.childNodes, j => j.nodeType != 3).forEach(i2 => {
                    if (i2.localName == "href") {
                        res = i2.textContent;
                    }
                })
            }
        });
    else
        Array.prototype.filter.call(nodelist, i => i.nodeType != 3).forEach(i => {
            if (i.childNodes)
                res = parseLockDiscovery(i.childNodes, type);
        });
    return res;
}

export function  fromXML(nodelist:NodeList) {
    let res:any = {};
    res.owner = parseLockDiscovery(nodelist, "owner");
    res.locktoken = parseLockDiscovery(nodelist, "locktoken");
    return res;
};


export function toXML(value:any, xmlDoc:XMLDocument) {
    console.warn("lockDiscovery cannot be set for request");
    return xmlDoc;
};

const codec:IDavCodec= {
    fromXML,
    toXML
};

export default codec;