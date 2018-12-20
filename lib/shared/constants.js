const Joi = require('joi');

const JSON_SCHEMA = Joi.object().keys({
  global: Joi.object().keys({
    language: Joi.string(),
    color: Joi.string(),
    text_align: Joi.string(),
  }),
  body: Joi.array().items(Joi.object().keys({
    id: Joi.string(),
    start_micro: Joi.number().unit('microseconds'),
    end_micro: Joi.number().unit('microseconds'),
    captions: {
      frames: Joi.number().integer(),
      pop_on: Joi.boolean(),
      paint_on: Joi.boolean(),
      roll_up_rows: Joi.number().integer(),
      commands: Joi.string(),
    },
    styles: Joi.object().keys({
      align: Joi.string(),
      line: Joi.string(),
      position: Joi.string(),
      size: Joi.string(),
    }),
    text: Joi.string(),
  })),
  source: Joi.any(),
});

module.exports = {
  JSON_SCHEMA,
};
