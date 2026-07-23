import mongoose from 'mongoose';

const blockSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
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
        'unknown',
      ],
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { _id: false }
);

const pageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Page title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Page slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'published',
    },
    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
      keywords: { type: [String], default: [] },
    },
    blocks: [blockSchema],
  },
  {
    timestamps: true,
  }
);

// Indexes
pageSchema.index({ slug: 1, status: 1 });
pageSchema.index({ status: 1, updatedAt: -1 });
pageSchema.index({ title: 'text', slug: 'text' });

const Page = mongoose.model('Page', pageSchema);
export default Page;
