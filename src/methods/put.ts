import {createWebdavRequest, WebdavCallback} from "../createWebdavRequest";
import { WebdavMethodParams } from "../types";

export interface DavPutParams extends WebdavMethodParams{
    body:any
    success:WebdavCallback
}
export default function put(options:DavPutParams) {
    createWebdavRequest({
        method:'PUT',
        ...options
    });
}
