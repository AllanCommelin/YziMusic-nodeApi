/* Service definition */
const sendBodyError = (endpoint, method, response, errorMessage, status = 400) => {
    const apiResponse = {
        endpoint: endpoint,
        method: method,
        message: errorMessage,
        err: null,
        data: null,
        status: status
    }

    return response.status(status).json(apiResponse);
}

const sendFieldsError = (endpoint, method, response, errorMessage, miss, extra, status = 400) => {
    const apiResponse = {
        endpoint: endpoint,
        method: method,
        message: errorMessage,
        err: { miss, extra },
        data: null,
        status: status
    }

    return response.status(status).json(apiResponse);
}

const sendApiSuccessResponse = (endpoint, method, response, successMessage, data, status = 200) => {
    const apiResponse = {
        endpoint: endpoint,
        method: method,
        message: successMessage,
        err: null,
        data: data,
        status: status
    }

    return response.status(status).json(apiResponse);
}

const sendApiErrorResponse = (endpoint, method, response, errorMessage, error, status = 500) => {
    const apiResponse = {
        endpoint: endpoint,
        method: method,
        message: errorMessage,
        err: error,
        data: null,
        status: status
    }

    return response.status(status).json(apiResponse);
}

const sendApiUnauthorizedResponse = (endpoint, method, response, errorMessage, error, status = 401) => {
    const apiResponse = {
        endpoint: endpoint,
        method: method,
        message: errorMessage,
        err: error,
        data: null,
        status: status
    }

    return response.status(status).json(apiResponse);
}
//


/* Export service fonctions */
module.exports = {
    sendBodyError,
    sendFieldsError,
    sendApiSuccessResponse,
    sendApiErrorResponse,
    sendApiUnauthorizedResponse
};
//