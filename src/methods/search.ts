import { WebdavMethodParams, IPropFindResponse } from "../types";
import Multistatus from '../Multistatus';
import {createWebdavRequest} from "../createWebdavRequest";
import { multiStatusToPropfindResponse } from "../utils";

export interface IDavSearchParam{
    optype: "eq"|"contains"|"lt"|"gt",
    literal:string
}

export interface DavSearchParams extends WebdavMethodParams{
    params:IDavSearchParam,
    success:(items:IPropFindResponse[])=>void,
}

function parseParams(params:IDavSearchParam):string{
    return Object.keys(params).map((field) => {        
        const value:IDavSearchParam = (params as any)[field];
        if (!value.optype || !value.literal) 
            return null;
        if (value.optype=="contains")
            return `<d:${value.optype}>
                <d:literal>${value.literal}</d:literal>
            </d:${value.optype}>`;
        return `<d:${value.optype}>
            <d:prop>
                <d:${field}/>
            </d:prop>
            <d:literal>${value.literal}</d:literal>
        </d:${value.optype}>`;
    }).filter(i=>i).join("\n");
}

export default function search({
    config,
    path, 
    params, 
    success, 
    fail,
    headers
}:DavSearchParams) {
    createWebdavRequest({
        config,
        method:'SEARCH',
        path,
        success:function (status:number,body:Multistatus){
            const items = multiStatusToPropfindResponse(body,config)
            success(items);
        },
        fail,
        headers,
        multistatus:true,
        responseType:'xml',
        body:`<?xml version="1.0" encoding="UTF-8"?>
        <d:searchrequest xmlns:d="DAV:">
            <d:basicsearch>
                <d:select>
                    <d:prop>
                        <d:displayname/>
                        <d:getcontenttype/>
                    </d:prop>
                </d:select>
                <d:from>
                    <d:scope>
                        <d:href>${path}</d:href>
                        <d:depth>infinity</d:depth>
                    </d:scope>
                </d:from>
                <d:where>
                    <d:and>
                    ${parseParams(params)}
                    </d:and>
                </d:where>
                <d:orderby/>
           </d:basicsearch>
       </d:searchrequest>`
    });
  
}
