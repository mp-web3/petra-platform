# 🏗️ Authentication Architecture - Detailed Explanation

This document explains how `auth.controller.ts` and `auth.module.ts` interact, and how the frontend calls these APIs.

---

## 📦 Part 1: Backend Architecture (NestJS)

### 🔄 How `auth.module.ts` and `auth.controller.ts` Interact

#### **1. Module Definition (`auth.module.ts`)**

```typescript
@Module({
    imports: [...],      // What this module NEEDS
    controllers: [...],  // What ENDPOINTS this module exposes
    providers: [...],    // What SERVICES this module provides
    exports: [...],       // What other modules can USE from this module
})
```

**Breakdown:**

```typescript
@Module({
    // ============================================================
    // IMPORTS: Dependencies this module needs
    // ============================================================
    imports: [
        PrismaModule,              // Provides PrismaService for database
        PassportModule,             // Provides passport strategies
        JwtModule,                  // Provides JWT signing/verification
        ConfigModule,               // Provides environment variables
    ],
    
    // ============================================================
    // CONTROLLERS: HTTP endpoints exposed by this module
    // ============================================================
    controllers: [AuthController],  // Defines POST /api/auth/login, etc.
    
    // ============================================================
    // PROVIDERS: Services/classes available within this module
    // ============================================================
    providers: [
        AuthService,    // Business logic (login, activation, etc.)
        JwtStrategy,    // Strategy for validating JWT tokens
    ],
    
    // ============================================================
    // EXPORTS: What other modules can import/use
    // ============================================================
    exports: [
        AuthService,        // Other modules can use AuthService
        JwtModule,         // Other modules can use JWT functionality
        PassportModule,    // Other modules can use passport guards
    ],
})
```

**What This Means:**
- NestJS uses **Dependency Injection (DI)**
- `AuthModule` is a **container** that wires everything together
- When `AuthController` needs `AuthService`, NestJS automatically injects it
- The module configures all the dependencies so they work together

---

#### **2. Controller (`auth.controller.ts`)**

```typescript
@Controller('api/auth')              // Base route: /api/auth
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    //              ↑
    //    Dependency Injection: NestJS automatically provides AuthService
    //    because it's registered in AuthModule.providers
    
    @Post('login')                    // Full route: POST /api/auth/login
    async login(@Body() dto: LoginDto) {
        // @Body() extracts JSON from request body
        // LoginDto validates the data (email, password required)
        
        const result = await this.authService.login(dto);
        //                    ↑
        //    Calls AuthService.login() method
        
        return { success: true, ...result };
        //    NestJS automatically converts to JSON response
    }
}
```

**What Happens When Request Arrives:**

```
HTTP POST /api/auth/login
    ↓
NestJS Router matches route to AuthController.login()
    ↓
@Body() decorator extracts and validates request body using LoginDto
    ↓
NestJS Dependency Injection provides AuthService instance
    ↓
Controller calls authService.login(dto)
    ↓
AuthService validates credentials, generates JWT
    ↓
Controller returns response
    ↓
NestJS converts to JSON HTTP response
```

---

#### **3. Service (`auth.service.ts`)**

```typescript
@Injectable()  // Marks class for Dependency Injection
export class AuthService {
    constructor(
        private prisma: PrismaService,      // Injected by NestJS
        private jwtService: JwtService      // Injected by NestJS
    ) {}
    
    async login(dto: LoginDto) {
        // 1. Find user in database
        const user = await this.prisma.user.findUnique({...});
        
        // 2. Validate password
        const isValid = await bcrypt.compare(...);
        
        // 3. Generate JWT token
        const token = this.jwtService.sign({ userId, email, role });
        
        // 4. Return token and user
        return { access_token: token, user };
    }
}
```

**Dependency Injection Flow:**

```
AuthModule
    ↓
Registers: PrismaModule, JwtModule
    ↓
AuthService constructor needs: PrismaService, JwtService
    ↓
NestJS looks in imports: Finds PrismaModule, JwtModule
    ↓
NestJS automatically creates instances and injects them
    ↓
AuthService can now use prisma and jwtService
```

---

#### **4. Complete Request Flow Example: Login**

