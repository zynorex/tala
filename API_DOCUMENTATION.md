# TALA Vault API Documentation

## Overview

Enterprise-grade secure vault API with JWT authentication, end-to-end encryption, and comprehensive audit logging.

**Base URL:** `https://api.tala.io` (development: `http://localhost:3000`)

**Authentication:** Bearer token in Authorization header
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Authentication Endpoints

### 1. User Registration
**POST** `/api/auth`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "walletAddress": "0x1234...5678",
  "username": "johndoe",
  "displayName": "John Doe"
}
```

**Validation Rules:**
- `email`: Valid email address, unique
- `walletAddress`: Valid Ethereum address, unique
- `username`: 3-20 characters, alphanumeric with underscores
- `displayName`: 1-100 characters

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "walletAddress": "0x1234...5678",
    "username": "johndoe",
    "displayName": "John Doe",
    "createdAt": "2024-12-15T10:30:00Z"
  },
  "timestamp": "2024-12-15T10:30:00Z"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input data
- `409 Conflict` - User already exists

---

### 2. User Login
**POST** `/api/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```
OR
```json
{
  "walletAddress": "0x1234...5678"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "walletAddress": "0x1234...5678",
      "username": "johndoe",
      "displayName": "John Doe"
    }
  },
  "timestamp": "2024-12-15T10:30:00Z"
}
```

**Token Details:**
- **Algorithm:** HS256
- **Expiry:** 7 days
- **Payload:**
  ```json
  {
    "userId": "uuid",
    "email": "user@example.com",
    "walletAddress": "0x1234...5678",
    "iat": 1702639800,
    "exp": 1703244600
  }
  ```

**Error Responses:**
- `400 Bad Request` - Missing email or wallet
- `404 Not Found` - User not found

---

### 3. Get User Profile
**GET** `/api/auth`

Retrieve authenticated user's profile information.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "walletAddress": "0x1234...5678",
    "username": "johndoe",
    "displayName": "John Doe",
    "avatarUrl": "https://example.com/avatar.jpg",
    "bio": "Blockchain enthusiast",
    "createdAt": "2024-12-15T10:30:00Z",
    "updatedAt": "2024-12-15T10:30:00Z",
    "_count": {
      "vaults": 3,
      "activityLogs": 15
    }
  },
  "timestamp": "2024-12-15T10:30:00Z"
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - User not found

---

### 4. Update User Profile
**PUT** `/api/auth`

Update user profile information.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "displayName": "John D.",
  "bio": "Web3 developer",
  "avatarUrl": "https://example.com/new-avatar.jpg"
}
```

**Validation Rules:**
- `displayName`: Optional, 1-100 characters
- `bio`: Optional, 0-500 characters
- `avatarUrl`: Optional, valid URL

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "displayName": "John D.",
    "avatarUrl": "https://example.com/new-avatar.jpg",
    "bio": "Web3 developer",
    "updatedAt": "2024-12-15T10:35:00Z"
  },
  "timestamp": "2024-12-15T10:35:00Z"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Invalid or missing token

---

### 5. Verify Token
**GET** `/api/auth/login`

Verify JWT token validity and extract payload.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "email": "user@example.com",
    "walletAddress": "0x1234...5678"
  },
  "timestamp": "2024-12-15T10:30:00Z"
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid, expired, or missing token

---

## Vault Endpoints

### 1. Create Vault
**POST** `/api/vaults`

Create a new secure vault for storing encrypted files.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "name": "Personal Documents",
  "description": "My important files",
  "password": "strongPassword123!"
}
```

**Validation Rules:**
- `name`: Required, 1-255 characters
- `description`: Optional, 0-500 characters
- `password`: Required, min 8 characters for encryption

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "vault-uuid",
    "userId": "user-uuid",
    "name": "Personal Documents",
    "description": "My important files",
    "isActive": true,
    "createdAt": "2024-12-15T10:30:00Z",
    "updatedAt": "2024-12-15T10:30:00Z",
    "_count": {
      "files": 0
    }
  },
  "timestamp": "2024-12-15T10:30:00Z"
}
```

