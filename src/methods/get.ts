import { createWebdavRequest } from "../createWebdavRequest";
import { DavGetPostParams } from "./post";

export default function get({ path, params,...rest}:DavGetPostParams) {
    createWebdavRequest({
        method:'GET',
        path:path+(params?"?"+Object.keys(params).map(item=> item+"="+encodeURI((params as any)[item])).join("&"):""),
        ...rest
    });
}