```
┌─────────────────────────────────────────────────────────────┐
│ 1. HTTP Request Arrives                                     │
│    POST http://localhost:3001/api/auth/login                │
│    Body: { "email": "user@example.com", "password": "..." } │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. NestJS Router                                             │
│    - Matches route pattern "/api/auth/login"                │
│    - Finds AuthController.login() method                     │
│    - Applies decorators (@Post, @Body)                       │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Validation (@Body() + LoginDto)                          │
│    - Extracts JSON body                                      │
│    - Validates: email is email format, password exists       │
│    - Throws 400 if validation fails                          │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Dependency Injection                                      │
│    - NestJS creates/retrieves AuthService instance           │
│    - AuthService already has PrismaService and JwtService    │
│    - Injects into controller constructor                     │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Controller Method Executes                               │
│    AuthController.login(@Body() dto)                         │
│    ↓                                                         │
│    Calls: authService.login(dto)                             │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Service Business Logic                                   │
│    AuthService.login(dto)                                    │
│    ↓                                                         │
│    - Finds user: prisma.user.findUnique({ email })          │
│    - Validates password: bcrypt.compare()                   │
│    - Generates JWT: jwtService.sign({ userId, email })       │
│    - Returns: { access_token, user }                        │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. Response                                                  │
│    Controller returns: { success: true, access_token, user } │
│    ↓                                                         │
│    NestJS converts to JSON: HTTP 200                         │
│    {                                                        │
│      "success": true,                                        │
│      "message": "Login successful",                          │
│      "access_token": "eyJhbGciOi...",                       │
│      "user": { id, email, name, ... }                         │
│    }                                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🌐 Part 2: Frontend API Calls

### 🔄 How Frontend Calls the APIs

#### **Complete Flow: User Clicks "Sign In" Button**

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User Interaction                                         │
│    User types email/password and clicks "Sign In" button    │
│    Location: /login page                                      │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. React Component (LoginPage)                              │
│    const handleSubmit = async (e) => {                      │
│      await login(email, password);  // From AuthContext      │
│    }                                                         │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. AuthContext.login() Method                               │
│    AuthContext.tsx                                           │
│    const login = async (email, password) => {               │
│      const response = await apiClient.auth.login(...);      │
│      setUser(response.user);                                │
│    }                                                         │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. API Client (AuthApi)                                      │
│    packages/api-client/src/endpoints/auth.ts                │
│    async login(dto) {                                        │
│      const response = await this.client.post(...);          │
│      this.client.setAuthToken(response.access_token);       │
│      return response;                                        │
│    }                                                         │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Base ApiClient (HTTP Request)                            │
│    packages/api-client/src/client.ts                         │
│    async post(url, data) {                                  │
│      // Creates axios instance                               │
│      // Adds headers: Content-Type: application/json         │
│      // Makes HTTP POST request                             │
│      return axios.post(baseURL + url, data);                │
│    }                                                         │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. HTTP Request Sent                                        │
│    POST http://localhost:3001/api/auth/login                │
│    Headers: {                                                │
│      "Content-Type": "application/json"                      │
│    }                                                         │
│    Body: {                                                   │
│      "email": "user@example.com",                           │
│      "password": "SecurePass123"                            │
│    }                                                         │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. Backend Processes (see Part 1 above)                     │
│    → NestJS Router → AuthController → AuthService            │
│    → Returns JWT token and user                              │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 8. Response Received                                         │
│    HTTP 200 OK                                               │
│    {                                                        │
│      "success": true,                                        │
│      "access_token": "eyJhbGciOi...",                       │
│      "user": { id, email, name, ... }                        │
│    }                                                         │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 9. Token Storage                                             │
│    AuthApi.login() automatically calls:                     │
│    this.client.setAuthToken(response.access_token)           │
│    ↓                                                         │
│    localStorage.setItem('auth_token', token)                │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 10. State Update                                            │
│     AuthContext.setUser(response.user)                      │
│     ↓                                                        │
│     React re-renders with user data                          │
│     isAuthenticated = true                                   │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 11. Navigation                                              │
│     router.push('/dashboard')                                │
│     User redirected to dashboard                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔑 Part 3: Protected Routes Flow

### How JWT Token is Used in Protected Routes

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User Visits Protected Route                              │
│    GET /api/subscription                                     │
│    Browser makes request                                    │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. ApiClient Request Interceptor                            │
│    packages/api-client/src/client.ts                         │
│    request interceptor runs BEFORE request                   │
│    ↓                                                         │
│    const token = localStorage.getItem('auth_token');        │
│    config.headers.Authorization = `Bearer ${token}`;        │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. HTTP Request Sent                                        │
│    GET http://localhost:3001/api/subscription                │
│    Headers: {                                                │
│      "Authorization": "Bearer eyJhbGciOi..."                │
│    }                                                         │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Backend: JwtAuthGuard Executes                           │
│    @UseGuards(JwtAuthGuard) on SubscriptionController       │
│    ↓                                                         │
│    Guard extracts token from Authorization header            │
│    ↓                                                         │
│    Passes to JwtStrategy.validate()                         │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. JwtStrategy Validates Token                              │
│    jwt.strategy.ts                                           │
│    ↓                                                         │
│    - Verifies signature using JWT_SECRET                     │
│    - Checks expiration                                       │
│    - Decodes payload: { userId, email, role }                │
│    - Fetches user from database                              │
│    - Returns user object                                     │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. User Attached to Request                                 │
│    req.user = { id, email, name, role }                     │
│    (Set by JwtStrategy.validate())                          │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. Controller Method Executes                               │
│    SubscriptionController.getSubscription()                 │
│    ↓                                                         │
│    const userId = req.user.id;  // From JWT token!          │
│    ↓                                                         │
│    Returns user's subscription                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📚 Key Concepts Explained

### **1. NestJS Dependency Injection (DI)**

**What it does:**
- Automatically creates and manages class instances
- Injects dependencies into constructors
- No need for `new AuthService()` - NestJS does it

**Example:**
```typescript
// ❌ Without DI (manual):
const prisma = new PrismaService();
const jwtService = new JwtService();
const authService = new AuthService(prisma, jwtService);
const controller = new AuthController(authService);

