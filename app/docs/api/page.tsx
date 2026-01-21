'use client';

import { useState } from 'react';
import { Code, Copy, CheckCircle, AlertCircle, Lock, Zap, Shield, BookOpen, TerminalIcon, ChevronDown } from 'lucide-react';
import Link from 'next/link';

interface CodeExample {
  language: string;
  code: string;
  label: string;
}

interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  title: string;
  description: string;
  authentication: boolean;
  rateLimit: string;
  examples: CodeExample[];
  requestBody?: {
    example: string;
    description: string;
  };
  responseBody?: {
    example: string;
    description: string;
  };
  errorCodes?: { code: number; message: string; description: string }[];
}

export default function APIDocumentationPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<'javascript' | 'python' | 'curl'>('javascript');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const baseUrl = 'https://api.TALA.io/v1';
  const apiKey = 'sk_live_your_api_key_here';

  const endpoints: Endpoint[] = [
    {
      method: 'POST',
      path: '/vaults',
      title: 'Create Vault',
      description: 'Create a new encrypted vault for storing sensitive files.',
      authentication: true,
      rateLimit: '100 requests/hour',
      examples: [
        {
          language: 'javascript',
          label: 'JavaScript',
          code: `const response = await fetch('https://api.TALA.io/v1/vaults', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk_live_your_api_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Q1 2026 Exams',
    description: 'Secure exam papers vault',
    unlockDate: '2026-03-14T00:00:00Z',
    maxSize: '1GB'
  })
});

const vault = await response.json();
console.log('Vault created:', vault.id);`,
        },
        {
          language: 'python',
          label: 'Python',
          code: `import requests
import json
from datetime import datetime

url = 'https://api.TALA.io/v1/vaults'
headers = {
    'Authorization': 'Bearer sk_live_your_api_key',
    'Content-Type': 'application/json'
}
payload = {
    'name': 'Q1 2026 Exams',
    'description': 'Secure exam papers vault',
    'unlockDate': '2026-03-14T00:00:00Z',
    'maxSize': '1GB'
}

response = requests.post(url, headers=headers, json=payload)
vault = response.json()
print(f"Vault created: {vault['id']}")`,
        },
        {
          language: 'curl',
          label: 'cURL',
          code: `curl -X POST https://api.TALA.io/v1/vaults \\
  -H "Authorization: Bearer sk_live_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Q1 2026 Exams",
    "description": "Secure exam papers vault",
    "unlockDate": "2026-03-14T00:00:00Z",
    "maxSize": "1GB"
  }'`,
        },
      ],
      requestBody: {
        example: `{
  "name": "string (required)",
  "description": "string (optional)",
  "unlockDate": "ISO 8601 (required)",
  "maxSize": "string (optional, default: 1GB)",
  "tags": ["string"] (optional),
  "collaborators": ["email@example.com"] (optional)
}`,
        description: 'Request body parameters for vault creation',
      },
      responseBody: {
        example: `{
  "id": "vault_1234567890",
  "name": "Q1 2026 Exams",
  "description": "Secure exam papers vault",
  "status": "active",
  "unlockDate": "2026-03-14T00:00:00Z",
  "createdAt": "2026-01-12T10:30:00Z",
  "maxSize": "1GB",
  "currentSize": "0B",
  "encryptionLevel": "AES-256-GCM",
  "ipfsHash": "QmXxxx...",
  "verified": true
}`,
        description: 'Successful vault creation response',
      },
      errorCodes: [
        { code: 400, message: 'Bad Request', description: 'Invalid parameters or missing required fields' },
        { code: 401, message: 'Unauthorized', description: 'Invalid or missing API key' },
        { code: 429, message: 'Too Many Requests', description: 'Rate limit exceeded' },
        { code: 500, message: 'Server Error', description: 'Internal server error' },
      ],
    },
    {
      method: 'GET',
      path: '/vaults/{id}',
      title: 'Get Vault Details',
      description: 'Retrieve detailed information about a specific vault.',
      authentication: true,
      rateLimit: '1000 requests/hour',
      examples: [
        {
          language: 'javascript',
          label: 'JavaScript',
          code: `const vaultId = 'vault_1234567890';

const response = await fetch(\`https://api.TALA.io/v1/vaults/\${vaultId}\`, {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer sk_live_your_api_key'
  }
});

const vault = await response.json();
console.log('Vault details:', vault);`,
        },
        {
          language: 'python',
          label: 'Python',
          code: `import requests

vault_id = 'vault_1234567890'
url = f'https://api.TALA.io/v1/vaults/{vault_id}'
headers = {'Authorization': 'Bearer sk_live_your_api_key'}

response = requests.get(url, headers=headers)
vault = response.json()
print(f"Vault status: {vault['status']}")`,
        },
        {
          language: 'curl',
          label: 'cURL',
          code: `curl -X GET https://api.TALA.io/v1/vaults/vault_1234567890 \\
  -H "Authorization: Bearer sk_live_your_api_key"`,
        },
      ],
      responseBody: {
        example: `{
  "id": "vault_1234567890",
  "name": "Q1 2026 Exams",
  "status": "active",
  "unlockDate": "2026-03-14T00:00:00Z",
  "files": [
    {
      "id": "file_001",
      "name": "exam_paper.pdf",
      "size": "2.5MB",
      "uploadedAt": "2026-01-12T10:35:00Z"
    }
  ],
  "collaborators": ["teacher@school.edu"]
}`,
        description: 'Vault details including files and collaborators',
      },
    },
    {
      method: 'POST',
      path: '/vaults/{id}/files',
      title: 'Upload File to Vault',
      description: 'Upload an encrypted file to an existing vault.',
      authentication: true,
      rateLimit: '500 requests/hour',
      examples: [
        {
          language: 'javascript',
          label: 'JavaScript',
          code: `const vaultId = 'vault_1234567890';
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];

const formData = new FormData();
formData.append('file', file);
formData.append('name', file.name);

const response = await fetch(\`https://api.TALA.io/v1/vaults/\${vaultId}/files\`, {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk_live_your_api_key'
  },
  body: formData
});

const uploadedFile = await response.json();
console.log('File uploaded:', uploadedFile.id);`,
        },
        {
          language: 'python',
          label: 'Python',
          code: `import requests

vault_id = 'vault_1234567890'
file_path = 'exam_paper.pdf'

with open(file_path, 'rb') as f:
    files = {'file': f}
    headers = {'Authorization': 'Bearer sk_live_your_api_key'}
    
    response = requests.post(
        f'https://api.TALA.io/v1/vaults/{vault_id}/files',
        headers=headers,
        files=files
    )
    
uploaded = response.json()
print(f"File uploaded: {uploaded['id']}")`,
        },
        {
          language: 'curl',
          label: 'cURL',
          code: `curl -X POST https://api.TALA.io/v1/vaults/vault_1234567890/files \\
  -H "Authorization: Bearer sk_live_your_api_key" \\
  -F "file=@exam_paper.pdf"`,
        },
      ],
    },
    {
      method: 'GET',
      path: '/vaults/{id}/files/{fileId}',
      title: 'Download File',
      description: 'Download a file from a vault (only after unlock date).',
      authentication: true,
      rateLimit: '200 requests/hour',
      examples: [
        {
          language: 'javascript',
          label: 'JavaScript',
          code: `const vaultId = 'vault_1234567890';
const fileId = 'file_001';

const response = await fetch(
  \`https://api.TALA.io/v1/vaults/\${vaultId}/files/\${fileId}\`,
  {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer sk_live_your_api_key'
    }
  }
);

const blob = await response.blob();
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'exam_paper.pdf';
a.click();`,
        },
        {
          language: 'python',
          label: 'Python',
          code: `import requests

vault_id = 'vault_1234567890'
file_id = 'file_001'

response = requests.get(
    f'https://api.TALA.io/v1/vaults/{vault_id}/files/{file_id}',
    headers={'Authorization': 'Bearer sk_live_your_api_key'}
)

with open('exam_paper.pdf', 'wb') as f:
    f.write(response.content)
print('File downloaded successfully')`,
        },
        {
          language: 'curl',
          label: 'cURL',
          code: `curl -X GET https://api.TALA.io/v1/vaults/vault_1234567890/files/file_001 \\
  -H "Authorization: Bearer sk_live_your_api_key" \\
  -o exam_paper.pdf`,
        },
      ],
    },
    {
      method: 'DELETE',
      path: '/vaults/{id}',
      title: 'Delete Vault',
      description: 'Permanently delete a vault and all its contents (irreversible).',
      authentication: true,
      rateLimit: '50 requests/hour',
      examples: [
        {
          language: 'javascript',
          label: 'JavaScript',
          code: `const vaultId = 'vault_1234567890';

const response = await fetch(\`https://api.TALA.io/v1/vaults/\${vaultId}\`, {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer sk_live_your_api_key'
  }
});

const result = await response.json();
console.log('Vault deleted:', result.message);`,
        },
        {
          language: 'python',
          label: 'Python',
          code: `import requests

vault_id = 'vault_1234567890'

response = requests.delete(
    f'https://api.TALA.io/v1/vaults/{vault_id}',
    headers={'Authorization': 'Bearer sk_live_your_api_key'}
)

result = response.json()
print(f"Vault deleted: {result['message']}")`,
        },
        {
          language: 'curl',
          label: 'cURL',
          code: `curl -X DELETE https://api.TALA.io/v1/vaults/vault_1234567890 \\
  -H "Authorization: Bearer sk_live_your_api_key"`,
        },
      ],
    },
  ];

  const rateLimitsByTier = [
    { tier: 'Starter', requests: '100/hour', concurrent: '5', fileSize: '500MB' },
    { tier: 'Professional', requests: '1,000/hour', concurrent: '50', fileSize: 'Unlimited' },
    { tier: 'Enterprise', requests: '10,000/hour', concurrent: '500', fileSize: 'Unlimited' },
    { tier: 'Government', requests: 'Unlimited', concurrent: 'Unlimited', fileSize: 'Unlimited' },
  ];

  const errorCodes = [
    { code: 400, message: 'Bad Request', description: 'Invalid request parameters' },
    { code: 401, message: 'Unauthorized', description: 'Missing or invalid API key' },
    { code: 403, message: 'Forbidden', description: 'Insufficient permissions' },
    { code: 404, message: 'Not Found', description: 'Resource does not exist' },
    { code: 429, message: 'Too Many Requests', description: 'Rate limit exceeded. Retry after delay' },
    { code: 500, message: 'Internal Server Error', description: 'Server error occurred. Try again later' },
    { code: 503, message: 'Service Unavailable', description: 'Service is temporarily unavailable' },
  ];

  const sdks = [
    { name: 'JavaScript/TypeScript', package: 'npm install @TALA/sdk-js', code: `import { TALAClient } from '@TALA/sdk-js';

const client = new TALAClient('sk_live_your_api_key');
const vault = await client.vaults.create({
  name: 'My Vault',
  unlockDate: new Date('2026-03-14')
});` },
    { name: 'Python', package: 'pip install TALA-sdk', code: `from TALA import TALAClient

client = TALAClient('sk_live_your_api_key')
vault = client.vaults.create(
    name='My Vault',
    unlock_date='2026-03-14'
)` },
    { name: 'Go', package: 'go get github.com/TALA/sdk-go', code: `package main

import "github.com/TALA/sdk-go"

client := sdk.NewClient("sk_live_your_api_key")
vault, err := client.Vaults.Create(ctx, &sdk.CreateVaultRequest{
    Name: "My Vault",
})` },
  ];

  const authMethods = [
    {
      name: 'API Key Authentication',
      description: 'Most common method for server-to-server requests',
      example: `Authorization: Bearer sk_live_your_api_key`,
      useCases: ['Backend integrations', 'Scheduled tasks', 'Batch operations'],
    },
    {
      name: 'OAuth 2.0',
      description: 'For user-facing applications requiring user permissions',
      example: `Authorization: Bearer access_token_from_oauth_flow`,
      useCases: ['User applications', 'Third-party integrations', 'Delegated access'],
    },
    {
      name: 'Webhook Signatures',
      description: 'Verify webhook authenticity using HMAC-SHA256',
      example: `X-TALA-Signature: sha256=...`,
      useCases: ['Webhook verification', 'Security validation', 'Message integrity'],
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="border-b-4 border-black py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="mb-4">
            <Link href="/docs" className="text-sm font-bold text-gray-700 hover:text-black">
              ← Documentation
            </Link>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <Code className="w-10 h-10 text-black" />
            <h1 className="text-4xl md:text-5xl font-black text-black">API Documentation</h1>
          </div>
          <p className="text-lg text-gray-700 mb-6 max-w-3xl">
            Complete reference for T.A.L.A. REST API. Build powerful applications with our enterprise-grade vault management API.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#authentication"
              className="px-6 py-3 bg-black text-white font-bold border-3 border-black rounded-lg hover:opacity-90 transition-all"
            >
              Get Started
            </a>
            <a
              href="#endpoints"
              className="px-6 py-3 bg-white text-black font-bold border-3 border-black rounded-lg hover:bg-gray-50 transition-all"
            >
              View Endpoints
            </a>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-12 md:py-16 bg-heirlock-yellow border-b-4 border-black">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-black text-black mb-8">Quick Start</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="border-4 border-black p-6 bg-white rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-6 h-6 text-black" />
                <h3 className="text-lg font-black text-black">1. Get API Key</h3>
              </div>
              <p className="text-sm text-gray-700">
                Generate your API key from the dashboard. Keep it secret and never share it.
              </p>
            </div>
            <div className="border-4 border-black p-6 bg-white rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-black" />
                <h3 className="text-lg font-black text-black">2. Choose Your Language</h3>
              </div>
              <p className="text-sm text-gray-700">
                Use our SDKs or make direct HTTP requests. We support 10+ languages.
              </p>
            </div>
            <div className="border-4 border-black p-6 bg-white rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-black" />
                <h3 className="text-lg font-black text-black">3. Build Securely</h3>
              </div>
              <p className="text-sm text-gray-700">
                All data encrypted end-to-end. Military-grade security by default.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Authentication */}
      <section id="authentication" className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-black text-black mb-8">Authentication</h2>

          <div className="space-y-6 mb-12">
            {authMethods.map((method, index) => (
              <div key={index} className="border-4 border-black p-6 rounded-lg bg-white hover:shadow-brutal transition-all">
                <h3 className="text-xl font-black text-black mb-2">{method.name}</h3>
                <p className="text-gray-700 mb-4">{method.description}</p>
                <div className="bg-gray-100 border-2 border-black p-4 mb-4 font-mono text-sm overflow-x-auto">
                  <code className="text-black">{method.example}</code>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Use Cases:</p>
                  <div className="flex flex-wrap gap-2">
                    {method.useCases.map((useCase, idx) => (
                      <span key={idx} className="bg-heirlock-blue text-black text-xs font-bold px-3 py-1 rounded-full border-2 border-black">
                        {useCase}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* API Key Example */}
          <div className="border-4 border-black p-8 bg-heirlock-blue rounded-lg mb-12">
            <h3 className="text-2xl font-black text-black mb-4">API Key Example</h3>
            <div className="bg-black text-white p-4 font-mono text-sm rounded border-2 border-black mb-4 overflow-x-auto">
              <code>curl -H "Authorization: Bearer sk_live_your_api_key" https://api.TALA.io/v1/vaults</code>
            </div>
            <p className="text-sm text-gray-800">
              <strong>Never expose your API key in client-side code.</strong> Use OAuth 2.0 for browser-based applications.
            </p>
          </div>
        </div>
      </section>

      {/* Rate Limiting */}
      <section className="py-12 md:py-16 bg-heirlock-pink border-y-4 border-black">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-black text-black mb-8">Rate Limiting</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-4 border-black">
              <thead>
                <tr className="bg-black text-white">
                  <th className="px-6 py-4 text-left font-black border-r-2 border-white">Plan</th>
                  <th className="px-6 py-4 text-left font-black border-r-2 border-white">Requests/Hour</th>
                  <th className="px-6 py-4 text-left font-black border-r-2 border-white">Concurrent</th>
                  <th className="px-6 py-4 text-left font-black">Max File Size</th>
                </tr>
              </thead>
              <tbody>
                {rateLimitsByTier.map((tier, index) => (
                  <tr key={index} className={`border-b-2 border-black ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-6 py-4 font-bold text-black border-r-2 border-black">{tier.tier}</td>
                    <td className="px-6 py-4 text-gray-800 border-r-2 border-black">{tier.requests}</td>
                    <td className="px-6 py-4 text-gray-800 border-r-2 border-black">{tier.concurrent}</td>
                    <td className="px-6 py-4 text-gray-800">{tier.fileSize}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 border-4 border-black p-6 bg-white rounded-lg">
            <h3 className="text-lg font-black text-black mb-3">Rate Limit Headers</h3>
            <div className="bg-gray-100 border-2 border-black p-4 font-mono text-sm space-y-2 overflow-x-auto">
              <div><code className="text-black">X-RateLimit-Limit: 1000</code></div>
              <div><code className="text-black">X-RateLimit-Remaining: 999</code></div>
              <div><code className="text-black">X-RateLimit-Reset: 1610423400</code></div>
            </div>
          </div>
        </div>
      </section>

      {/* Endpoints */}
      <section id="endpoints" className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-black text-black mb-8">API Endpoints</h2>

          <div className="space-y-6">
            {endpoints.map((endpoint, index) => (
              <div key={index} className="border-4 border-black rounded-lg overflow-hidden bg-white">
                {/* Header */}
                <button
                  onClick={() => setExpandedEndpoint(expandedEndpoint === endpoint.path ? null : endpoint.path)}
                  className="w-full p-6 hover:bg-gray-50 transition-colors flex items-start justify-between"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <span
                      className={`px-3 py-1 font-black text-white rounded text-xs uppercase tracking-widest whitespace-nowrap ${
                        endpoint.method === 'GET'
                          ? 'bg-heirlock-blue'
                          : endpoint.method === 'POST'
                          ? 'bg-heirlock-yellow'
                          : endpoint.method === 'PUT'
                          ? 'bg-heirlock-green'
                          : 'bg-heirlock-pink'
                      }`}
                    >
                      {endpoint.method}
                    </span>
                    <div className="text-left">
                      <h3 className="text-lg font-black text-black">{endpoint.title}</h3>
                      <p className="text-sm text-gray-700 mt-1">{endpoint.path}</p>
                      <p className="text-xs text-gray-600 mt-1">{endpoint.description}</p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-black flex-shrink-0 transition-transform ${
                      expandedEndpoint === endpoint.path ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Expanded Content */}
                {expandedEndpoint === endpoint.path && (
                  <>
                    <div className="border-t-4 border-black p-6 space-y-6">
                      {/* Details */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Authentication</p>
                          <p className="text-sm font-bold text-black mt-1">{endpoint.authentication ? 'Required' : 'Not Required'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Rate Limit</p>
                          <p className="text-sm font-bold text-black mt-1">{endpoint.rateLimit}</p>
                        </div>
                      </div>

                      {/* Request Body */}
                      {endpoint.requestBody && (
                        <div className="pt-4 border-t-2 border-gray-200">
                          <p className="text-sm font-black text-black mb-3">Request Body</p>
                          <p className="text-xs text-gray-600 mb-2">{endpoint.requestBody.description}</p>
                          <div className="bg-gray-100 border-2 border-black p-4 font-mono text-xs overflow-x-auto">
                            <code className="text-black">{endpoint.requestBody.example}</code>
                          </div>
                        </div>
                      )}

                      {/* Response Body */}
                      {endpoint.responseBody && (
                        <div className="pt-4 border-t-2 border-gray-200">
                          <p className="text-sm font-black text-black mb-3">Response Body</p>
                          <p className="text-xs text-gray-600 mb-2">{endpoint.responseBody.description}</p>
                          <div className="bg-gray-100 border-2 border-black p-4 font-mono text-xs overflow-x-auto">
                            <code className="text-black">{endpoint.responseBody.example}</code>
                          </div>
                        </div>
                      )}

                      {/* Error Codes */}
                      {endpoint.errorCodes && (
                        <div className="pt-4 border-t-2 border-gray-200">
                          <p className="text-sm font-black text-black mb-3">Possible Errors</p>
                          <div className="space-y-2">
                            {endpoint.errorCodes.map((error, idx) => (
                              <div key={idx} className="flex gap-3 text-sm">
                                <span className="font-bold text-black min-w-[50px]">{error.code}</span>
                                <div>
                                  <p className="font-bold text-black">{error.message}</p>
                                  <p className="text-gray-700">{error.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Code Examples */}
                      <div className="pt-4 border-t-2 border-gray-200">
                        <p className="text-sm font-black text-black mb-4">Examples</p>

                        {/* Language Selector */}
                        <div className="flex gap-2 mb-4">
                          {['javascript', 'python', 'curl'].map((lang) => (
                            <button
                              key={lang}
                              onClick={() => setSelectedLanguage(lang as 'javascript' | 'python' | 'curl')}
                              className={`text-xs font-bold px-3 py-2 rounded border-2 transition-all capitalize ${
                                selectedLanguage === lang
                                  ? 'bg-black text-white border-black'
                                  : 'bg-white text-black border-gray-300 hover:border-black'
                              }`}
                            >
                              {lang}
                            </button>
                          ))}
                        </div>

                        {/* Code Display */}
                        {endpoint.examples.map((example) => {
                          if (example.language === selectedLanguage) {
                            return (
                              <div key={example.language} className="relative">
                                <div className="bg-black text-white p-4 font-mono text-xs overflow-x-auto rounded border-2 border-black">
                                  <code className="text-white">{example.code}</code>
                                </div>
                                <button
                                  onClick={() => handleCopyCode(example.code, `${endpoint.path}-${example.language}`)}
                                  className="absolute top-2 right-2 p-2 bg-white text-black border-2 border-black rounded hover:bg-gray-100 transition-colors"
                                  title="Copy code"
                                >
                                  {copiedCode === `${endpoint.path}-${example.language}` ? (
                                    <CheckCircle className="w-4 h-4" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            );
                          }
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Error Codes */}
      <section className="py-12 md:py-16 bg-heirlock-green border-y-4 border-black">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-black text-black mb-8">HTTP Status Codes</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {errorCodes.map((error, index) => (
              <div key={index} className="border-4 border-black p-6 bg-white rounded-lg">
                <div className="flex items-start gap-3 mb-2">
                  {error.code >= 400 && error.code < 500 ? (
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  ) : error.code >= 500 ? (
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-black text-black">{error.code} - {error.message}</p>
                    <p className="text-sm text-gray-700">{error.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SDKs */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-black text-black mb-8">Official SDKs</h2>

          <div className="space-y-6">
            {sdks.map((sdk, index) => (
              <div key={index} className="border-4 border-black p-6 rounded-lg bg-white hover:shadow-brutal transition-all">
                <h3 className="text-xl font-black text-black mb-3">{sdk.name}</h3>

                <div className="mb-4">
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Installation</p>
                  <div className="bg-gray-100 border-2 border-black p-3 font-mono text-sm overflow-x-auto">
                    <code className="text-black">{sdk.package}</code>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Example</p>
                  <div className="bg-black text-white p-4 font-mono text-xs overflow-x-auto rounded border-2 border-black">
                    <code className="text-white">{sdk.code}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 border-4 border-black p-8 bg-heirlock-yellow rounded-lg">
            <h3 className="text-xl font-black text-black mb-2">Need Another Language?</h3>
            <p className="text-gray-800 mb-4">
              We support REST API for any language. Check out our community-contributed SDKs or build your own integration.
            </p>
            <a
              href="/contact"
              className="inline-block px-6 py-3 bg-black text-white font-bold border-3 border-black rounded-lg hover:opacity-90 transition-all"
            >
              Request SDK Support
            </a>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="py-12 md:py-16 bg-heirlock-blue border-y-4 border-black">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-black text-black mb-8">Best Practices</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: '🔒', title: 'Security', points: ['Never commit API keys to version control', 'Rotate keys regularly', 'Use environment variables for secrets'] },
              { icon: '⚡', title: 'Performance', points: ['Implement exponential backoff for retries', 'Cache responses when possible', 'Use webhooks instead of polling'] },
              { icon: '📊', title: 'Monitoring', points: ['Monitor API response times', 'Track error rates', 'Set up alerting for failures'] },
              { icon: '🔄', title: 'Reliability', points: ['Implement proper error handling', 'Use idempotent operations', 'Test with rate limiting'] },
            ].map((section, index) => (
              <div key={index} className="border-4 border-black p-6 bg-white rounded-lg">
                <h3 className="text-lg font-black text-black mb-4">{section.icon} {section.title}</h3>
                <ul className="space-y-2">
                  {section.points.map((point, idx) => (
                    <li key={idx} className="text-sm text-gray-800 flex items-start gap-2">
                      <span className="font-black text-black mt-0.5">→</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support & Resources */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-black text-black mb-8">Support & Resources</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-4 border-black p-8 bg-white rounded-lg">
              <BookOpen className="w-8 h-8 text-black mb-4" />
              <h3 className="text-xl font-black text-black mb-3">Documentation</h3>
              <p className="text-gray-700 mb-4">Explore detailed guides and tutorials to help you integrate T.A.L.A. API.</p>
              <a href="/docs" className="font-bold text-black hover:underline">
                Read Docs →
              </a>
            </div>

            <div className="border-4 border-black p-8 bg-white rounded-lg">
              <TerminalIcon className="w-8 h-8 text-black mb-4" />
              <h3 className="text-xl font-black text-black mb-3">Code Examples</h3>
              <p className="text-gray-700 mb-4">Browse real-world examples and integrations built by our team and community.</p>
              <a href="/docs" className="font-bold text-black hover:underline">
                View Examples →
              </a>
            </div>

            <div className="border-4 border-black p-8 bg-white rounded-lg">
              <Shield className="w-8 h-8 text-black mb-4" />
              <h3 className="text-xl font-black text-black mb-3">Security</h3>
              <p className="text-gray-700 mb-4">Learn about our security practices, compliance, and how we protect your data.</p>
              <a href="/security" className="font-bold text-black hover:underline">
                Security Info →
              </a>
            </div>

            <div className="border-4 border-black p-8 bg-white rounded-lg">
              <Zap className="w-8 h-8 text-black mb-4" />
              <h3 className="text-xl font-black text-black mb-3">Status Page</h3>
              <p className="text-gray-700 mb-4">Check real-time API status, incidents, and scheduled maintenance.</p>
              <a href="/status" className="font-bold text-black hover:underline">
                View Status →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t-4 border-black py-12 md:py-16 bg-heirlock-pink">
        <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-black mb-6">Ready to Build?</h2>
          <p className="text-lg text-gray-800 mb-8 max-w-2xl mx-auto">
            Get your API key today and start integrating T.A.L.A. into your application.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/dashboard"
              className="px-8 py-4 bg-black text-white font-bold border-3 border-black rounded-lg hover:opacity-90 transition-opacity"
            >
              Get API Key
            </a>
            <a
              href="/contact"
              className="px-8 py-4 border-3 border-black text-black font-bold rounded-lg bg-white hover:bg-gray-50 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

