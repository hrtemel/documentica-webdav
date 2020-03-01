import Exception from './Exception';
import Property, { IProperty } from './Property';
import { ExtChildNode } from './types';


export type WebdavDepthType="0"|"1"|"infinity";

export type ReponsePart= 'href' | 'status' |'error' |'responsedescription' |'location' | 'propstat';

export interface INamespace{
    [index:string]:IProperty
}

export interface INamespaces{
    [index:string]:INamespace
}


export interface IResponse{
    getProperty:(namespace:string, prop:string)=>IProperty|undefined,
    getPropertyNames:(namespace:string)=>string[]
    href:string|null
}

export default class Response implements IResponse{

    _namespaces:INamespaces={};
    
    href:string |null=null;
    status:string |null=null;
    error:string |null=null;
    responsedescription:string |null=null;
    location:string |null =null;
    propstat?:any=null;
    
    constructor (xmlNode?:ExtChildNode) {
        // Constructor logic
        if (typeof xmlNode !== 'undefined') {
            if ((xmlNode.namespaceURI !== 'DAV:') || xmlNode.localName !== 'response') {
                throw new Exception('Node is not of type DAV:response', Exception.WRONG_XML);
            }
            var data = xmlNode.childNodes;
            for (var i = 0; i < data.length; i++) {
                var child = data.item(i) as ExtChildNode;
                if ((child.namespaceURI === null) || (child.namespaceURI !== 'DAV:')) { // Skip if not from the right namespace
                    continue;
                }
                switch (child.localName) {
                    case 'href':
                    case 'status':
                    case 'error':
                    case 'responsedescription':
                        // always CDATA, so just take the text
                        this[child.localName as ReponsePart] = child.childNodes.item(0).nodeValue;
                        break;
                    case 'location':
                        this.location = child.childNodes.item(0).childNodes.item(0).nodeValue;
                        break;
                    case 'propstat': // propstat node should be parsed further
                        var propstatChilds = child.childNodes;
                        // First find status, error, responsedescription and props (as Node objects, not yet as Property objects)
                        var status:number|null = null;
                        var errors = [];
                        var responsedescription = null;
                        var props = [];
                        for (var j = 0; j < propstatChilds.length; j++) { // Parse the child nodes of the propstat element
                            var propstatChild = propstatChilds.item(j) as ExtChildNode;
                            if ((propstatChild.nodeType !== 1) || (propstatChild.namespaceURI !== 'DAV:')) {
                                continue;
                            }
                            switch (propstatChild.localName) {
                                case 'prop':
                                    for (var k = 0; k < propstatChild.childNodes.length; k++) {
                                        props.push(propstatChild.childNodes.item(k));
                                    }
                                    break;
                                case 'error':
                                    for (k = 0; k < propstatChild.childNodes.length; k++) {
                                        errors.push(propstatChild.childNodes.item(k));
                                    }
                                    break;
                                case 'status': // always CDATA, so just take the text
                                    let status2 = propstatChild.childNodes.item(0).nodeValue as string;
                                    status = parseInt(status2.substr(status2.indexOf(' ') + 1, 3));
                                    break;
                                case 'responsedescription': // always CDATA, so just take the text
                                    responsedescription = propstatChild.childNodes.item(0).nodeValue;
                                    break;
                            }
                        }

                        // Then create and add a new property for each element found in DAV:prop
                        for (j = 0; j < props.length; j++) {
                            if (props[j].nodeType === 1) {
                                var property = new Property(props[j] as ExtChildNode, status, responsedescription || undefined, errors);
                                this.addProperty(property);
                            }
                        }
                        break;
                }
            }
        }
    };

    addProperty(property:Property) {
        if (!(property instanceof Property)) {
            throw new Exception('Response property should be instance of Property', Exception.WRONG_TYPE);
        }
        var { namespace } = property;
        if (typeof namespace !== 'string') {
            namespace = '';
        }
        if (this._namespaces[namespace] === undefined) {
            this._namespaces[namespace] = {};
        }

        this._namespaces[namespace][property.tagname] = property;
        return this;
    };

    getProperty(namespace:string, prop:string) {
        if ((this._namespaces[namespace] === undefined) || (this._namespaces[namespace][prop] === undefined)) {
            return undefined;
        }
        return this._namespaces[namespace][prop];
    };

    getNamespaceNames () {
        return Object.keys(this._namespaces);
    };

    getPropertyNames (namespace:string) {
        if (this._namespaces[namespace] === undefined) {
            return new Array();
        }
        return Object.keys(this._namespaces[namespace]);
    };

};

