
import { createWebdavRequest } from "../createWebdavRequest";
import { WebdavMethodParams } from "../types";
import { ILockDiscovery } from "./lock";

export interface DavUnlockParams extends WebdavMethodParams{
    lockdiscovery:ILockDiscovery,
    success:(path:string)=>void
}

export default function ({
    path,
    headers,
    lockdiscovery,
    success,
    ...rest
}:DavUnlockParams) {
    createWebdavRequest({
        method:'UNLOCK',
        path,
        success: (status:number,body:string)=>success(path),
        headers:{
            ...headers,
            'Lock-Token':lockdiscovery.locktoken
        },
        ...rest
    });
};