**Security:**
- Password is used to derive encryption key (PBKDF2, 100k iterations)
- Vault data is encrypted with AES-256-GCM
- Password is never stored in plain text

**Error Responses:**
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Not authenticated
- `409 Conflict` - Vault name already exists

---

### 2. List Vaults
**GET** `/api/vaults`

List all vaults belonging to authenticated user.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `pageSize`: Items per page (default: 10, max: 100)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "vault-uuid-1",
        "userId": "user-uuid",
        "name": "Personal Documents",
        "description": "My important files",
        "isActive": true,
        "createdAt": "2024-12-15T10:30:00Z",
        "updatedAt": "2024-12-15T10:30:00Z",
        "_count": {
          "files": 5
        }
      }
    ],
    "pagination": {
      "total": 15,
      "page": 1,
      "pageSize": 10,
      "pages": 2
    }
  },
  "timestamp": "2024-12-15T10:30:00Z"
}
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated

---

### 3. Get Vault Details
**GET** `/api/vaults/{id}`

Retrieve detailed information about a specific vault.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**URL Parameters:**
- `id`: Vault UUID

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "vault-uuid",
    "userId": "user-uuid",
    "name": "Personal Documents",
    "description": "My important files",
    "isActive": true,
    "createdAt": "2024-12-15T10:30:00Z",
    "updatedAt": "2024-12-15T10:30:00Z",
    "files": [
      {
        "id": "file-uuid-1",
        "name": "document.pdf",
        "size": 102400,
        "mimeType": "application/pdf",
        "uploadedAt": "2024-12-15T10:35:00Z"
      }
    ],
    "_count": {
      "files": 1
    }
  },
  "timestamp": "2024-12-15T10:30:00Z"
}
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Vault belongs to different user
- `404 Not Found` - Vault not found

---

### 4. Update Vault
**PUT** `/api/vaults/{id}`

Update vault metadata (name and description).

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**URL Parameters:**
- `id`: Vault UUID

**Request Body:**
```json
{
  "name": "Updated Vault Name",
  "description": "Updated description"
}
```

**Validation Rules:**
- `name`: Optional, 1-255 characters
- `description`: Optional, 0-500 characters

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "vault-uuid",
    "userId": "user-uuid",
    "name": "Updated Vault Name",
    "description": "Updated description",
    "isActive": true,
    "createdAt": "2024-12-15T10:30:00Z",
    "updatedAt": "2024-12-15T10:40:00Z"
  },
  "timestamp": "2024-12-15T10:40:00Z"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Vault belongs to different user
- `404 Not Found` - Vault not found

---

### 5. Delete Vault
**DELETE** `/api/vaults/{id}`

Soft delete a vault (marks as inactive, preserves data for recovery).

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**URL Parameters:**
- `id`: Vault UUID

**Request Body:**
```json
{}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "vault-uuid",
    "userId": "user-uuid",
    "name": "Personal Documents",
    "isActive": false
  },
  "timestamp": "2024-12-15T10:45:00Z"
}
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Vault belongs to different user
- `404 Not Found` - Vault not found

---

## Error Response Format

All errors follow a consistent format:

```json
{
  "success": false,
  "error": "Error message",
  "details": {
    "field": "error description"
  },
  "timestamp": "2024-12-15T10:30:00Z"
}
```

### Common HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| `200` | OK | Request successful |
| `201` | Created | Resource created |
| `400` | Bad Request | Invalid input data |
| `401` | Unauthorized | Missing/invalid token |
| `403` | Forbidden | No permission for resource |
| `404` | Not Found | Resource doesn't exist |
| `409` | Conflict | Resource already exists |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Server Error | Internal error |

---

## Security Features

### 1. JWT Authentication
- Bearer token in Authorization header
- 7-day expiry for enhanced security
- HS256 algorithm with strong secret key
- Token contains: userId, email, walletAddress

### 2. Encryption
- **Files:** AES-256-GCM authenticated encryption
- **Key Derivation:** PBKDF2 with 100,000 iterations
- **Hashing:** SHA-256 for file integrity

### 3. Authorization
- All vault operations require valid JWT
- Ownership verification on all user-specific operations
- Activity logging for audit trail

### 4. Validation
- Zod schema validation for all inputs
- File size limits (max 10MB)
- MIME type whitelist (PDF, Office, images, text, CSV)

---

## Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/auth` (POST) | 5 requests | 1 hour |
| `/api/auth/login` (POST) | 10 requests | 1 hour |
| `/api/vaults` (POST) | 50 requests | 1 hour |
| Other endpoints | 100 requests | 1 hour |

