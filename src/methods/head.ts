
import {createWebdavRequest, WebdavCallback} from "../createWebdavRequest";
import { WebdavMethodParams } from "../types";

export interface DavHeadParams extends WebdavMethodParams{
    success:WebdavCallback
}

export default function head(options:DavHeadParams) {
    createWebdavRequest({
        method:'HEAD',
        ...options
    });
}
