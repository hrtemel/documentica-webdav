import { IDavSupportedPrivilege, ExtNode, IDavCodec } from "../types";

const getParsedPrivilege = (nodeList:NodeList) => {
    if (nodeList.length > 0) {
      for (var key=0;key<nodeList.length;key++){
        var node = nodeList.item( key ) as Node;
        if ( ( node.nodeType === 1 )) {
          return (node as any).localName as string;
        }
      }
    };
    return null;
};

const getParsedSupportedPrivilege=(nodeList:NodeList) =>{
	let result:IDavSupportedPrivilege={
		privilege:undefined,
		description:undefined,
		supportedPrivilege:[],
		abstract:false
	}
	if (nodeList.length > 0) {
		for (var key=0;key<nodeList.length;key++){
			var node = nodeList.item( key ) as ExtNode;
			if ( ( node.nodeType === 1 )) {
				const localName:string=node.localName;
				if(localName=="supported-privilege"){
					result.supportedPrivilege=[...result.supportedPrivilege,getParsedSupportedPrivilege(node.childNodes)];
				}else if(localName=="privilege"){
					result.privilege=getParsedPrivilege(node.childNodes);
				}else if(localName=="description"){
					result.description=node.textContent;
				}else if(localName=="abstract"){
					result.abstract=true;
				}else{
					console.log("unknown node type",localName);
				}
			}
		}
	}
	return result;
};

export function fromXML (nodelist:NodeList) {
	let result:IDavSupportedPrivilege[]=[];
	for ( var key = 0; key < nodelist.length; key++ ) {
		var node = nodelist.item( key ) as Node;
		if ( ( node.nodeType === 1 )) {
			result=[...result,getParsedSupportedPrivilege(node.childNodes)];
		}
	}
	return result;
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