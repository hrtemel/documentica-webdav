import {  IDavCodec, ExtChildNode } from '../types';

export function fromXML(nodeList:NodeList){
  let privileges:(string|null)[]=[];
  for (let i=0;i<nodeList.length;i++)
  if (nodeList[i].nodeType==1)
      privileges=[...privileges,(nodeList[i]as ExtChildNode).localName];
  return privileges;
};

export function toXML (value:any, xmlDoc:XMLDocument){
  for ( var key in value ) {
    var privilege = xmlDoc.createElementNS( value[ key ].namespace, value[ key ].tagname );
    xmlDoc.documentElement.appendChild( privilege );
  }
  return xmlDoc;
};

const codec:IDavCodec= {
  fromXML,
  toXML
};

export default codec;