// ✅ With DI (automatic):
@Module({
    providers: [AuthService, JwtService, PrismaService],
    controllers: [AuthController],
})
// NestJS automatically creates instances and injects them!
```

### **2. Module Imports/Exports**

**Imports**: "I need these modules"
- `AuthModule` imports `PrismaModule` to use `PrismaService`
- `AuthModule` imports `JwtModule` to use `JwtService`

**Exports**: "Other modules can use these"
- `AuthModule` exports `AuthService` so `SubscriptionModule` can use it
- `AuthModule` exports `JwtModule` so other modules can use JWT guards

### **3. Decorators (@Controller, @Post, @Body)**

**@Controller('api/auth')**
- Tells NestJS: "This class handles routes starting with `/api/auth`"

**@Post('login')**
- Tells NestJS: "This method handles `POST /api/auth/login`"

**@Body()**
- Extracts JSON from request body
- Validates using DTO class (LoginDto)

**@UseGuards(JwtAuthGuard)**
- Protects route - requires valid JWT token
- Runs before controller method

### **4. Frontend API Client Layers**

```
Frontend Component (LoginPage)
    ↓ calls
AuthContext.login()
    ↓ calls
apiClient.auth.login()
    ↓ calls
ApiClient.post()
    ↓ uses
axios (HTTP library)
    ↓ sends
HTTP Request to API
```

**Why Multiple Layers?**
- **Separation of concerns**: Each layer has a specific responsibility
- **Reusability**: API client can be used anywhere
- **Type safety**: TypeScript types flow through all layers
- **Automatic token handling**: Interceptor adds token to all requests

---

## 🎯 Real Example: Complete Login Flow

### Step-by-Step Code Execution

#### **Frontend:**

```typescript
// 1. User submits form (LoginPage.tsx)
const handleSubmit = async (e) => {
    await login(email, password);  // From useAuth() hook
}

// 2. AuthContext.login() (AuthContext.tsx)
const login = async (email: string, password: string) => {
    const response = await apiClient.auth.login({ email, password });
    setUser(response.user);
}

// 3. AuthApi.login() (packages/api-client/src/endpoints/auth.ts)
async login(dto: LoginDto): Promise<LoginResponse> {
    const response = await this.client.post('/api/auth/login', dto);
    this.client.setAuthToken(response.access_token);
    return response;
}

// 4. ApiClient.post() (packages/api-client/src/client.ts)
async post(url: string, data: unknown) {
    // Request interceptor adds token (none yet for login)
    const response = await this.axiosInstance.post(baseURL + url, data);
    return response.data;
}

