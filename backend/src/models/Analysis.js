import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    inputType: {
      type: String,
      enum: ['text', 'url', 'image'],
      required: true,
    },
    sourceText: {
      type: String,
      default: '',
    },
    sourceUrl: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    extractedText: {
      type: String,
      default: '',
    },
    verdict: {
      type: String,
      enum: ['real', 'fake', 'uncertain', 'pending'],
      default: 'pending',
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0,
    },
    labels: [
      {
        label: String,
        score: Number,
      },
    ],
    explanation: {
      type: String,
      default: '',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

analysisSchema.index({ user: 1, createdAt: -1 });

export const Analysis = mongoose.model('Analysis', analysisSchema);
