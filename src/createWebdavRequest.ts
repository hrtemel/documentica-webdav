import Multistatus from './Multistatus';
import { ExtChildNode, IHeaders } from './types';
// @ts-ignore
import {DOMParser } from 'xmldom';

export type WebdavCallback=(status:number,body:any,statusText?:string,resourceName?:string,headers?:Headers)=>void;

export type WebdavRequestType={
    config:IDavConfig,
    method:string,
    path:string,
    headers?:IHeaders,
    success:WebdavCallback,
    fail?:WebdavCallback,
    body?:any,
    resourceName?:string,
    responseType?:'blob'|'text'|'xml'|'json',
    multistatus?:boolean,
    progressListener?:(evt:ProgressEvent<XMLHttpRequestEventTarget>)=>void
    loadListener?:(evt:ProgressEvent<XMLHttpRequestEventTarget>)=>void   
}

export interface IDavConfig{
    host:string,
    defaultHeaders?:IHeaders,
    withCredentials?:boolean,
    defaultFail?:WebdavCallback,
    authenticationMethod?:"digest"|"basic",
    username?:string,
    password?:string,
    realm?:string,
    supportedFeatures:{
        currentUser?:boolean,
        acl?:boolean,
        modifyRootFolder?:boolean,
        ignoreDotFiles?:boolean
    }
}

export function createWebdavRequest(req:WebdavRequestType){
    if (req.progressListener && req.config.host=="/")
        return createWebdavRequestXHR(req);
    else
        return createWebdavRequestFetch(req);
}
export function createWebdavRequestFetch({
    config:{
        defaultHeaders,
        host,
        withCredentials,
        defaultFail,
        authenticationMethod,
        username,
        password,
        realm,
    },
    method,
    path,
    headers,
    success,
    fail,
    body,
    resourceName,
    responseType,
    multistatus,
    progressListener
}:WebdavRequestType){
    if (path.substring(0, 1) !== '/') {
        path = '/' + path;
    }
    const url =host ?  host + path : path;
    const fileName=url.split("/").filter(i=>i).pop();
    const authHeader=(authenticationMethod=="basic"?{"Authorization":"Basic "+btoa(username+":"+password)}:{}) as IHeaders;
    fetch(url,{
        method,
        headers:{...defaultHeaders,...headers,...authHeader},
        credentials:'include',
        cache:"no-cache",
        body
    })
    .then(response =>{
        if (response.status<200 || response.status>=300) {
            if (fail)
                fail(response.status, body, response.statusText,resourceName||fileName);
            else if(defaultFail)
                defaultFail(response.status, body, response.statusText,resourceName||fileName);
            else
                throw "No fail handler found "+response.status;
        }else{
            new Promise((resolve,reject)=>{
                switch (responseType){
                    case 'blob':
                        resolve(response.blob());
                        break;
                    case 'json':
                        resolve(response.json());
                        break;
                    case 'xml':
                    default:    
                    return resolve(response.text());
                }
            })
            .catch(e => console.log(e,url))
            .then(resp =>{
                (window as any).resp=response;
                if (responseType=="xml"){
                    let xml=new DOMParser().parseFromString(resp as any, "text/xml");
                    if (multistatus){
                        let body=undefined;
                        for (var counter = 0; counter < xml.childNodes.length; counter++) {
                            if ((xml.childNodes.item(counter) as ExtChildNode).localName === 'multistatus') {
                                body = new Multistatus(xml.childNodes.item(counter) as ExtChildNode);
                                break;
                            }
                        }
                        success(response.status, body, response.statusText,resourceName||fileName,response.headers);
                    }else
                        success(response.status, xml, response.statusText,resourceName||fileName,response.headers);
                }else{
                    success(response.status, resp, response.statusText,resourceName||fileName,response.headers);
                }
            })
        }
    }).catch(e =>{
        if (fail)
            fail(0,"unable to connect","unable to connect");
        else if(defaultFail)
            defaultFail(0,"unable to connect "+path+" with method "+method,"unable to connect");
        else
            throw "No fail handler found "+path+" "+method;
    });
};


export function createWebdavRequestXHR({
    config:{
        defaultHeaders,
        host,
        withCredentials,
        defaultFail,
        authenticationMethod,
        username,
        password,
        realm,
    },
    method,
    path,
    headers,
    success,
    fail,
    body,
    resourceName,
    responseType,
    multistatus,
    progressListener
}:WebdavRequestType){
    if (path.substring(0, 1) !== '/') {
        path = '/' + path;
    }
    const url =host ?  host + path : path;
    const fileName=url.split("/").filter(i=>i).pop();
    var ajax:XMLHttpRequest =new XMLHttpRequest();
    ajax.open(method, url, true);
    ajax.withCredentials=true;
    if (multistatus)
        responseType="xml";
    switch (responseType){
    case "blob":
        ajax.responseType="blob";
        break;
    case "json":
        ajax.overrideMimeType("application/json");
        break;
    }
    if (progressListener)
        ajax.upload.addEventListener("progress",progressListener);
    ajax.onreadystatechange = function () {
        if (ajax.readyState === 4) { //if request has completed
            if (ajax.status<200 || ajax.status>=300) {
                if (fail)
                    fail(ajax.status, body, ajax.statusText,resourceName||fileName);
                else if(defaultFail)
                    defaultFail(ajax.status, body, ajax.statusText,resourceName||fileName);
                else
                    throw "No fail handler found "+ajax.status;
            }else{
                switch (responseType){
                case 'blob':
                    success(ajax.status, ajax.response, ajax.statusText,resourceName||fileName);
                    break;
                case 'json':
                    success(ajax.status, JSON.parse(ajax.responseText), ajax.statusText,resourceName||fileName);
                    break;
                case 'xml':
                    if (multistatus){
                        let body=undefined;
                        for (var counter = 0; counter < ajax.responseXML!.childNodes.length; counter++) {
                            if ((ajax.responseXML!.childNodes.item(counter) as ExtChildNode).localName === 'multistatus') {
                                body = new Multistatus(ajax.responseXML!.childNodes.item(counter) as ExtChildNode);
                                break;
                            }
                        }
                        success(ajax.status, body, ajax.statusText,resourceName||fileName);
                    }else
                        success(ajax.status, ajax.responseXML, ajax.statusText,resourceName||fileName);
                    break;
                default:    
                    success(ajax.status, ajax.responseText, ajax.statusText,resourceName||fileName);
                }
            }
        }
    };

    if (defaultHeaders)
        Object.keys(defaultHeaders).forEach(header => ajax.setRequestHeader(header, defaultHeaders[header]));
    if (headers)
        Object.keys(headers).forEach(header => ajax.setRequestHeader(header, headers[header]));
    if (authenticationMethod=="basic")
        ajax.setRequestHeader("Authorization", "Basic "+btoa(username+":"+password));
    ajax.withCredentials = withCredentials||false;
    ajax.send(body);
    return ajax;
};
