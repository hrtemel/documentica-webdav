import {  WebdavMethodParams, IPropFindResponse } from "../types";
import {createWebdavRequest} from "../createWebdavRequest";
import { multiStatusToPropfindResponse } from '../utils';
import { IMultiStatus } from "../Multistatus";

export interface DavReportParams extends WebdavMethodParams{
    success:(items:IPropFindResponse[])=>void,
    properties:string[],
}

export default function report({
    config,
    path, 
    success,
    fail,
    headers,
    properties
}:DavReportParams) {
    const props=properties && Array.isArray(properties)?properties:["version-name","creator-displayname","getlastmodified","getcontentlength","successor-set","checked-in","checked-out","comment"];
    createWebdavRequest({
        config,
        method:'REPORT',
        path,
        multistatus:true,
        responseType:'xml',
        success:function (status:number,body:IMultiStatus){
            const items = multiStatusToPropfindResponse(body,config)
            success(items);
        },
        fail,
        headers,
        body:`<?xml version="1.0" encoding="UTF-8"?>
            <d:version-tree xmlns:d="DAV:">
                <d:prop>
                    ${props.map(i => "<d:"+i+"/>").join("\n")}
                </d:prop>
            </d:version-tree>`
    });
}
