
import {createWebdavRequest} from "../createWebdavRequest";
import { DavPutParams } from "./put";

export default function put(options:DavPutParams) {
    createWebdavRequest({
        method:'PATCH',
        ...options
    });
}
