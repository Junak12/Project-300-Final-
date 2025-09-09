import Test from '../models/Test.js';

export const getTests = async (req, res) => {
  try {
    const tests = await Test.find({});
    res.json({ success: true, tests });
  } catch (error) {
    console.error('Error fetching tests:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch tests' });
  }
};
