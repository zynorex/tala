# API Routes Documentation

## Overview
T.A.L.A. provides REST API endpoints for vault management and user operations. All endpoints require authentication via `userId` parameter for now (can be upgraded to JWT tokens later).

## Base URL
```
https://tala.app/api
```

## Endpoints

### Users

#### Create/Get User
```
POST /api/users
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "walletAddress": "0x1234...",
  "username": "johndoe",
  "displayName": "John Doe"
}
```

**Response (201 or 200):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "walletAddress": "0x1234...",
  "username": "johndoe",
  "displayName": "John Doe",
  "createdAt": "2025-12-15T10:00:00Z",
  "message": "User created successfully"
}
```

#### Get User Profile
```
GET /api/users/[id]?userId=xxx
```

**Response (200):**
```json
{
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
