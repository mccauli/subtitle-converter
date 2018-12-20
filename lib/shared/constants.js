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

const PARAM_SCHEMA = Joi.object().keys({
  file: Joi.string().required(),
  outputFileName: Joi.string().required(),
  options: Joi.object().keys({
    shift: Joi.number().allow(null),
    source_fps: Joi.alternatives().when('shift', { is: Joi.number(), then: Joi.forbidden(), otherwise: Joi.number().allow(null) }),
    output_fps: Joi.alternatives().when('source_fps', { is: Joi.number(), then: Joi.number().required(), otherwise: Joi.forbidden() }),
    removeTextFormatting: Joi.boolean().allow(null),
  }),
});

module.exports = {
  JSON_SCHEMA,
  PARAM_SCHEMA,
};
