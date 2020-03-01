import Exception from './Exception';
import Response, { IResponse } from './Response';
import { ExtNode, ExtChildNode } from './types';

export interface IResponses{
    [index:string]:IResponse
}
export interface IMultiStatus{
    getResponse:(name:string) => IResponse,
    getResponseNames:()=>string[]
}


export default class Multistatus implements IMultiStatus{

    _responses:IResponses={};
    responsedescription:string|null=null;
    value=null;

        constructor(xmlNode:ExtNode) {

        // Constructor logic
        if (typeof xmlNode !== 'undefined') {
            if ((xmlNode.namespaceURI !== 'DAV:') || (xmlNode.localName !== 'multistatus')) {
                throw new Exception('Node is not of type DAV:multistatus', Exception.WRONG_XML);
            }
            var data = xmlNode.childNodes;
            for (var i = 0; i < data.length; i++) {
                var child = data.item(i) as ExtChildNode; 
                if ((child.namespaceURI === null) || (child.namespaceURI !== 'DAV:')) { // Skip if not from the right namespace
                    continue;
                }
                switch (child.localName) {
                    case 'responsedescription': // responsedescription is always CDATA, so just take the text
                        this.responsedescription = child.childNodes.item(0).nodeValue;
                        break;
                    case 'response': // response node should be parsed further
                        var response = new Response(child);
                        var responseChilds = child.childNodes;
                        var hrefs = [];
                        for (var j = 0; j < responseChilds.length; j++) {
                            var responseChild = responseChilds.item(j) as ExtChildNode;
                            if ((responseChild.localName === 'href') && (responseChild.namespaceURI !== null) && (responseChild.namespaceURI === 'DAV:')) { // For each HREF element we create a separate response object
                                hrefs.push(responseChild.childNodes.item(0).nodeValue);
                            }
                        }
                        if (hrefs.length > 1) { // Multiple HREFs = start copying the response (this makes sure it is not parsed over and over again). No deep copying needed; there can't be a propstat
                            for (var k = 0; k < hrefs.length; k++) {
                                var copyResponse = new Response();
                                copyResponse.href = hrefs[k];
                                copyResponse.status = response.status;
                                copyResponse.error = response.error;
                                copyResponse.responsedescription = response.responsedescription;
                                copyResponse.location = response.location;
                                this.addResponse(copyResponse);
                            }
                        } else {
                            this.addResponse(response);
                        }
                        break;
                }
            }
        }
    };

    addResponse(response:Response) {
        // x.y.z
        if (!(response instanceof Response)) {
            throw new Exception('Response should be instance of Response', Exception.WRONG_TYPE);
        }
        var name = response.href as string;
        this._responses[name] = response;
        return this;
    };

    getResponse = (name:string) => this._responses[name];

    getResponseNames = () =>Object.keys(this._responses);

}