# GitHub Copilot Instructions Template

This file contains generic guidelines and best practices for GitHub Copilot to assist with development. These instructions help Copilot understand coding standards, architectural patterns, and best practices that can be applied to any project.

---

## Development Guidelines

### Code Quality Standards

**General Rules:**
- **TypeScript:** Use TypeScript for all code; avoid `any` type when possible (use proper types)
- **Logging:** Implement proper logging at critical steps with descriptive messages
  - Use appropriate log levels: `log()`, `error()`, `warn()`, `debug()`
  - Always log service operations (create, update, delete, etc.)
- **Environment Variables:** Always use `.env` files; never hardcode configuration values
  - Access via appropriate configuration service in backend
  - Use build tool env variables in frontend (e.g., `import.meta.env` for Vite)
- **Constants:** Prefer enums and constants over hardcoded strings
  - Store enums in dedicated constants directories
  - Export enums for both backend and frontend use when applicable
- **Null Checks:** Always perform null/undefined checks where necessary
  - Return `null` from services when entity not found (not undefined)
  - Throw appropriate exceptions in controllers when necessary
- **File Organization:** Categorize files in appropriate folders
  - Backend: `controllers/`, `services/`, `entities/`, `dto/`, `guards/`, `decorators/`, `const/`, `types/`, `config/`, `migrations/`
  - Frontend: `pages/`, `components/`, `queries/`, `dtos/`, `auth/`, `values/`, `types/`, `hoc/`, `assets/`

**Naming Conventions:**
- **Backend:**
  - Entities: `user.entity.ts` (PascalCase class: `User`)
  - Services: `users.service.ts` (plural, PascalCase class: `UsersService`)
  - Controllers: `users.controller.ts` (plural, PascalCase class: `UsersController`)
  - DTOs: `user.dto.ts` (contains multiple DTO classes)
  - Enums: `user-role.enum.ts` (PascalCase enum: `UserRole`)
- **Frontend:**
  - Pages: `Dashboard.tsx` (PascalCase)
  - Components: `UserMenu.tsx` (PascalCase)
  - API queries: `users.ts` (plural, in `queries/api/`)
  - DTOs/Types: `users.ts` (plural, in `dtos/`)
  - Hooks: `use-custom-hook.tsx` (kebab-case with `use-` prefix)

**Entity & Database Rules:**
- All entities must have timestamp columns:
  - `@CreateDateColumn({ type: 'timestamptz' }) createdAt: Date;`
  - `@UpdateDateColumn({ type: 'timestamptz' }) updatedAt: Date;`
  - Optional: `@DeleteDateColumn({ type: 'timestamptz' }) deletedAt?: Date;` for soft delete
- Use UTC dates (`timestamptz`) for all timestamp fields
- Use ORM migrations for ALL schema changes (never synchronize in production)
- Entity relationships:
  - Use `@OneToMany`, `@ManyToOne`, `@OneToOne`, `@ManyToMany` decorators
  - Always specify both sides of relationships
  - Use `{ nullable: true }` when appropriate
- Column decorators:
  - Specify `type` explicitly: `@Column({ type: 'varchar' })`
  - Use `unique: true` for unique constraints
  - Use `default` values when appropriate: `@Column({ type: 'boolean', default: true })`
  - Use `nullable: true` for optional fields

**DTO Guidelines:**
- Each entity should have separate DTOs in the same file:
  - Read DTO (e.g., `UserDto`) - for API responses
  - Create DTO (e.g., `CreateUserDto`) - for POST endpoints
  - Update DTO (e.g., `UpdateUserDto`) - for PUT/PATCH endpoints
- All DTOs must use validation decorators from `class-validator`:
  - `@IsString()`, `@IsEmail()`, `@IsUUID()`, `@IsEnum()`, `@IsBoolean()`, etc.
  - `@IsOptional()` for optional fields
  - Combine validators: `@IsOptional() @IsString()`
