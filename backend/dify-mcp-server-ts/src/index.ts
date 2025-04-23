import express from 'express';
import fs from 'fs';
import path from 'path';
import * as yaml from 'js-yaml';
import { DifyService } from './services/dify-service';
import { createMCPEndpoints } from './mcp/endpoints';

// Load configuration
const configPath = process.env.CONFIG_PATH || path.join(__dirname, '..', 'config.yaml');
let config: any;

try {
  const configFile = fs.readFileSync(configPath, 'utf8');
  config = yaml.load(configFile);
  console.log('Configuration loaded successfully');
} catch (error) {
  console.error('Error loading configuration:', error);
  process.exit(1);
}

// Initialize services
const difyService = new DifyService(config.dify_base_url, config.dify_app_sks);

// Initialize Express app
const app = express();
app.use(express.json());

// Set up MCP endpoints
createMCPEndpoints(app, difyService);

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Dify MCP server started on port ${PORT}`);
});