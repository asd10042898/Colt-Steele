const mongoSanitize = require('express-mongo-sanitize');

// deep-clone helper
function deepCopy(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(deepCopy);
    return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, deepCopy(v)])
    );
}

// middleware
module.exports = function sanitizeV5(options = {}) {
    const hasOnSanitize = typeof options.onSanitize === 'function';
    
    return function (req, _res, next) {
    
    // body, params, headers 可以直接覆寫
    ['body', 'params', 'headers'].forEach(key => {
        if (req[key]) {
            const clean = mongoSanitize.sanitize(req[key], options);
            req[key] = clean;
        if (hasOnSanitize && mongoSanitize.has(clean, options.allowDots)) {
            options.onSanitize({req, key});
        }
    }
});

// updating handling of read-only req.query (getter in Express 5)
if (req.query) {
    // req.query 是唯讀的，需要用 deepCopy 複製後再用 Object.defineProperty 替換
    const cleanQuery = mongoSanitize.sanitize(deepCopy(req.query), options);

    // replace the getter with a concrete, sanitized value
    Object.defineProperty(req, 'query', {
        value: cleanQuery,
        writable: false,
        configurable: true,
        enumerable: true
    });

    if (hasOnSanitize && mongoSanitize.has(cleanQuery, options.allowDots)) {
        options.onSanitize({req, key: 'query'});
    }
}
next();
};
};