// 5. HTTP Request (axios)
POST http://localhost:3001/api/auth/login
Content-Type: application/json
Body: { "email": "...", "password": "..." }
```

#### **Backend:**

```typescript
// 1. NestJS Router matches route
POST /api/auth/login → AuthController.login()

// 2. @Body() extracts and validates
const dto: LoginDto = { email: "...", password: "..." }

// 3. Dependency Injection provides AuthService
// NestJS automatically does: new AuthService(prisma, jwtService)

// 4. Controller calls service
await this.authService.login(dto);

// 5. Service business logic
async login(dto: LoginDto) {
    // Find user
    const user = await this.prisma.user.findUnique({...});
    
    // Validate password
    await bcrypt.compare(dto.password, user.password);
    
    // Generate token
    const token = this.jwtService.sign({ userId: user.id });
    
    return { access_token: token, user };
}

// 6. Controller returns response
return { success: true, access_token, user };

// 7. NestJS converts to JSON HTTP response
HTTP 200 OK
{ "success": true, "access_token": "...", "user": {...} }
```

---

## 🔐 How Protected Routes Work

### Example: Getting Subscription

#### **Frontend:**

```typescript
// 1. Component calls API (SubscriptionPage.tsx)
useEffect(() => {
    loadSubscription();
}, []);

const loadSubscription = async () => {
    const response = await apiClient.subscription.getSubscription();
    setSubscription(response.subscription);
}

// 2. API Client makes request
// Request interceptor automatically adds:
// Authorization: Bearer <token from localStorage>
```

#### **Backend:**

```typescript
// 1. JwtAuthGuard runs FIRST (before controller method)
@UseGuards(JwtAuthGuard)  // This runs before getSubscription()
@Get()
async getSubscription(@Request() req) {
    // At this point, req.user is already set by JwtAuthGuard!
    const userId = req.user.id;
    // ...
}

// 2. JwtAuthGuard process:
// - Extracts token from Authorization header
// - Calls JwtStrategy.validate(payload)
// - JwtStrategy verifies token and fetches user
// - Sets req.user = user object
// - Allows request to continue
```

---

## 📊 Module Dependency Graph

```
AppModule
  ├─ imports AuthModule
  │     ├─ imports PrismaModule (provides PrismaService)
  │     ├─ imports JwtModule (provides JwtService)
  │     ├─ controllers: AuthController
  │     ├─ providers: AuthService, JwtStrategy
  │     └─ exports: AuthService, JwtModule, PassportModule
  │
  └─ imports SubscriptionModule
        ├─ imports AuthModule (uses JwtAuthGuard)
        ├─ imports PrismaModule
        ├─ controllers: SubscriptionController
        └─ providers: SubscriptionService
```

**Key Point**: `SubscriptionModule` can use `JwtAuthGuard` because `AuthModule` exports `PassportModule` and `JwtModule`.

---

## 🎓 Summary

### **Backend Interaction:**
1. **Module** = Container that wires dependencies together
2. **Controller** = HTTP endpoints (receives requests, returns responses)
3. **Service** = Business logic (validates, processes data)
4. **Dependency Injection** = NestJS automatically provides dependencies

### **Frontend API Calls:**
1. **Component** = User interaction (form submit, button click)
2. **Context** = State management (calls API, stores user)
3. **API Client** = HTTP wrapper (makes requests, handles tokens)
4. **Axios** = HTTP library (sends actual HTTP requests)

### **Request Flow:**
```
React Component
    ↓
AuthContext
    ↓
API Client (AuthApi)
    ↓
Base ApiClient (HTTP)
    ↓
HTTP Request
    ↓
NestJS Router
    ↓
Controller
    ↓
Service
    ↓
Database / JWT
    ↓
Response
    ↓
Back through layers
    ↓
React updates
```

---

This architecture provides:
- ✅ **Separation of concerns**: Each layer has one job
- ✅ **Type safety**: TypeScript types throughout
- ✅ **Automatic token handling**: Interceptors add tokens automatically
- ✅ **Reusability**: API client can be used anywhere
- ✅ **Testability**: Easy to mock each layer

The key is **Dependency Injection** - NestJS automatically wires everything together based on the module configuration! 🎉
