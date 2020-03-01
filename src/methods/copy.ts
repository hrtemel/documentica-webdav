import {createWebdavRequest} from "../createWebdavRequest";
import { DavMoveParams } from "./move";

/*  if (overwriteMode === WEBDAV_FAIL_ON_OVERWRITE) {
    ajax.setRequestHeader('Overwrite', 'F');
} else if (overwriteMode === WEBDAV_TRUNCATE_ON_OVERWRITE) {
    ajax.setRequestHeader('Overwrite', 'T');
}*/
export default function copy({
    config,
    path,
    success,
    fail,
    headers,
    destination
}:DavMoveParams) {
    createWebdavRequest({
        config,
        method:'COPY',
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