Response on rate limit: `429 Too Many Requests`

---

## Code Examples

### JavaScript/Node.js

```javascript
// Register
const registerRes = await fetch('http://localhost:3000/api/auth', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    walletAddress: '0x...',
    username: 'johndoe',
    displayName: 'John Doe'
  })
});
const { data } = await registerRes.json();

// Login
const loginRes = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com' })
});
const { token, user } = await loginRes.json();

// Create Vault
const vaultRes = await fetch('http://localhost:3000/api/vaults', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'My Documents',
    description: 'Important files',
    password: 'strongPassword123!'
  })
});
const vault = await vaultRes.json();
```

### cURL

```bash
# Register
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "walletAddress": "0x...",
    "username": "johndoe",
    "displayName": "John Doe"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'

# List vaults
curl -X GET "http://localhost:3000/api/vaults?page=1&pageSize=10" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

---

## Changelog

### v1.0.0 - December 2024

**Added:**
- User registration and authentication with JWT
- User profile management
- Vault creation and management
- Activity logging
- Encryption integration
- Comprehensive error handling
- Zod schema validation

**Security:**
- JWT token-based authentication
- AES-256-GCM encryption
- PBKDF2 key derivation
- Ownership verification
- Input validation

---

## Support

For issues, questions, or feature requests, please contact:
- **Email:** support@tala.io
- **Discord:** [Join our community](https://discord.gg/tala)
- **Documentation:** [https://docs.tala.io](https://docs.tala.io)

---

**Last Updated:** December 15, 2024
**Version:** 1.0.0
  "id": "uuid",
  "email": "user@example.com",
  "walletAddress": "0x1234...",
  "username": "johndoe",
  "displayName": "John Doe",
  "avatarUrl": "https://...",
  "bio": "...",
  "createdAt": "2025-12-15T10:00:00Z",
  "updatedAt": "2025-12-15T10:00:00Z",
  "_count": {
    "vaults": 5,
    "activityLogs": 42
  }
}
```

#### Update User Profile
```
PUT /api/users/[id]
```

**Request Body:**
```json
{
  "userId": "xxx",
  "displayName": "New Name",
  "bio": "My bio",
  "avatarUrl": "https://..."
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "johndoe",
  "displayName": "New Name",
  "avatarUrl": "https://...",
  "bio": "My bio",
  "updatedAt": "2025-12-15T10:30:00Z"
}
```

---

### Vaults

#### Create Vault (Upload & Encrypt)
```
POST /api/vaults
```

**Request (FormData):**
- `userId`: User ID (string)
- `name`: Vault name (string)
- `description`: Vault description (string, optional)
- `file`: File to encrypt (File)
- `password`: Encryption password (string, 8+ chars)

**Response (201):**
```json
{
  "id": "vault-uuid",
  "name": "My Exam",
  "description": "...",
  "fileName": "exam.pdf",
  "fileSize": 2097152,
  "createdAt": "2025-12-15T10:00:00Z"
}
```

#### List User Vaults
```
GET /api/vaults?userId=xxx
```

