import { ExtNode, IDavCodec } from "../types";

export function  fromXML (nodelist:NodeList) {
  var collections = [];
  for ( var key = 0; key < nodelist.length; key++ ) {
    var node = nodelist.item( key ) as ExtNode;
    if ( ( node.nodeType === 1 ) && ( node.localName === 'href' ) && ( node.namespaceURI === 'DAV:' ) ) { // Only extract data from DAV: href nodes
      var href = '';
      for ( var subkey = 0; subkey < node.childNodes.length; subkey++ ) {
        var childNode = node.childNodes.item( subkey );
        if ( ( childNode.nodeType === 3 ) || ( childNode.nodeType === 4 ) ) { // Make sure text and CDATA content is stored
          href += childNode.nodeValue;
        }
      }
      collections.push( href );
    }
  }
  return collections;
};

export function toXML(value:any, xmlDoc:XMLDocument){
  for ( var key in value ) {
    var href = xmlDoc.createElementNS( 'DAV:', 'href' );
    href.appendChild( xmlDoc.createCDATASection( value[ key ] ) );
    xmlDoc.documentElement.appendChild( href );
  }
  return xmlDoc;
};

const codec:IDavCodec= {
  fromXML,
  toXML
};

export default codec;