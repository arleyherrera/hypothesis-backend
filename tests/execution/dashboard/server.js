const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = 3001;

app.use(express.static('test-results'));

app.get('/api/executions', async (req, res) => {
  const resultsDir = path.join(__dirname, '../../../test-results');
  const executions = await fs.readdir(resultsDir);
  
  const reports = [];
  for (const execution of executions) {
    try {
      const resultPath = path.join(resultsDir, execution, 'results.json');
      const data = await fs.readFile(resultPath, 'utf-8');
      reports.push(JSON.parse(data));
    } catch (error) {
      // Ignorar carpetas sin results.json
    }
  }
  
  res.json(reports.sort((a, b) => b.executionId - a.executionId));
});

app.get('/dashboard', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Test Dashboard</title>
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        .execution { 
          border: 1px solid #ddd; 
          padding: 15px; 
          margin: 10px 0;
          cursor: pointer;
        }
        .execution:hover { background: #f5f5f5; }
        .charts { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        canvas { max-height: 300px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Test Execution Dashboard</h1>
        <div class="charts">
          <canvas id="trendsChart"></canvas>
          <canvas id="distributionChart"></canvas>
        </div>
        <div id="executions"></div>
      </div>
      <script>
        async function loadDashboard() {
          const response = await fetch('/api/executions');
          const executions = await response.json();
          
          // Render executions list
          const container = document.getElementById('executions');
          executions.forEach(exec => {
            const div = document.createElement('div');
            div.className = 'execution';
            div.innerHTML = \`
              <h3>Execution \${exec.executionId}</h3>
              <p>Date: \${new Date(exec.startTime).toLocaleString()}</p>
              <p>Success Rate: \${exec.summary.successRate}</p>
              <p>Total Cases: \${exec.summary.totalCases}</p>
            \`;
            div.onclick = () => window.open(\`/\${exec.executionId}/report.html\`);
            container.appendChild(div);
          });
          
          // Render trends chart
          const trendsCtx = document.getElementById('trendsChart').getContext('2d');
          new Chart(trendsCtx, {
            type: 'line',
            data: {
              labels: executions.map(e => new Date(e.startTime).toLocaleDateString()),
              datasets: [{
                label: 'Success Rate',
                data: executions.map(e => parseFloat(e.summary.successRate)),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
              }]
            },
            options: {
              responsive: true,
              plugins: {
                title: { display: true, text: 'Success Rate Trends' }
              }
            }
          });
        }
        
        loadDashboard();
      </script>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`📊 Dashboard disponible en http://localhost:${PORT}/dashboard`);
});