**Response (200):**
```json
{
  "vaults": [
    {
      "id": "vault-uuid",
      "name": "My Exam",
      "description": "...",
      "fileName": "exam.pdf",
      "fileSize": 2097152,
      "mimeType": "application/pdf",
      "createdAt": "2025-12-15T10:00:00Z",
      "updatedAt": "2025-12-15T10:00:00Z"
    }
  ],
  "count": 1
}
```

#### Get Vault Details
```
GET /api/vaults/[id]?userId=xxx
```

**Response (200):**
```json
{
  "id": "vault-uuid",
  "name": "My Exam",
  "description": "...",
  "fileName": "exam.pdf",
  "fileSize": 2097152,
  "mimeType": "application/pdf",
  "createdAt": "2025-12-15T10:00:00Z",
  "updatedAt": "2025-12-15T10:00:00Z",
  "isActive": true,
  "encryptedData": "base64-encrypted-content",
  "activityLogs": [
    {
      "id": "log-uuid",
      "action": "view",
      "description": "Accessed vault: My Exam",
      "createdAt": "2025-12-15T10:05:00Z",
      "ipAddress": "192.168.1.1"
    }
  ]
}
```

#### Update Vault Metadata
```
PUT /api/vaults/[id]
```

**Request Body:**
```json
{
  "userId": "xxx",
  "name": "Updated Name",
  "description": "Updated description"
}
```

**Response (200):**
```json
{
  "id": "vault-uuid",
  "name": "Updated Name",
  "description": "Updated description",
  "updatedAt": "2025-12-15T10:30:00Z"
}
```

#### Delete Vault (Soft Delete)
```
DELETE /api/vaults/[id]?userId=xxx
```

**Response (200):**
```json
{
  "id": "vault-uuid",
  "name": "My Exam",
  "isActive": false,
  "deletedAt": "2025-12-15T10:35:00Z"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields: userId, name, file, password"
}
```

### 401 Unauthorized
```json
{
  "error": "Failed to decrypt vault: Invalid password"
}
```

### 403 Forbidden
```json
{
  "error": "Unauthorized: You do not own this vault"
}
```

### 404 Not Found
```json
{
  "error": "Vault not found"
}
```

### 413 Payload Too Large
```json
{
  "error": "File size exceeds 10MB limit"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to create vault",
  "details": "Database connection error"
}
```

---

## Security Notes

1. **Encryption**: All files are encrypted client-side using AES-256-GCM with PBKDF2 key derivation
2. **Key Management**: Encryption keys are derived from passwords using 100,000 PBKDF2 iterations
3. **File Hash**: SHA-256 hashing ensures file integrity
4. **Activity Logging**: All vault access is logged with timestamp, IP, and user agent
5. **Soft Delete**: Deleted vaults are marked inactive, not permanently removed
6. **Ownership**: All vaults require userId verification to prevent unauthorized access

---

## Usage Example (JavaScript/TypeScript)

```typescript
// Create a vault
async function createVault(file: File, password: string, userId: string) {
  const formData = new FormData();
  formData.append('userId', userId);
  formData.append('name', file.name);
  formData.append('description', 'My exam preparation');
  formData.append('file', file);
  formData.append('password', password);

  const response = await fetch('/api/vaults', {
    method: 'POST',
    body: formData,
  });

  return response.json();
}

// Get vault details
async function getVault(vaultId: string, userId: string) {
  const response = await fetch(`/api/vaults/${vaultId}?userId=${userId}`);
  return response.json();
}

// Decrypt vault (client-side)
// Use the encryptedData with vaultEncryption library
```

---

## Future Enhancements

- [ ] JWT authentication instead of userId parameter
- [ ] Rate limiting
- [ ] Webhook notifications
- [ ] Vault sharing & collaboration
- [ ] Bulk operations
- [ ] WebSocket real-time updates
- [ ] API key management
