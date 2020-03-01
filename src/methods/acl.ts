
import {createWebdavRequest} from "../createWebdavRequest";
import { WebdavMethodParams } from "../types";
import { IAce } from "../codecs/AceCodec";

export interface DavAclParams extends WebdavMethodParams{
    aces:IAce[],
    success:(path:string)=>void,
}

//invert not supported
export default function acl({
    config,
    path, 
    aces, 
    success, 
    fail,
    headers
}:DavAclParams) {
    createWebdavRequest({
        config,
        method:'ACL',
        path,
        success:function (status:number,body:string){
            success(path);
        },
        fail,
        headers,
        multistatus:true,
        responseType:'xml',
        body:`<?xml version="1.0" encoding="UTF-8"?>
        <d:acl xmlns:d="DAV:">
            ${aces.map(ace=>`<d:ace>
                <d:principal>
                    <d:href>${ace.principal}</d:href>
                </d:principal>
                <d:${ace.grantdeny ||"grant"}>
                    ${ace.privileges.map( priv =>"<d:privilege><d:"+priv+"></d:"+priv+"></d:privilege>").join("/n")}
                </d:${ace.grantdeny ||"grant"}>
                ${ace.password?"<d:password>"+ace!.password+"</d:password>":""}
                ${ace.expirationDate?"<d:expirationDate>"+ace!.expirationDate+"</d:expirationDate>":""}
                ${ace.invitationList?"<d:invitationList>"+ace!.invitationList.map(i=>"<d:email>"+i+"</d:email>").join("\n")+"</d:invitationList>":""}
           </d:ace>`).join("\n")}
       </d:acl>`
    });
  
}
