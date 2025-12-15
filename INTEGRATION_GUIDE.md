# TALA API Integration Guide

Quick-start guide for integrating the TALA Vault API into your application.

## 🚀 Quick Start

### 1. Environment Setup

Add to your `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
JWT_STORAGE_KEY=tala_auth_token
```

### 2. Authentication Flow

```typescript
import { useState } from 'react';

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const register = async (data: {
    email: string;
    walletAddress: string;
    username: string;
    displayName: string;
  }) => {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  };

  const login = async (email: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const { data } = await res.json();
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('tala_auth_token', data.token);
    return data;
  };

  const getProfile = async () => {
    const token = localStorage.getItem('tala_auth_token');
    const res = await fetch('/api/auth', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const { data } = await res.json();
    setUser(data);
    return data;
  };

  return { token, user, register, login, getProfile };
}
```

### 3. Create Vault

```typescript
const createVault = async (token: string, name: string, password: string) => {
  const res = await fetch('/api/vaults', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      description: 'My vault',
      password
    })
  });
  return await res.json();
};
```

### 4. List Vaults

```typescript
const listVaults = async (token: string, page = 1) => {
  const res = await fetch(`/api/vaults?page=${page}&pageSize=10`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await res.json();
};
```

### 5. Get Vault Details

```typescript
const getVault = async (token: string, vaultId: string) => {
  const res = await fetch(`/api/vaults/${vaultId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await res.json();
};
```

### 6. Update Vault

```typescript
const updateVault = async (token: string, vaultId: string, updates: any) => {
  const res = await fetch(`/api/vaults/${vaultId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });
  return await res.json();
};
```

### 7. Delete Vault

```typescript
const deleteVault = async (token: string, vaultId: string) => {
  const res = await fetch(`/api/vaults/${vaultId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({})
  });
  return await res.json();
};
```

---

## 🎯 Error Handling

All API responses follow this format:

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: Record<string, string>;
  timestamp: string;
}
```

Example error handling:

```typescript
async function apiCall<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('tala_auth_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };

  const res = await fetch(url, { ...options, headers });
  const data = await res.json();

  if (!data.success) {
    const error = data.error || 'Unknown error';
    const details = data.details ? JSON.stringify(data.details) : '';
    throw new Error(`${error}${details ? ` - ${details}` : ''}`);
  }

  return data.data as T;
}

// Usage
try {
  const vault = await apiCall('/api/vaults', {
    method: 'POST',
    body: JSON.stringify({ name: 'Test Vault', password: 'pass123' })
  });
} catch (error) {
  console.error('Failed to create vault:', error.message);
}
```

---

## 🔐 Security Best Practices

### 1. Token Storage
```typescript
// Store in localStorage (basic)
localStorage.setItem('tala_auth_token', token);

// Or in secure httpOnly cookie (better)
// This is handled server-side
```

### 2. Automatic Token Refresh
```typescript
const checkTokenExpiry = (token: string) => {
  try {
    const [, payload] = token.split('.');
    const decoded = JSON.parse(atob(payload));
    const expiryMs = decoded.exp * 1000;
    const nowMs = Date.now();
    return expiryMs - nowMs > 60000; // 1 minute buffer
  } catch {
    return false;
  }
};

// Check before each request
if (!checkTokenExpiry(token)) {
  // Token expired, need to login again
}
```

### 3. Password Security
```typescript
// Never send passwords in plain text
// Always use HTTPS in production
// The API derives encryption keys from passwords using PBKDF2
```

### 4. Request Headers
```typescript
const secureFetch = (url: string, options: RequestInit = {}) => {
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest', // CSRF protection
      ...options.headers
    }
  });
};
```

---

## 📱 React Hook Example

```typescript
import { useCallback, useState, useEffect } from 'react';

interface UseVaultApiOptions {
  baseUrl?: string;
}

export function useVaultApi(options: UseVaultApiOptions = {}) {
  const baseUrl = options.baseUrl || '/api';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async (
    path: string,
    options?: RequestInit
  ) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('tala_auth_token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options?.headers
      };

      const res = await fetch(`${baseUrl}${path}`, {
        ...options,
        headers
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Request failed');
      }

      return data.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  return { request, loading, error };
}

// Usage in component
function VaultsList() {
  const { request, loading } = useVaultApi();
  const [vaults, setVaults] = useState([]);

  const loadVaults = async () => {
    const data = await request('/vaults');
    setVaults(data.data);
  };

  useEffect(() => {
    loadVaults();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <ul>
      {vaults.map(vault => (
        <li key={vault.id}>{vault.name}</li>
      ))}
    </ul>
  );
}
```

---

## 🛠️ Testing

### Using cURL

```bash
# Register
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "walletAddress": "0x1234567890123456789012345678901234567890",
    "username": "testuser",
    "displayName": "Test User"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Create vault (replace TOKEN with JWT from login)
curl -X POST http://localhost:3000/api/vaults \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Vault",
    "description": "Test",
    "password": "testPassword123"
  }'

# List vaults
curl -X GET "http://localhost:3000/api/vaults?page=1&pageSize=10" \
  -H "Authorization: Bearer TOKEN"
```

### Using Postman

1. Create environment with variables:
   - `base_url`: `http://localhost:3000`
   - `token`: (set after login)

2. Create requests:
   - POST `{{base_url}}/api/auth` - Register
   - POST `{{base_url}}/api/auth/login` - Login (stores token in env)
   - POST `{{base_url}}/api/vaults` - Create vault
   - GET `{{base_url}}/api/vaults` - List vaults

3. In login response, add script:
   ```javascript
   pm.environment.set("token", pm.response.json().data.token);
   ```

---

## 📚 Additional Resources

- **API Documentation:** See `API_DOCUMENTATION.md`
- **Implementation Summary:** See `IMPLEMENTATION_SUMMARY.md`
- **Source Code:** Check `app/api/` and `lib/auth/` directories

---

## 🎯 Next Steps

1. **Integrate authentication** into your app
2. **Connect vault operations** to UI components
3. **Add file upload** endpoint and integrate
4. **Implement activity logging** display
5. **Add data export** functionality
6. **Set up webhooks** for vault events

---

**Last Updated:** December 15, 2024
**Version:** 1.0.0