- Use `class-transformer` for serialization
- Add static helper methods to DTOs:
  - `static fromEntity(entity: Entity): Dto` - convert entity to DTO
  - `static toEntity(dto: CreateDto | UpdateDto): Partial<Entity>` - convert DTO to entity
- Transform dates to ISO strings in DTOs: `createdAt: entity.createdAt?.toISOString()`

**API Design Guidelines:**
- All API endpoints should follow a consistent prefix pattern (e.g., `/api/`)
- RESTful conventions:
  - `GET /api/resources` - list all resources
  - `GET /api/resources/:id` - get single resource
  - `POST /api/resources` - create resource
  - `PUT /api/resources/:id` - update resource
  - `DELETE /api/resources/:id` - delete resource
- Use appropriate HTTP status codes:
  - 200 OK for successful GET, PUT
  - 201 Created for successful POST
  - 204 No Content for successful DELETE
  - 400 Bad Request for validation errors
  - 401 Unauthorized for auth failures
  - 403 Forbidden for permission issues
  - 404 Not Found for missing resources
  - 500 Internal Server Error for unexpected errors
- Return consistent response shapes:
  - Single resource: return DTO directly
  - List resources: return array of DTOs
  - Delete: return `{ deleted: true }`

**Error Handling:**
- **Backend:**
  - Use framework built-in exceptions (e.g., `NotFoundException`, `BadRequestException`, `ConflictException`, `InternalServerErrorException`, `ForbiddenException`)
  - Implement global exception filters to handle all errors consistently
  - Log errors before throwing: `this.logger.error('Error message', error);`
  - Never expose sensitive information in error messages
- **Frontend:**
  - Use UI framework notification system for user-facing errors
  - Handle errors in data fetching libraries with `onError` callbacks
  - Display user-friendly error messages (translate with i18n when applicable)

**Testing Requirements:**
- For new features, add relevant unit tests and e2e tests
- **Backend tests:**
  - Unit tests: organize in `test/unit/` directory
  - E2E tests: organize in `test/e2e/` directory
  - Use testing framework utilities (e.g., `@nestjs/testing` for NestJS)
  - Mock repositories and external dependencies
  - Test structure:
    ```typescript
    describe('ServiceName', () => {
      let service: ServiceName;
      let repo: Repository<Entity>;
      
      beforeEach(async () => {
        const module = await Test.createTestingModule({...}).compile();
        service = module.get<ServiceName>(ServiceName);
      });
      
      it('should ...', async () => {...});
    });
    ```
- **Frontend tests:** Follow existing test patterns and conventions

**Development Workflow:**
- Prioritize code writing and implementation
- Only ask for confirmation when critical decisions are needed (e.g., major architectural changes)
- Make surgical, minimal changes when fixing issues
- Always run linters and tests before committing

---

## Backend-Specific Guidelines

### Controller Patterns

**Structure:**
```typescript
@Controller('api/resource')  // Route prefix
export class ResourceController {
  private readonly logger = new Logger(ResourceController.name);
  
  constructor(
    private readonly resourceService: ResourceService,
  ) {}
  
  @Get()
  async findAll() {
    const items = await this.resourceService.findAll();
    return items.map(ResourceDto.fromEntity);
  }
  
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const item = await this.resourceService.findOne(id);
    if (!item) {
      throw new NotFoundException(`Resource with id ${id} not found`);
    }
    return ResourceDto.fromEntity(item);
  }
  
  @Post()
  async create(@Body() dto: CreateResourceDto) {
    const entity = ResourceDto.toEntity(dto);
    const item = await this.resourceService.create(entity);
    return ResourceDto.fromEntity(item);
  }
}
```

**Best Practices:**
- Apply appropriate guards at controller or method level for authentication/authorization
- Use decorators for role-based access control when applicable
- Extract user from request when needed using framework-specific patterns
- Convert entities to DTOs before returning: `return Dto.fromEntity(entity)`
- Throw appropriate exceptions (NotFoundException, BadRequestException, etc.)
- Log important operations

### Service Patterns

