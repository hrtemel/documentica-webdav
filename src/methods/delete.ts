import {createWebdavRequest} from "../createWebdavRequest";
import { DavSimpleMethodParams } from "../types";

export default function remove({ success,path,...rest }:DavSimpleMethodParams) {
    createWebdavRequest({
        method:'DELETE',
        path,
        success: (status:number,body:string)=>success(path),
        ...rest
    });
};