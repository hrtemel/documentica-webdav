import { WebdavMethodParams, IPropFindResponse } from "../types";
import Multistatus from '../Multistatus';
import {createWebdavRequest} from "../createWebdavRequest";
import { multiStatusToPropfindResponse } from "../utils";
import isEqual from 'lodash.isequal';
import Property, { IProperty } from '../Property';

export interface DavPropPatchParams extends WebdavMethodParams{
    value:IPropFindResponse,
    initial:IPropFindResponse
    success:(items:IPropFindResponse[])=>void,
}


export default function search({
    config,
    path, 
    value,
    initial, 
    success, 
    fail,
    headers
}:DavPropPatchParams) {
    let updateProps:IProperty[]=Object.keys(value.props as any).filter(i => (initial.props[i]==undefined)|| !isEqual (value.props[i], initial.props[i])).map(i=>Property.NewProperty("DAV:",i,value.props[i]));
    let delProps:IProperty[]=Object.keys(initial.props).filter(i => value.props[i]==undefined).map(i=>Property.NewProperty("DAV:",i,value.props[i]));
    createWebdavRequest({
        config,
        method:'PROPPATCH',
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
        <propertyupdate xmlns="DAV:">
            ${updateProps.length?`<set>
                <prop>
                    ${updateProps.map(prop => prop.xmlvalue? 
                        "<"+prop.tagname+">"+(Array.prototype.slice.call(prop.xmlvalue).map(item =>new XMLSerializer().serializeToString(item)).join("\n"))+"</"+prop.tagname+">":undefined).filter(i=>i).join("\n")}
                </prop>
            </set>`
            :""}
            ${delProps.length?`<remove>
                <prop>
                ${delProps.map(prop => "<"+prop.tagname+"/>").join("\n")}
                </prop>
            </remove>`
            :""}
       </propertyupdate>`
    }); 
}