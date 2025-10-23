export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Get password from request
  const { password } = req.body || {};
  
  // Validate password
  if (!password) {
    return res.status(400).json({ error: 'Senha ausente' });
  }
  
  // Check password (using environment variable or default)
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'kahoot';
  
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Senha incorreta' });
  }
  
  // Success
  return res.status(200).json({ ok: true });
}