**Structure:**
```typescript
@Injectable()
export class ResourceService {
  private readonly logger = new Logger(ResourceService.name);
  
  constructor(
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,
  ) {}
  
  async findAll(): Promise<Resource[]> {
    this.logger.log('Fetching all resources');
    return this.resourceRepository.find();
  }
  
  async findOne(id: string): Promise<Resource | null> {
    this.logger.log(`Fetching resource with id ${id}`);
    return this.resourceRepository.findOne({ where: { id } });
  }
  
  async create(entity: Partial<Resource>): Promise<Resource> {
    this.logger.log('Creating new resource');
    return this.resourceRepository.save(entity);
  }
  
  async update(id: string, entity: Partial<Resource>): Promise<Resource | null> {
    this.logger.log(`Updating resource with id ${id}`);
    await this.resourceRepository.update(id, entity);
    return this.findOne(id);
  }
  
  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting resource with id ${id}`);
    await this.resourceRepository.delete(id);
  }
}
```

**Best Practices:**
- Use `@Injectable()` decorator
- Inject repositories with appropriate decorators (e.g., `@InjectRepository(Entity)`)
- Return `Promise<Entity | null>` (not undefined) for single entity queries
- Log all operations with descriptive messages
- Keep business logic in services, not controllers
- Use transactions for complex operations involving multiple entities

### Database Migrations

**Workflow:**
1. Make entity changes in entities directory
2. Generate migration: `npm run migration:generate src/migrations/DescriptiveName`
3. Review generated migration file
4. Test migration: `npm run migration:run`
5. If issues, revert: `npm run migration:revert`
6. Commit migration file with entity changes

**Migration Best Practices:**
- Never edit existing migration files
- Always test migrations in development first
- Use descriptive names (e.g., `AddEmailVerified`, `CreateUserTable`)
- Include both `up()` and `down()` methods
- Backup database before running migrations in production

---

## Frontend-Specific Guidelines

### Page Component Patterns

**Structure:**
```typescript
import { Container, Title } from '@ui-library/core';
import { useTranslation } from 'react-i18next';

const PageName: React.FC = () => {
  const { t } = useTranslation();
  const { data } = useGetData();
  
  return (
    <Container size="sm" py="xl">
      <Title>{t('page.title')}</Title>
      {/* Page content */}
    </Container>
  );
};

export default PageName;
```

**Best Practices:**
- Use Higher-Order Components (HOCs) for cross-cutting concerns (auth, permissions, etc.)
- Always use i18n hooks for user-facing text
- Use UI library components for consistency
- Keep pages focused on layout, delegate logic to hooks and components

### Component Patterns

**Component Structure:**
```typescript
import { Button, Text } from '@ui-library/core';
import { useTranslation } from 'react-i18next';

interface ComponentProps {
  title: string;
  onAction?: () => void;
}

export const ComponentName: React.FC<ComponentProps> = ({ title, onAction }) => {
  const { t } = useTranslation();
  
  return (
    <div>
      <Text>{title}</Text>
      {onAction && (
        <Button onClick={onAction}>{t('common.action')}</Button>
      )}
    </div>
  );
};
```

**Best Practices:**
- Export components with named exports or default exports consistently
- Use TypeScript interfaces for props
- Use optional props with `?` for non-required props
- Use UI library components for consistency
- Keep components small and focused

### API Integration with Data Fetching Library

**Query Hooks Pattern:**
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useHttpClient } from '../../auth/hooks/use-http-client';
import type { ResourceDto } from '../../dtos/resources';

// Query hook
export const useGetResource = (id?: string) => {
  const { httpClient } = useHttpClient();
  
  return useQuery({
    queryKey: ['resource', id],
    queryFn: () => httpClient.get<ResourceDto>(`/resources/${id}`).then(res => res.data),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Mutation hook
export const useCreateResource = () => {
  const { httpClient } = useHttpClient();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateResourceDto) =>
      httpClient.post<ResourceDto>('/resources', data).then(res => res.data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['resource'] });
    },
  });
};
```

