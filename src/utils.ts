import { IPropFindResponse } from "./types";
import { IDavConfig } from "./createWebdavRequest";
import { IMultiStatus } from "./Multistatus";

const reduceServerUrl=(href:string,config:IDavConfig)=> {
    if (!href.match(/^http[s]*\:\/\//))
        return href;
    const urlHref=new URL(href).pathname;
    const hostHref=config.host.match(/^http[s]*\:\/\//)?new URL(config.host).pathname:config.host;    
    return ("/"+(urlHref.substring(hostHref.length))).replace(/\/\//g,"/");
}

export const multiStatusToPropfindResponse= (body:IMultiStatus,config:IDavConfig) =>  {
    if (!body)
        return  [];
    const result=body.getResponseNames().map(responseName => {
        let response = body.getResponse(responseName);
        return {
            name: reduceServerUrl(response.href as string,config),
            href: reduceServerUrl(response.href as string,config),
            props:response.getPropertyNames("DAV:").reduce((acc,item) => ({...acc,[item]:response.getProperty("DAV:", item)!.getParsedValue()}),{})
        } as IPropFindResponse;
    });
    if (config.supportedFeatures.ignoreDotFiles)
        return result.filter(i=> !i.href.match(/^[\/]*\./));
    return result;
}