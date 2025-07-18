# GreenMinds Gestión de Tareas - Documentación del Backend

## Descripción General

Este es un backend completo para la aplicación de gestión de tareas GreenMinds construido con Next.js API Routes, Supabase (PostgreSQL) y TypeScript.

## Stack Tecnológico

- **Framework**: Next.js API Routes
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Almacenamiento de Archivos**: Supabase Storage
- **Validación**: Zod
- **TypeScript**: Completamente tipado

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Optional: For email notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Optional: For file uploads
MAX_FILE_SIZE=10485760  # 10MB in bytes
```

### 2. Database Setup

1. Create a new Supabase project
2. Run the SQL from `database-schema.sql` in your Supabase SQL Editor
3. Enable Row Level Security (RLS) policies are included in the schema

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Development Server

```bash
npm run dev
```

## API Endpoints

### Authentication

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/register` | Register new user |
| POST   | `/api/auth/login`    | Login user        |
| POST   | `/api/auth/logout`   | Logout user       |
| GET    | `/api/auth/me`       | Restore session   |

### Users

| Method | Endpoint                    | Description              |
| ------ | --------------------------- | ------------------------ |
| GET    | `/api/user/profile`         | Get current user profile |
| PUT    | `/api/user/profile`         | Update user profile      |
| GET    | `/api/users/search?q=query` | Search users             |

### Projects

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| GET    | `/api/projects`      | Get user's projects |
| POST   | `/api/projects`      | Create new project  |
| GET    | `/api/projects/[id]` | Get project details |
| PUT    | `/api/projects/[id]` | Update project      |
| DELETE | `/api/projects/[id]` | Delete project      |

### Project Members

| Method | Endpoint                          | Description             |
| ------ | --------------------------------- | ----------------------- |
| GET    | `/api/projects/[id]/members`      | Get project members     |
| POST   | `/api/projects/[id]/members`      | Add new user to project |

### Tasks

| Method | Endpoint                          | Description             |
| ------ | --------------------------------- | ----------------------- |
| GET    | `/api/projects/[id]/tasks`        | Get project tasks       |
| POST   | `/api/projects/[id]/tasks`        | Create new task         |
| GET    | `/api/projects/[id]/[taskId]`     | Get task details        |
| PUT    | `/api/projects/[id]/[taskId]`     | Update task             |
| DELETE | `/api/projects/[id]/[taskId]`     | Delete task             |
| GET    | `/api/tasks/[taskId]/assignments` | Get task assignments    |
| POST   | `/api/tasks/[taskId]/assignments` | Assign user to task     |
| DELETE | `/api/tasks/[taskId]/assignments` | Unassign user from task |

### Dashboard

| Method | Endpoint               | Description              |
| ------ | ---------------------- | ------------------------ |
| GET    | `/api/dashboard/stats` | Get dashboard statistics |

## Authentication

All API routes (except auth routes) require a Bearer token in the Authorization header:

```javascript
const response = await fetch("/api/projects", {
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  },
});
```

## Request/Response Examples

### Register User

```javascript
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "username": "johndoe"
}
```

### Create Project

```javascript
POST /api/projects
Authorization: Bearer your-token-here
{
  "name": "Mi Proyecto",
  "description": "Descripción del proyecto",
  "end_date": "2024-12-31T23:59:59Z"
}
```

### Create Task

```javascript
POST /api/projects/project-id/tasks
Authorization: Bearer your-token-here
{
  "title": "Nueva Tarea",
  "description": "Descripción de la tarea",
  "priority": "high",
  "due_date": "2024-01-15T10:00:00Z",
  "estimated_hours": 8,
  "assigned_users": ["user-id-1", "user-id-2"]
}
```

## Error Handling

All API endpoints return standardized error responses:

```javascript
{
  "error": "Error message here"
}
```

Common HTTP status codes:

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Route Protection

### Middleware Functions

1. **`withAuth`**: Verifies JWT token and attaches user to request
2. **`withProjectAccess`**: Ensures user has access to the project
3. **`withProjectAdmin`**: Ensures user is project manager or admin

### Usage Example

```typescript
// pages/api/projects/[id].ts
import { withProjectAccess } from "@/utils/auth";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  // Handler logic here
  // req.user is available and project access is verified
}

export default withErrorHandler(withProjectAccess(handler));
```

## Database Schema

### Key Tables

- **profiles**: User information
- **projects**: Project details
- **project_members**: Project membership
- **tasks**: Task information
- **task_assignments**: Task assignments
- **task_comments**: Task comments
- **file_attachments**: File uploads

### Relationships

- Users can manage multiple projects
- Users can be members of multiple projects
- Projects can have multiple tasks
- Tasks can be assigned to multiple users
- Tasks can have multiple comments and attachments

## Security Features

1. **Row Level Security (RLS)**: Database-level access control
2. **JWT Authentication**: Secure token-based authentication
3. **Input Validation**: Zod schema validation on all inputs
4. **Project-based Authorization**: Users can only access their projects
5. **Role-based Permissions**: Different permissions for project managers and members

## Development Tips

1. **Type Safety**: All database operations are fully typed
2. **Error Handling**: Use the `withErrorHandler` wrapper for consistent error responses
3. **Validation**: Always validate input with Zod schemas
4. **Testing**: Test API routes with tools like Postman or Insomnia

## File Structure

```
pages/api/
  auth/
    login.ts
    register.ts
    logout.ts
  projects/
    index.ts
    [id].ts
    [projectId]/
      tasks/
        index.ts
  tasks/
    [taskId].ts
    [taskId]/
      assignments.ts
  user/
    profile.ts
  users/
    search.ts
  dashboard/
    stats.ts

services/
  userService.ts
  projectService.ts
  taskService.ts

utils/
  api.ts
  auth.ts

validators/
  schemas.ts

types/
  database.ts

lib/
  supabase.ts
```

## Next Steps

1. **File Uploads**: Implement Supabase Storage for file attachments
2. **Real-time Updates**: Add Supabase Realtime for live updates
3. **Email Notifications**: Implement email notifications for task assignments
4. **Webhooks**: Add webhook support for external integrations
5. **Analytics**: Add detailed analytics and reporting
6. **Mobile API**: Optimize API for mobile applications

## Support

For questions or issues, please refer to:

- Supabase Documentation: https://supabase.com/docs
- Next.js API Routes: https://nextjs.org/docs/api-routes/introduction
- Zod Validation: https://github.com/colinhacks/zod
