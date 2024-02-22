const Joi = require('joi');
module.exports = {
    "create": {
        "title": Joi.string().required(),
        "detail": Joi.string()
    },
    "update": {
        "id": Joi.string().required(),
        "title": Joi.string().required(),
        "detail": Joi.string(),
        "isDone": Joi.number().min(0).max(1)
    }
}