**Data Fetching Best Practices:**
- Always use authenticated HTTP client hook for protected requests
- Structure query keys hierarchically: `['entity', ...identifiers]` (e.g., `['user', userId]`)
- Set appropriate `staleTime` for caching (10 minutes for relatively static data)
- Use `enabled` option to conditionally run queries
- Invalidate queries after mutations with `queryClient.invalidateQueries()`
- Extract HTTP response data appropriately: `.then(res => res.data)`
- Use proper TypeScript types for responses

### Form Management

**Form Pattern:**
```typescript
import { useForm } from '@form-library/core';
import { TextInput, Button } from '@ui-library/core';

const FormComponent = () => {
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Name too short' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });
  
  const { mutate: createResource } = useCreateResource();
  
  const handleSubmit = (values: typeof form.values) => {
    createResource(values);
  };
  
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        label="Name"
        {...form.getInputProps('name')}
      />
      <TextInput
        label="Email"
        type="email"
        {...form.getInputProps('email')}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};
```

**Best Practices:**
- Use form library for form state management
- Define validation rules in form configuration
- Use form library helpers to bind inputs to form state
- Use form submission wrapper for form handling
- Integrate with data fetching mutations for API calls

### Internationalization

**i18n Usage:**
```typescript
import { useTranslation } from 'react-i18next';

const Component = () => {
  const { t, i18n } = useTranslation();
  
  return (
    <div>
      <h1>{t('page.title')}</h1>
      <p>{t('page.description', { name: 'John' })}</p>
      <button onClick={() => i18n.changeLanguage('fr')}>
        {t('common.french')}
      </button>
    </div>
  );
};
```

**Best Practices:**
- Always use `t()` function for user-facing text
- Organize translation keys hierarchically: `page.section.key`
- Store translations in organized directory structure
- Use interpolation for dynamic values: `t('key', { variable })`

### Routing

**Route Configuration:**
```typescript
// src/routes/index.tsx
export const ROUTES_NAME = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings',
  // ... other routes
};
```

**Best Practices:**
- Define all route paths in constants
- Use routing library for navigation
- Use Link components for declarative navigation
- Use navigation hooks for programmatic navigation

### UI/UX Requirements

- Use modern, efficient design patterns
- Ensure the app is intuitive and easy to use
- Leverage UI library components for consistency
- Follow responsive design principles
- Use theme system for colors, spacing, and typography
- Utilize notification system for user feedback
- Use proper loading states with loader components
- Implement proper error boundaries for error handling

### Frontend Technical Guidelines

- **UI Library:** Use chosen UI library components consistently
  - Common components: `Container`, `Title`, `Text`, `Button`, `TextInput`, `Select`, `Paper`, `Modal`, `Notification`
  - Use library-specific hooks when available
- **Data Fetching:** Use data fetching library (e.g., TanStack React Query) for all API queries and mutations
  - Queries: for GET requests
  - Mutations: for POST/PUT/DELETE requests
  - Query invalidation: invalidate after mutations
- **Code Reusability:** Create reusable components for repeated logic
  - Store in `components/` directory
  - Use proper TypeScript interfaces for props
- **Services:** Use custom hooks for API communication
  - Use authenticated HTTP client hook for protected requests
  - Return query/mutation hooks from these files
- **Folder Structure:** Maintain clear separation
  - `pages/` - Page components (routed)
  - `components/` - Reusable UI components
  - `queries/api/` - Data fetching hooks for API calls
  - `dtos/` - TypeScript types/interfaces
  - `values/` - Constants and enums
  - `auth/` - Authentication logic
  - `hoc/` - Higher-order components
  - `assets/` - Static files (images, fonts, styles)
- **Internationalization:** Support multiple languages using i18n library
  - Use translation hooks in all components
  - Never hardcode user-facing text
- **Routing:** Use routing library for navigation
  - Define routes in constants
  - Use Link components for declarative navigation
  - Use navigation hooks for programmatic navigation
- **Form Management:** Use form library for form handling and validation
  - Define validation rules in form config
  - Use form library helpers to bind inputs

