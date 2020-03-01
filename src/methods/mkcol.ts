import {createWebdavRequest} from "../createWebdavRequest";
import { DavSimpleMethodParams } from "../types";

export default function mkcol({
    config,
    path,
    success,
    fail,
    headers
}:DavSimpleMethodParams) {
    createWebdavRequest({
        config,
        method:'MKCOL',
        path,
        success: (status:number,body:string)=>success(path),
        fail,
        headers
    });
};
