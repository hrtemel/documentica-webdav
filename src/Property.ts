import Exception from './Exception';
import AclCodec from './codecs/AclCodec';
import CheckOutCodec from './codecs/CheckOutCodec';
import CreationDateCodec from './codecs/CreationDateCodec';
import GetLastModifiedCodec from './codecs/GetLastModifiedCodec';
import IntCodec from './codecs/IntCodec';
import LockDiscoveryCodec from './codecs/LockDiscoveryCodec';
import OwnerCodec from './codecs/OwnerCodec';
import PrincipalCollectionCodec from './codecs/PrincipalCollectionCodec';
import ResourceTypeCodec from './codecs/ResourceTypeCodec';
import SupportedPrivilegeSetCodec from './codecs/SupportedPrivilegeSetCodec';
import CurrentUserPrivilegeSetCodec from './codecs/CurrentUserPrivilegeCodec';
import { IDavCodec, IDavCodecsNamespace, ExtChildNode } from './types';

export interface IProperty{
    getParsedValue:()=>any,
    xmlvalue?:NodeList,
    tagname:string
}

export const codecs:IDavCodecsNamespace = {};

export const registerCodec = ({ tagname, namespace, codec }:{tagname:string,namespace:string,codec:IDavCodec}) => {
    if (typeof namespace !== 'string') {
        throw new Exception('addCodec: namespace must be a String', Exception.WRONG_TYPE);
    }
    if (typeof tagname !== 'string') {
        throw new Exception('addCodec: tagname must be a String', Exception.WRONG_TYPE);
    }
    if (codecs[namespace] === undefined) {
        codecs[namespace] = {};
    }
    codecs[namespace][tagname] = codec;
};

registerCodec({namespace:'DAV:',tagname:'acl',codec:AclCodec});
registerCodec({namespace:'DAV:',tagname:'checked-out',codec:CheckOutCodec});
registerCodec({namespace:'DAV:',tagname:'creationdate',codec:CreationDateCodec});
registerCodec({namespace:'DAV:',tagname:'getlastmodified',codec:GetLastModifiedCodec});
registerCodec({namespace:'DAV:',tagname:'getcontentlength',codec:IntCodec});
registerCodec({namespace:'DAV:',tagname:'lockdiscovery',codec:LockDiscoveryCodec});
registerCodec({namespace:'DAV:',tagname:'owner',codec:OwnerCodec});
registerCodec({namespace:'DAV:',tagname:'principal-collection-set',codec:PrincipalCollectionCodec});
registerCodec({namespace:'DAV:',tagname:'resourcetype',codec:ResourceTypeCodec});
registerCodec({namespace:'DAV:',tagname:'supported-privilege-set',codec:SupportedPrivilegeSetCodec});
registerCodec({namespace:'DAV:',tagname:'current-user-privilege-set',codec:CurrentUserPrivilegeSetCodec});


export default class Property implements IProperty{

    _xmlvalue?:NodeList=undefined;
    _errors?:Node[]=[];
    namespace:string='';
    tagname:string='';
    status:any=null;
    responsedescription?:string=undefined;

    constructor(xmlNode?:ExtChildNode , status?:any, responsedescription?:string, errors?:Node[]) {
        if ((typeof xmlNode !== 'undefined') && (xmlNode.nodeType === 1)) {
            this.namespace = (xmlNode.namespaceURI as string);
            this.tagname = xmlNode.localName;
            this.xmlvalue = xmlNode.childNodes;
        }

        if (status !== undefined) {
            this.status = status;
        }
        if (responsedescription !== undefined) {
            this.responsedescription = responsedescription;
        }
        if (errors instanceof Array) {
            for (var i = 0; i < errors.length; i++) {
                this.addError(errors[i]);
            }
        }
    };

    set xmlvalue(value){
        if (value === null) {
            this._xmlvalue = undefined;
            return;
        }
        if (!(value instanceof NodeList)) {
            throw new Exception('xmlvalue must be an instance of NodeList', Exception.WRONG_TYPE);
        }
        this._xmlvalue = value;
    };

    get xmlvalue(){
        return this._xmlvalue;
    };

    setValueAndRebuildXml (value:string) {

        // Call codec to automatically create correct 'xmlvalue'
        var xmlDoc = document.implementation.createDocument(this.namespace, this.tagname, null);
        const tagname=this.tagname.indexOf(".")!==-1?this.tagname.split(".")[0]:this.tagname;
        if ((codecs[this.namespace] === undefined) ||
            (codecs[this.namespace][tagname] === undefined) ||
            (codecs[this.namespace][tagname]['toXML'] === undefined)) {
            // No 'toXML' function set, so create a NodeList with just one CDATA node
            if (value !== null) { // If the value is NULL, then we should add anything to the NodeList
                var cdata = xmlDoc.createCDATASection(value);
                xmlDoc.documentElement.appendChild(cdata);
            } 
            this._xmlvalue = xmlDoc.documentElement.childNodes;
        } else {
            const codec=codecs[this.namespace][tagname];
            if (codec.toXML)
                this._xmlvalue = codec.toXML(value, xmlDoc).documentElement.childNodes;
        }
    };

    getParsedValue() {
        // Call codec to automatically create correct 'value'

        if (!this._xmlvalue)
            return  undefined;
        if (this._xmlvalue.length > 0) {
            const tagname=this.tagname.indexOf(".")!==-1?this.tagname.split(".")[0]:this.tagname;
            if ((codecs[this.namespace] === undefined) ||
                (codecs[this.namespace][tagname] === undefined) ||
                (codecs[this.namespace][tagname]['fromXML'] === undefined)) {
                    
                // No 'fromXML' function set, so try to create a text value based on TextNodes and CDATA nodes. If other nodes are present, set 'value' to null
                let parsedValue = '' as (string|undefined);
                for (var i = 0; i < this._xmlvalue.length; i++) {
                    var node = this._xmlvalue.item(i) as Node;
                    if ((node.nodeType === 3) || (node.nodeType === 4)) { // Make sure text and CDATA content is stored
                        parsedValue += node.nodeValue as string;
                    } else { // If even one of the nodes is not text or CDATA, then we don't parse a text value at all
                        parsedValue = undefined;
                        break;
                    }
                }

                return parsedValue;
            } else {
                const res=codecs[this.namespace][tagname]['fromXML'](this._xmlvalue);
                return res.getParsedValue?res.getParsedValue():res;
            }
        }
        return null;
    };

    addError(error:Node) {
        if (!(error instanceof Node)) {
            throw new Exception('Error must be an instance of Node', Exception.WRONG_TYPE);
        }
        (this._errors as Node[]).push(error);
        return this;
    };

    getErrors() {
        return this._errors;
    };

    toString() {
        const value= this.getParsedValue();
        return typeof(value)=="object"?JSON.stringify(value):value;
    };

    static NewProperty(namespace:string,tagname:string,value:any){
        const p=new Property();
        p.namespace=namespace;
        p.tagname=tagname;
        if (value!==undefined)
            p.setValueAndRebuildXml(value);
        return p;
    }
    
};

