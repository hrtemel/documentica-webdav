import { IDavConfig } from "./createWebdavRequest";
import { IProperty } from "./Property";

export interface ExtNode extends Node{
	localName:string
}

export interface ExtChildNode extends ChildNode{
	localName:string
}

export interface IDavSupportedPrivilege{
	privilege?:any,
	description?:string |null,
	supportedPrivilege:any[],
	abstract?:boolean
}

export type IDavCodec={
    fromXML:(nodelist:NodeList)=>any,
    toXML?:(value:any, xmlDoc:XMLDocument)=>XMLDocument
}

export type IDavCodecs={
    [index: string]:IDavCodec;
}

export type IDavCodecsNamespace={
    [index: string]:IDavCodecs;
}

export type WebdavMethodParams={
    config:IDavConfig,
    path:string,
    fail:(stat:number,statusText?:string)=>void,
    headers?:IHeaders
}

export interface DavSimpleMethodParams extends WebdavMethodParams{
    success:(path:string)=>void
}

export interface IHeaders{
	[index:string]:string
}

export interface IPropFindResponse{
    name: string;
    href: string;
    props: {
        [index:string]:any
    };
}
