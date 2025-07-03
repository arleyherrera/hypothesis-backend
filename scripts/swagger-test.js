// scripts/swagger-test.js
const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:5000/api';
let authToken = '';

const testEndpoints = async () => {
  console.log('🧪 Testing API Endpoints...\n');

  try {
    // 1. Register
    console.log('1️⃣ Testing Registration...');
    const registerData = {
      name: `Test User ${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      password: 'TestPass123!'
    };
    
    const registerRes = await axios.post(`${API_URL}/auth/register`, registerData);
    authToken = registerRes.data.token;
    console.log('✅ Registration successful');
    console.log(`   Token: ${authToken.substring(0, 20)}...`);

    // 2. Login
    console.log('\n2️⃣ Testing Login...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: registerData.email,
      password: registerData.password
    });
    console.log('✅ Login successful');

    // 3. Get Me
    console.log('\n3️⃣ Testing Get Me...');
    const meRes = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Get Me successful');
    console.log(`   User: ${meRes.data.name}`);

    // 4. Create Hypothesis
    console.log('\n4️⃣ Testing Create Hypothesis...');
    const hypothesisData = {
      problem: "Los emprendedores pierden mucho tiempo validando ideas que no funcionan eficientemente",
      name: "Test Hypothesis",
      solution: "Plataforma de validación rápida",
      customerSegment: "Emprendedores tech",
      valueProposition: "Valida en días, no meses"
    };
    
    const hypRes = await axios.post(`${API_URL}/hypotheses`, hypothesisData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const hypothesisId = hypRes.data.id;
    console.log('✅ Hypothesis created');
    console.log(`   ID: ${hypothesisId}`);

    // 5. Generate Artifacts
    console.log('\n5️⃣ Testing Generate Artifacts...');
    const artifactsRes = await axios.post(
      `${API_URL}/artifacts/${hypothesisId}/generate/construir`,
      {},
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    console.log('✅ Artifacts generated');
    console.log(`   Count: ${artifactsRes.data.artifacts.length}`);

    // 6. Get Context Stats
    console.log('\n6️⃣ Testing Context Stats...');
    const statsRes = await axios.get(
      `${API_URL}/artifacts/${hypothesisId}/context-stats`,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    console.log('✅ Context stats retrieved');
    console.log(`   Total contexts: ${statsRes.data.contextStats.totalContexts}`);

    console.log('\n✅ All tests passed!');

  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
  }
};

testEndpoints();