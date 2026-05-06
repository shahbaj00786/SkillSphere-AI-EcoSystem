import mongoose from 'mongoose';
import connectDB from './config/db.js';

const test = async () => {
  await connectDB();

  const TestModel = mongoose.model('Test', new mongoose.Schema({ message: String }));
  await TestModel.create({ message: 'SkillSphere DB is working!' });

  console.log('✅ Test data inserted successfully!');
  process.exit(0);
};

test();