---

## Common Patterns & Best Practices

### API Communication

**Backend:**
- Controllers return DTOs directly (no wrapper objects)
- Use proper HTTP status codes
- Validate request bodies with validation decorators
- Transform entities to DTOs before returning

**Frontend:**
- Use HTTP client via authenticated hook for protected requests
- Wrap API calls in data fetching hooks
- Handle errors gracefully with user-friendly messages
- Use proper TypeScript types for request/response objects
- Cache responses with appropriate `staleTime`

### Authentication

**Backend:**
- Use authentication library with JWT tokens
- Validate tokens with authentication middleware
- Use decorators for role-based access control
- Store user identifiers appropriately in database

**Frontend:**
- Use authentication library with secure flows (e.g., PKCE for OAuth)
- Store tokens securely (httpOnly cookies or secure storage)
- Implement proper token refresh logic
- Protect routes with appropriate HOCs or guards
- Include auth token in all API requests via authenticated HTTP client

### State Management

**Server State:**
- Use data fetching library for all server state (API data)
- Cache with appropriate `staleTime`
- Invalidate queries after mutations

**Local State:**
- Use framework hooks (`useState`, `useReducer`) for local component state
- Use context (`useContext`) for shared state across components
- Avoid prop drilling with context when appropriate

**Form State:**
- Use form library for form state management
- Keep form state local to form components

### Code Style

- Follow existing linter and formatter configurations
- Use meaningful variable and function names (camelCase for variables, PascalCase for components/classes)
- Keep functions small and focused (single responsibility)
- Add comments only when necessary to explain complex logic
- Use TypeScript for all code (avoid `any` type)
- Prefer `const` over `let`, avoid `var`
- Use arrow functions for callbacks and simple functions
- Use async/await instead of Promise chains

### Validation & Error Handling

**Backend Validation:**
```typescript
// DTO with validation
export class CreateUserDto {
  @IsEmail()
  email: string;
  
  @IsString()
  @Length(2, 50)
  name: string;
  
  @IsEnum(UserRole)
  role: UserRole;
}
```

**Frontend Validation:**
```typescript
// Form validation
const form = useForm({
  initialValues: { email: '', name: '' },
  validate: {
    email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    name: (value) => (value.length < 2 ? 'Too short' : null),
  },
});
```

**Error Display:**
```typescript
// Using notification system
import { notifications } from '@ui-library/notifications';

const { mutate } = useCreateResource({
  onError: (error) => {
    notifications.show({
      title: 'Error',
      message: error.message || 'Something went wrong',
      color: 'red',
    });
  },
  onSuccess: () => {
    notifications.show({
      title: 'Success',
      message: 'Resource created successfully',
      color: 'green',
    });
  },
});
```

---

## Implementation Scenarios

### Adding a New Entity (Complete Workflow)

**Backend Steps:**

1. **Create Entity** (`src/entities/resource.entity.ts`):
```typescript
@Entity({ name: 'resources' })
export class Resource {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @ManyToOne(() => User, (user) => user.resources)
  user: User;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
```

2. **Create DTOs** (`src/dto/resource.dto.ts`):
```typescript
export class CreateResourceDto {
  @IsString()
  name: string;
}

export class UpdateResourceDto {
  @IsOptional()
  @IsString()
  name?: string;
}

export class ResourceDto {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;

  static fromEntity = (entity: Resource): ResourceDto => ({
    id: entity.id,
    name: entity.name,
    createdAt: entity.createdAt?.toISOString(),
    updatedAt: entity.updatedAt?.toISOString(),
  });

  static toEntity = (dto: CreateResourceDto | UpdateResourceDto): Partial<Resource> => ({
    ...dto,
  });
}
```

