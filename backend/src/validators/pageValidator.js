import { body, validationResult } from 'express-validator';
import { errorResponse } from '../utils/responseHandler.js';

// ── Block type definitions with required fields ───────────────────────────────
const VALID_BLOCK_TYPES = [
  'heading',
  'paragraph',
  'list',
  'nestedList',
  'table',
  'equation',
  'image',
  'quote',
  'code',
  'divider',
];

/**
 * Per-type required field rules.
 * If a block type is present, ensure its `data` object contains at least
 * the listed field(s) — prevents empty/malformed block submissions.
 */
const BLOCK_DATA_REQUIREMENTS = {
  heading:    ['text'],
  paragraph:  ['text'],
  list:       ['items'],
  nestedList: ['items'],
  table:      ['headers', 'rows'],
  equation:   ['expression'],
  image:      ['url'],
  quote:      ['text'],
  code:       ['code'],
  divider:    [],   // no data fields required
};

export const validatePage = [
  // ── Top-level fields ─────────────────────────────────────
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Page title is required'),

  body('slug')
    .trim()
    .notEmpty()
    .withMessage('Slug is required')
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage('Slug must contain only lowercase alphanumeric characters and hyphens'),

  // ── Block array structural validation ────────────────────
  body('blocks')
    .isArray()
    .withMessage('Blocks must be an array'),

  body('blocks.*.id')
    .notEmpty()
    .withMessage('Each block must have a unique id'),

  body('blocks.*.type')
    .isIn(VALID_BLOCK_TYPES)
    .withMessage(`Invalid block type. Must be one of: ${VALID_BLOCK_TYPES.join(', ')}`),

  body('blocks.*.data')
    .optional()
    .isObject()
    .withMessage('Block data must be a plain object'),

  // ── Custom: validate per-type required data fields ────────
  body('blocks').custom((blocks) => {
    if (!Array.isArray(blocks)) return true; // caught by isArray above

    for (const block of blocks) {
      const requiredFields = BLOCK_DATA_REQUIREMENTS[block.type];
      if (!requiredFields) continue; // unknown type — type validator handles it

      for (const field of requiredFields) {
        const value = block.data?.[field];
        const isMissing =
          value === undefined ||
          value === null ||
          (typeof value === 'string' && value.trim() === '') ||
          (Array.isArray(value) && value.length === 0);

        if (isMissing) {
          throw new Error(
            `Block of type "${block.type}" is missing required data field: "${field}"`
          );
        }
      }
    }
    return true;
  }),

  // ── Error collector middleware ────────────────────────────
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(
        res,
        400,
        'Validation failed',
        errors.array().map((err) => err.msg)
      );
    }
    next();
  },
];
