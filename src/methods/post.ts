import {createWebdavRequest, WebdavCallback} from "../createWebdavRequest";
import { WebdavMethodParams } from "../types";

export interface DavGetPostParams extends WebdavMethodParams{
    params:Object,
    success:WebdavCallback,
    body?:any
    progressListener?:(evt:ProgressEvent<XMLHttpRequestEventTarget>)=>void
    
}

export default function post({params,headers,body,...rest}:DavGetPostParams) {
    createWebdavRequest({
        method:'POST',
        headers: { 
            ...headers,
            'Content-Type': 'application/x-www-form-urlencoded' 
        },
        body:body||Object.keys(params).map(item=> item+"="+encodeURI((params as any)[item])).join("&"),
        ...rest
    });
}
