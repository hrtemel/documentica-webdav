import Multistatus from "../Multistatus";
import {createWebdavRequest} from "../createWebdavRequest";
import { multiStatusToPropfindResponse } from "../utils";
import { WebdavMethodParams, IPropFindResponse } from "../types";
import { IProperty } from "../Property";
import { WebdavDepthType } from "../Response";

export interface PropFindParams extends WebdavMethodParams{
    properties:string[],
    depth:WebdavDepthType,
    success:(items:IPropFindResponse[],root?:IPropFindResponse)=>void,
    include?:IProperty[]
}


export default function propFind({
    config,
    path,
    properties,
    depth,
    success,
    fail, 
    headers,
    include
}:PropFindParams) {
    const props=properties||["allprop"] ;
    var propsBody=`<?xml version="1.0" encoding="UTF-8"?>
        <d:propfind xmlns:d="DAV:">
            ${props[0]=="allprop"?"<d:allprop/>":
              props[0]=="propname"?"<d:propname/>":`
                <d:prop>
                    ${props.map(i=> "<d:"+i+"/>").join("\n")}
                </d:prop>`}
            ${props[0]=="allprop" && include?`
                <d:include>
                    ${include.map(i=> "<d:"+i+"/>").join("\n")}
                </d:include>
            `:""}
        </d:propfind>
    `;
     
    createWebdavRequest({
        config,
        method:'PROPFIND',
        path,
        multistatus:true,
        responseType:'xml',
        success:function (status:number,body:Multistatus){
            const items = multiStatusToPropfindResponse(body,config)
            if (depth!="0"){
                let [root,...rest]=items;
                success(rest,root)
            }else{
                success(items);
            }
        },
        fail,
        headers:{
            Depth: depth||"0",
            ...headers
        },
        body:propsBody
    });
}