3. **Create Service** (`src/services/resources.service.ts`):
```typescript
@Injectable()
export class ResourcesService {
  private readonly logger = new Logger(ResourcesService.name);

  constructor(
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,
  ) {}

  async findAll(): Promise<Resource[]> {
    this.logger.log('Fetching all resources');
    return this.resourceRepository.find();
  }

  async findOne(id: string): Promise<Resource | null> {
    this.logger.log(`Fetching resource with id ${id}`);
    return this.resourceRepository.findOne({ where: { id } });
  }

  async create(entity: Partial<Resource>): Promise<Resource> {
    this.logger.log('Creating new resource');
    return this.resourceRepository.save(entity);
  }

  async update(id: string, entity: Partial<Resource>): Promise<Resource | null> {
    this.logger.log(`Updating resource with id ${id}`);
    await this.resourceRepository.update(id, entity);
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting resource with id ${id}`);
    await this.resourceRepository.delete(id);
  }
}
```

4. **Create Controller** (`src/controllers/resources.controller.ts`):
```typescript
@Controller('api/resources')
export class ResourcesController {
  private readonly logger = new Logger(ResourcesController.name);

  constructor(private readonly resourcesService: ResourcesService) {}

  @Get()
  async findAll() {
    const resources = await this.resourcesService.findAll();
    return resources.map(ResourceDto.fromEntity);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const resource = await this.resourcesService.findOne(id);
    if (!resource) {
      throw new NotFoundException(`Resource with id ${id} not found`);
    }
    return ResourceDto.fromEntity(resource);
  }

