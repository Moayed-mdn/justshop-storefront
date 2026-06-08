# Session Domain Mismatch Error Handling

## Problem
When users access an endpoint from the wrong context (e.g., logged in as `customer` but trying to access `merchant` endpoints), they received a cryptic error:

```json
{
    "success": false,
    "code": "IDENTITY_DOMAIN_MISMATCH",
    "message": "Session contamination detected: domain mismatch.",
    "errors": {}
}
```

This error was technically accurate but provided no actionable guidance to the user.

## Root Cause
The `SessionOwnershipManager` tags sessions with an `auth_domain` when users log in. If they then try to access routes from a different domain (e.g., storefront session → merchant endpoint), the `ApplyIdentityRouteContext` middleware detects the mismatch and throws an exception.

## Solution Implemented

### 1. **User-Friendly Error Messages**
The error now explains:
- What domain they're currently logged in as
- What domain is required
- What action they need to take

**Example improved error:**
```json
{
    "success": false,
    "code": "IDENTITY_DOMAIN_MISMATCH",
    "message": "You are currently logged in as a customer, but this page requires merchant access. Please log out and sign in with the correct account type.",
    "logoutUrl": "http://localhost:8000/api/v1/auth/logout",
    "action": "logout_required",
    "errors": {}
}
```

### 2. **Actionable Response Data**
The response now includes:
- `logoutUrl`: Direct link to the logout endpoint
- `action`: Machine-readable flag (`logout_required`) for frontend automation

### 3. **Frontend Integration**
Frontends can now automatically:
```javascript
// Example frontend handling
if (error.code === 'IDENTITY_DOMAIN_MISMATCH' && error.action === 'logout_required') {
    // Auto-logout and show friendly message
    await fetch(error.logoutUrl, { method: 'POST' });
    showMessage(error.message);
    redirectTo('/login');
}
```

## Files Modified

1. **`app/Http/Middleware/ApplyIdentityRouteContext.php`**
   - Enhanced error message with domain context
   - Added logout URL to exception

2. **`app/Exceptions/Domain/InvalidIdentityDomainAccessException.php`**
   - Added optional `$logoutUrl` parameter
   - Added getter for logout URL

3. **`app/Exceptions/ExceptionRegistrar.php`**
   - Include `logoutUrl` and `action` in error response for domain mismatch errors

## Testing
The error now appears in these scenarios:
- Customer logged in, tries to access `/api/v1/merchant/*`
- Merchant logged in, tries to access customer-only routes
- Mixed session contexts after switching domains

## Benefits
✅ **Better UX**: Users understand what went wrong  
✅ **Actionable**: Clear next steps to fix the issue  
✅ **Automation-Friendly**: Frontends can handle this gracefully  
✅ **Security**: Still maintains strict session ownership enforcement  
✅ **Observability**: Telemetry logging remains intact
