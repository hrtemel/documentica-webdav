
import { ExtNode, IDavCodec, ExtChildNode } from '../types';

export function fromXML(nodeList:NodeList) {
    let privileges:(String|null)[]=[];
    for (var i = 0; i < nodeList.length; i++) {
        var privilege = nodeList.item(i) as ExtNode;
        if ((privilege.nodeType === 1) &&
        (privilege.namespaceURI === 'DAV:') &&
        (privilege.localName === 'privilege')) {
            for (let i=0;i<privilege.childNodes.length;i++)
              if (privilege.childNodes[i].nodeType==1)
                  privileges=[...privileges,(privilege.childNodes[i]as ExtChildNode).localName];
        }
    }
    return privileges.filter(i=>i) as String[];
}

const privilegesCodec:IDavCodec={
  fromXML,
  toXML:(value:any, xmlDoc:XMLDocument)=>xmlDoc
};

export default privilegesCodec;