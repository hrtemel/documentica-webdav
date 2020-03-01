import { createWebdavRequest } from "../createWebdavRequest";
import { DavSimpleMethodParams } from "../types";

export interface DavMoveParams extends DavSimpleMethodParams{
    destination:string
}

/*  if (overwriteMode === WEBDAV_FAIL_ON_OVERWRITE) {
    ajax.setRequestHeader('Overwrite', 'F');
} else if (overwriteMode === WEBDAV_TRUNCATE_ON_OVERWRITE) {
    ajax.setRequestHeader('Overwrite', 'T');
}*/
export default function move({
    config,
    path,
    success,
    fail,
    headers,
    destination
}:DavMoveParams) {
    createWebdavRequest({
        config,
        method:'MOVE',
        path,
        success: (status:number,body:string)=>success(path),
        fail,
        headers:{
            ...headers,
            'Destination': encodeURI(destination),
            Overwrite:'F'
        }
    });
};