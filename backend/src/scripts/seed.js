import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { Analysis } from '../models/Analysis.js';

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB for seeding...');
    await mongoose.connect(env.mongoUri);
    console.log('Connected to MongoDB.');

    await User.deleteMany({});
    await Analysis.deleteMany({});
    console.log('Cleared existing users and analyses.');

    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@veritas.ai',
      password: 'password123',
      role: 'admin',
    });

    const user = await User.create({
      name: 'Veritas Analyst',
      email: 'analyst@veritas.ai',
      password: 'password123',
      role: 'user',
    });

    console.log(`Created users: Admin (${admin.email}), Analyst (${user.email})`);

    const sampleAnalyses = [
      {
        user: user._id,
        inputType: 'text',
        sourceText: 'BREAKING: Scientists discover miracle drink that reverses aging in 24 hours! 100% secret exposed.',
        verdict: 'fake',
        confidence: 0.92,
        labels: [
          { label: 'LABEL_FAKE', score: 0.92 },
          { label: 'LABEL_REAL', score: 0.08 },
        ],
        explanation: 'Model detected indicators of fabricated or misleading material (signal: LABEL_FAKE).',
      },
      {
        user: user._id,
        inputType: 'url',
        sourceUrl: 'https://www.reuters.com/world/',
        sourceText: 'Global central banks announce coordinated interest rate adjustments following quarterly economic reviews.',
        verdict: 'real',
        confidence: 0.88,
        labels: [
          { label: 'LABEL_REAL', score: 0.88 },
          { label: 'LABEL_FAKE', score: 0.12 },
        ],
        explanation: 'Scraped and analyzed extracted article body from URL. Model signal: LABEL_REAL.',
      },
      {
        user: user._id,
        inputType: 'image',
        imageUrl: 'social_media_screenshot.png',
        extractedText: 'URGENT: Government banning all cash transactions starting midnight. Share before deleted!',
        sourceText: 'URGENT: Government banning all cash transactions starting midnight. Share before deleted!',
        verdict: 'fake',
        confidence: 0.94,
        labels: [
          { label: 'LABEL_FAKE', score: 0.94 },
          { label: 'LABEL_REAL', score: 0.06 },
        ],
        explanation: 'OCR extracted text and analyzed content. Model signal: LABEL_FAKE.',
      },
    ];

    await Analysis.insertMany(sampleAnalyses);
    console.log(`Seeded ${sampleAnalyses.length} sample analysis records.`);

    console.log('Database seeding complete successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
