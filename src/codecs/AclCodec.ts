import Exception from '../Exception';
import { IDavCodec, ExtChildNode } from '../types';
import Property from '../Property';
import AceCodec from './AceCodec';
import {WEBDAV_ACE_GRANT ,WEBDAV_ACE_DENY,WEBDAV_ACE_ALL,WEBDAV_ACE_AUTHENTICATED,WEBDAV_ACE_UNAUTHENTICATED,WEBDAV_ACE_SELF} from '../constants';
 
export function fromXML(nodelist:NodeList) {
  let aces=[];
  for (var i = 0; i < nodelist.length; i++) {
    var child = nodelist.item(i) as ExtChildNode;
    if ((child.namespaceURI === null) || (child.namespaceURI !== 'DAV:') || (child.localName !== 'ace')) { // Skip if not the right element
      continue;
    }
    aces.push(AceCodec.fromXML(child.childNodes));
  }
  return aces;
}


const codec:IDavCodec= {
  fromXML
};

export default codec;