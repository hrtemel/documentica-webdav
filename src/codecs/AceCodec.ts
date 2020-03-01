
import { ExtChildNode, IDavCodec } from '../types';
import pricipalCodec from './PrincipalCodec';
import privilegesCodec from './PrivilegesCodec';

export interface IAce{
    principal: string|null;
    invertprincipal?:boolean;
    grantdeny:"grant"|"deny"|null;
    isprotected?:boolean;
    privileges:string[],
    inherited:string|null;
    expirationDate?:Date,
    password?:string,
    invitationList?:string[]
}

export function fromXML(nodeList:NodeList){

    let ace:IAce={
        principal:null,
        privileges:[],
        grantdeny:null,
        inherited:null,
        invitationList:[]
    };

    for (var i = 0; i < nodeList.length; i++) {
        var child = nodeList.item(i) as ExtChildNode;
        if ((child.namespaceURI === null) || (child.namespaceURI !== 'DAV:')) {
            continue;
        }
        switch (child.localName) {
            case 'principal':
                ace.invertprincipal = false;
                ace.principal=pricipalCodec.fromXML(child.childNodes);
                break;
            case 'invert':
                ace.invertprincipal = true;
                for (var j = 0; j < child.childNodes.length; j++) {
                    var element = child.childNodes.item(j) as ExtChildNode;
                    if ((element.namespaceURI !== 'DAV:') || (element.localName !== 'principal')) {
                    continue;
                    }
                    ace.principal=pricipalCodec.fromXML(element.childNodes);
                }
                break;
            case 'grant':
                ace.grantdeny = "grant";
                ace.privileges=privilegesCodec.fromXML(child.childNodes);
                break;
            case 'deny':
                    ace.grantdeny = "deny";
                    ace.privileges=privilegesCodec.fromXML(child.childNodes);
                break;
            case 'protected':
                ace.isprotected = true;
                ace.privileges=privilegesCodec.fromXML(child.childNodes);
                break;
            case 'inherited':
                for (var j = 0; j < child.childNodes.length; j++) {
                    var element = child.childNodes.item(j) as ExtChildNode;
                    if ((element.namespaceURI !== 'DAV:') || (element.localName !== 'href')) {
                    continue;
                    }
                    ace.inherited = child.childNodes.item(j).childNodes.item(0).nodeValue;
                };                
                break;
            case 'invitationlist':
                    for (var j = 0; j < child.childNodes.length; j++) {
                        var element = child.childNodes.item(j) as ExtChildNode;
                        if ((element.namespaceURI !== 'DAV:') || (element.localName !== 'email')) {
                            continue;
                        }
                        ace.invitationList!.push(child.childNodes.item(j).childNodes.item(0).nodeValue as string);
                    }; 
                break;
            case 'expirationdate':
                for (var j = 0; j < child.childNodes.length; j++) {
                    var d = child.childNodes.item(j).nodeValue;
                    if (d)
                        ace.expirationDate=new Date(d);
                };
                break;
        }
    }
    return ace;
}

const codec:IDavCodec={
  fromXML,
  toXML:(value:any, xmlDoc:XMLDocument)=>xmlDoc
};

export default codec;