  @Post()
  async create(@Body() dto: CreateResourceDto) {
    const entity = ResourceDto.toEntity(dto);
    const resource = await this.resourcesService.create(entity);
    return ResourceDto.fromEntity(resource);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateResourceDto) {
    const entity = ResourceDto.toEntity(dto);
    const resource = await this.resourcesService.update(id, entity);
    if (!resource) {
      throw new NotFoundException(`Resource with id ${id} not found`);
    }
    return ResourceDto.fromEntity(resource);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.resourcesService.delete(id);
    return { deleted: true };
  }
}
```

5. **Generate Migration**:
```bash
npm run migration:generate src/migrations/CreateResourceTable
npm run migration:run
```

6. **Register in Module**:
```typescript
@Module({
  imports: [
    TypeOrmModule.forFeature([Resource, ...]),
    // ...
  ],
  controllers: [ResourcesController, ...],
  providers: [ResourcesService, ...],
})
export class AppModule {}
```

7. **Add Tests** (unit tests and e2e tests).

**Frontend Steps:**

1. **Create DTOs** (`src/dtos/resources.ts`):
```typescript
export interface ResourceDto {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResourceDto {
  name: string;
}

export interface UpdateResourceDto {
  name?: string;
}
```

2. **Create API Hooks** (`src/queries/api/resources.ts`):
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useHttpClient } from '../../auth/hooks/use-http-client';
import type { ResourceDto, CreateResourceDto, UpdateResourceDto } from '../../dtos/resources';

export const useGetResources = () => {
  const { httpClient } = useHttpClient();
  return useQuery({
    queryKey: ['resources'],
    queryFn: () => httpClient.get<ResourceDto[]>('/resources').then(res => res.data),
    staleTime: 10 * 60 * 1000,
  });
};

export const useGetResource = (id?: string) => {
  const { httpClient } = useHttpClient();
  return useQuery({
    queryKey: ['resource', id],
    queryFn: () => httpClient.get<ResourceDto>(`/resources/${id}`).then(res => res.data),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreateResource = () => {
  const { httpClient } = useHttpClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateResourceDto) =>
      httpClient.post<ResourceDto>('/resources', data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
};

export const useUpdateResource = () => {
  const { httpClient } = useHttpClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateResourceDto }) =>
      httpClient.put<ResourceDto>(`/resources/${id}`, data).then(res => res.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      queryClient.invalidateQueries({ queryKey: ['resource', variables.id] });
    },
  });
};

export const useDeleteResource = () => {
  const { httpClient } = useHttpClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      httpClient.delete(`/resources/${id}`).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
};
```

3. **Create Components/Pages** as needed using these hooks.

### Adding a New Enum

**Backend** (`src/const/status.enum.ts`):
```typescript
export enum Status {
  Active = 'active',
  Inactive = 'inactive',
  Pending = 'pending',
}
```

**Frontend** (`src/values/status.ts`):
```typescript
export enum Status {
  Active = 'active',
  Inactive = 'inactive',
  Pending = 'pending',
}

// Translation keys (if using i18n)
export const STATUS_LABELS = {
  [Status.Active]: 'status.active',
  [Status.Inactive]: 'status.inactive',
  [Status.Pending]: 'status.pending',
};
```

### Adding Role-Based Access

**Backend:**
```typescript
@Roles(UserRole.Admin, UserRole.Moderator)
@Get('admin-only')
async adminOnly() {
  // Only users with specified roles can access
}
```

**Frontend:**
```typescript
const { data: user } = useGetCurrentUser();

// Conditional rendering based on role
{user?.role === 'admin' && (
  <Button>Admin Action</Button>
)}
```

### Adding a New Page

1. **Create Page Component** (`src/pages/ResourceList.tsx`):
```typescript
import { Container, Title } from '@ui-library/core';
import { useTranslation } from 'react-i18next';
import { useGetResources } from '../queries/api/resources';

const ResourceList: React.FC = () => {
  const { t } = useTranslation();
  const { data: resources, isLoading } = useGetResources();

  if (isLoading) return <div>Loading...</div>;

  return (
    <Container size="lg" py="xl">
      <Title>{t('resources.title')}</Title>
      {resources?.map(resource => (
        <div key={resource.id}>{resource.name}</div>
      ))}
    </Container>
  );
};

export default ResourceList;
```

2. **Add Route** (in main routing configuration):
```typescript
export const ROUTES_NAME = {
  // ...
  RESOURCES: '/resources',
};

// In router
<Route path={ROUTES_NAME.RESOURCES} element={<ResourceList />} />
```

3. **Add Translations** (if using i18n):
```json
{
  "resources": {
    "title": "Resources",
    "create": "Create Resource"
  }
}
```

---

## Quick Reference

### Common ORM Patterns

**Find with relations:**
```typescript
this.repository.findOne({
  where: { id },
  relations: ['user', 'items'],
});
```

**Query builder:**
```typescript
this.repository
  .createQueryBuilder('resource')
  .leftJoinAndSelect('resource.user', 'user')
  .where('resource.status = :status', { status: 'active' })
  .getMany();
```

**Transactions:**
```typescript
await this.dataSource.transaction(async (manager) => {
  await manager.save(entity1);
  await manager.save(entity2);
});
```

### Common Data Fetching Patterns

**Dependent queries:**
```typescript
const { data: user } = useGetUser(userId);
const { data: resources } = useGetUserResources(user?.id); // Only runs if user exists
```

**Optimistic updates:**
```typescript
const { mutate } = useMutation({
  mutationFn: updateResource,
  onMutate: async (newData) => {
    await queryClient.cancelQueries({ queryKey: ['resource', id] });
    const previousData = queryClient.getQueryData(['resource', id]);
    queryClient.setQueryData(['resource', id], newData);
    return { previousData };
  },
  onError: (err, newData, context) => {
    queryClient.setQueryData(['resource', id], context.previousData);
  },
});
```

### Common UI Patterns

**Modal with state management:**
```typescript
const [opened, setOpened] = useState(false);

<Button onClick={() => setOpened(true)}>Open Modal</Button>
<Modal opened={opened} onClose={() => setOpened(false)} title="Title">
  {/* Content */}
</Modal>
```

**Notifications:**
```typescript
import { notifications } from '@ui-library/notifications';

notifications.show({
  title: 'Success',
  message: 'Operation completed',
  color: 'green',
});
```

---

## Notes

- Always refer to existing code patterns when implementing new features
- Prioritize code quality, security, and user experience
- Keep functions and components focused on single responsibility
- Write testable code with clear separation of concerns
- Document complex logic with clear comments
- Follow the principle of least surprise in API design