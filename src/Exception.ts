export default class Exception{
    
    static WRONG_TYPE = 1;
    static NAMESPWEBDAV_ACE_TAKEN = 2;
    static UNEXISTING_PROPERTY = 3;
    static WRONG_XML = 4;
    static WRONG_VALUE = 5;
    static MISSING_REQUIRED_PARAMETER = 6;
    static AJAX_ERROR = 7;
    static NOT_IMPLEMENTED = 8;
   
    message?:string=undefined;
    code?:string|number=undefined;

    constructor(message?:string, code?:string|number) {
        if (message !== undefined) {
            this.message = message;
        }
        if (code !== undefined) {
            this.code = code;
        }
    }

    toString() {
        return this.message;
    };
}