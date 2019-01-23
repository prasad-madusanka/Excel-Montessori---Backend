module.exports = {

    //Configurations
    PORT: process.env.process || 3000,
    DB_URL: 'mongodb://localhost:27017/Excel',


    //Response messages
    TAG_REQ_BODY_INVALID: 'Request body format invalid',
    TAG_INVALID_FORMAT: 'Request format invalid',
    TAG_USER_NOT_FOUND: 'User not found',
    TAG_ACTION_FAILED: 'Action failed',
    TAG_SUCCESS: 'Success',
    TAG_RECORD_NOT_FOUND: 'Not found any matching record',
    TAG_SEARCH_DATA_INVALID: 'Search data invalid',
    TAG_USER_EXIST: 'User already exist',
    TAG_NO_RECORDS_FOUND: 'No records found',
    TAG_NOT_MODIFIED: 'No records found',


    //HTTP response codes
    OK: 200,
    NOT_MODIFIED: 304,
    BAD_REQUEST: 400,
    UNAUTHORIZE: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    NOT_ACCEPTABLE: 406,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,

    REPORT_STATUS_ADMISSION: ['NOT PAID', 'PAID', 'OVER PAID'],


    //Reusable methods
    sendResponse: (res, responseCode, responseMessage) => {
        res.status(responseCode).send(responseMessage)
    },

    requestBodyFormatInvalid: (res) => {
        res.status(406).send({
            error: 'Request body format invalid'
        })
    },

    requestFormatInvalid: (res) => {
        res.status(400).send({
            error: 'Request format invalid'
        })
    },

    isEmpty: (vArray) => {

        return (vArray instanceof Array && vArray.length == 0) ? true : false

    },

    isValidObject: (vObject, vKey, vValue) => {
        return (vObject instanceof Object && vObject[vKey] == vValue) ? true : false
    }

}