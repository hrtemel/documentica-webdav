import {createWebdavRequest} from "../createWebdavRequest";
import { DavHeadParams } from "./head";

export default function options(options:DavHeadParams) {
    createWebdavRequest({
        method:'OPTIONS',
        ...options
    });
}
