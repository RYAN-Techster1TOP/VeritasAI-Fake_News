import axios from 'axios';

const runLiveDemo = async () => {
  try {
    console.log('--- VERITAS AI LIVE EXECUTION DEMONSTRATION ---');
    console.log('\n[1/3] Authenticating with Live Backend API...');
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'analyst@veritas.ai',
      password: 'password123',
    });

    const token = loginRes.data.token;
    console.log('  ✔ Authentication Successful!');
    console.log('  ✔ JWT Token:', token.slice(0, 30) + '...');
    console.log('  ✔ User:', loginRes.data.user.name, `(${loginRes.data.user.email})`);

    console.log('\n[2/3] Executing Real-Time AI Text Claim Analysis...');
    const claimText =
      'SHOCKING BREAKING NEWS: Miracle cure discovered by secret group! 100% cure rate guaranteed!';
    const analyzeRes = await axios.post(
      'http://localhost:5000/api/analysis/text',
      { text: claimText },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const result = analyzeRes.data.analysis;
    console.log('  ✔ Analysis Request Completed (HTTP 201)');
    console.log('  ✔ Verdict:', result.verdict.toUpperCase());
    console.log('  ✔ Confidence Rating:', (Number(result.confidence) * 100).toFixed(1) + '%');
    console.log('  ✔ Explanation Signal:', result.explanation);
    console.log('  ✔ Model Labels Breakdown:', JSON.stringify(result.labels));

    console.log('\n[3/3] Retrieving Verification History...');
    const historyRes = await axios.get('http://localhost:5000/api/analysis/history', {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log(`  ✔ Fetched ${historyRes.data.count} saved analysis history records.`);
    console.log('  ✔ Latest Record ID:', historyRes.data.analyses[0]._id);

    console.log('\n==================================================');
    console.log('  ALL LIVE ENDPOINTS RUNNING PERFECTLY IN REAL-TIME!');
    console.log('==================================================\n');
  } catch (err) {
    console.error('❌ Live test failed:', err.response?.data || err.message);
  }
};

runLiveDemo();
