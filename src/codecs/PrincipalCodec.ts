
import Property from '../Property';
import { ExtChildNode, IDavCodec } from '../types';

import {WEBDAV_ACE_ALL,WEBDAV_ACE_AUTHENTICATED,WEBDAV_ACE_UNAUTHENTICATED,WEBDAV_ACE_SELF} from '../constants';


export function fromXML(nodeList:NodeList){

  for (var j = 0; j < nodeList.length; j++) {
    var principal = nodeList.item(j) as ExtChildNode;
    if ((principal.nodeType !== 1) || (principal.namespaceURI === null) || (principal.namespaceURI !== 'DAV:')) { // Skip if not from the right namespace
      continue;
    }
    switch (principal.localName) {
      case 'href':
        return  principal.childNodes.item(0).nodeValue;
      case 'all':
        return WEBDAV_ACE_ALL;
      case 'authenticated':
        return WEBDAV_ACE_AUTHENTICATED;
      case 'unauthenticated':
        return WEBDAV_ACE_UNAUTHENTICATED;
      case 'property':
        for (var k = 0; k < principal.childNodes.length; k++) {
          var element = principal.childNodes.item(k);
          if (element.nodeType !== 1) {
            continue;
          }
          var prop = new Property(element as ExtChildNode);
          return prop;
        }
        break;
      case 'self':
        return  WEBDAV_ACE_SELF;
      default:
        throw 'Principal XML Node contains illegal child node: ' + principal.localName;
    }
  }
}

const codec:IDavCodec={
  fromXML,
  toXML:(value:any, xmlDoc:XMLDocument)=>xmlDoc
};

export default codec;