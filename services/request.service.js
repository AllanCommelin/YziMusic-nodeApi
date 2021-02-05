/* Service definition */
const checkFields = (required, bodyData, optional = false) => {
    /* Variables */
    const miss = [];
    const extra = [];

    // Check missing fields if it's not optional
    if (!optional) {
        required.forEach((prop) => {
            if (!(prop in bodyData)) miss.push(prop);
        });
    }

    // Check extra fields
    for (const prop in bodyData) {
        if (required.indexOf(prop) === -1) extra.push(prop);
    }

    // Set service state
    const ok = (extra.length === 0 && miss.length === 0);

    // Return service state
    return { ok, extra, miss };
};

module.exports = {
    checkFields
};