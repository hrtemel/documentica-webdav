import {createWebdavRequest} from "../createWebdavRequest";
import { WebdavMethodParams } from "../types";
import { WebdavDepthType } from "../Response";
// @ts-ignore
import {DOMParser } from 'xmldom';

export interface ILockDiscovery{
    locktype:string,
    locksope:string,
    depth:WebdavDepthType,
    owner:string
    locktoken:string
}

export interface DavLockParams extends WebdavMethodParams{
    lockdiscovery:ILockDiscovery,
    success:(token:string)=>void
}
export default function lock({
    config,
    path,
    headers,
    lockdiscovery,
    fail,
    success
}:DavLockParams) {
    createWebdavRequest({
        config,
        method:'LOCK',
        path,
        success:function (status:number,resp:string){
            const xdoc=new DOMParser().parseFromString(resp, "text/xml") ;
            success(xdoc.getElementsByTagName("D:locktoken")[0]!.textContent!.trim());
        },
        fail,
        headers,
        body:`<?xml version="1.0" encoding="UTF-8"?>
         <d:lockinfo xmlns:d="DAV:">
            <d:locktype>
                <d:write/>
            </d:locktype>
            <d:lockscope>
                <d:exclusive/>
            </d:lockscope>
            <d:owner>
                <d:href>${lockdiscovery.owner}</d:href>
            </d:owner>
       </d:lockinfo>`
    });
};