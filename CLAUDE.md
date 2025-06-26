# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Standard Workflow
1. First think through the problem, read the codebase for relevant files, and write a plan to todo.md.
2. The plan should have a list of todo items that you can check off as you complete them
3. Before you begin working, check in with me and I will verify the plan.
4. Then, begin working on the todo items, marking them as complete as you go.
5. Please every step of the way just give me a high level explanation of what changes you made
6. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.
7. Finally, add a review section to the todo.md file with a summary of the changes you made and any other relevant information.

## Before Creating a code always check the following standard
•	Verify if there is any problematic code.
•	Check for any duplicated logic.
•	Ensure the code follows the coding guidelines.
•	Confirm there is no unnecessarily fat or bloated code.


## Development Commands

### Core Commands
- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database Commands
- `docker-compose up -d` - Start PostgreSQL database and pgAdmin
- `npx prisma migrate dev` - Apply database migrations
- `npx prisma generate` - Generate Prisma client
- `npx prisma studio` - Open database GUI

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **UI**: Material-UI (MUI) with custom theme
- **Deployment**: Docker for local development

### Database Schema
- **User model**: id (UUID), email (unique), name (optional), timestamps
- **Course model**: id (UUID), title, description (optional), timestamps  
- **Many-to-many relationship**: Users can be enrolled in multiple courses

### Key Architecture Patterns

**Prisma Configuration**
- Custom client output path: `src/generated/prisma`
- Global singleton pattern for database connection in `src/lib/prisma.ts`
- Connection pooling handled automatically

**API Routes** (`src/app/api/users/route.ts`)
- RESTful endpoints for user CRUD operations
- Error handling with proper HTTP status codes
- Direct Prisma integration for database operations

**Component Architecture**
- Client-side state management with React hooks
- Custom hook `useUserTable` for table logic (search, pagination)
- Material-UI components with custom theme in `src/theme.ts`
- Global theme provider via `ClientThemeProvider`

**Data Flow**
- Frontend components fetch data from API routes
- API routes interact directly with Prisma client
- Real-time updates via local state refresh pattern
- Optimistic UI updates with error handling

### Development Environment
- Docker Compose provides PostgreSQL (port 5432) and pgAdmin (port 5050)
- TypeScript with strict configuration
- Path aliases: `@/*` maps to `src/*`
- Hot reload enabled for development

### Database Connection
Set `DATABASE_URL` environment variable to connect to PostgreSQL. Local development uses Docker Compose configuration with default credentials.

## Coding Rules

### Implement logic into hooks

Even if the logic is small now, it may become fat in the future.
Therefore, please implement your logic in hooks to prevent component fattening.

### Naming Rule

no good

```typescript
const save = (i: TestamentForm, u: User) => {
```

good

```typescript
const save = (testamentForm: TestamentForm, user: User) => {
```

- When the program code becomes complex, omitting variable names makes it difficult to understand the meaning.
- On the other hand, if omission is allowed, it is necessary to determine the rules for omission.
- It is more costly to create and memorize such rules.

### Don't use anonymous function

The following code is difficult to understand the purpose.

```typescript
useEffect(() => {
  // doSomething
}, []);

useEffect(() => {
  setName('a');
}, [foo, bar]);
```

However, if we do not use the anonymous function, the purpose is easier to understand.

```typescript
const onDidMount = () => {
  // doSomething
}

const setupName = () => {
  setName('a');
}
useEffect(onDidMount, []);
useEffect(setupName, [foo, bar]);
```

### Do not define internally

No good

```js
useEffect(function noDefaultSuspenionItem() {
  !defaultNormalSuspension && (setIsTopDataCheck(true), setNormalSuspension(true))
}, [defaultNormalSuspension])
```

Good

```js
const noDefaultSuspenionItem = () => {
  !defaultNormalSuspension && (setIsTopDataCheck(true), setNormalSuspension(true));
}
useEffect(noDefaultSuspenionItem, [defaultNormalSuspension]);
```

If you define it internally, other code will not be able to execute the function

### Line breaks in property settings

```
<Resource name="brands" options={{label: 'ブランド管理'}} create={BrandsCreate} edit={BrandsEdit}
                      list={BrandsList}/>
```

↓

```
<Resource
  name="brands"
  options={{label: 'ブランド管理'}}
  create={BrandsCreate}
  edit={BrandsEdit}
  list={BrandsList}
/>
```

This is less likely to cause conflicts, and it is easier to see what was modified when looking at the changelog later.

### Don't use magic number

No good

```
pagination: {page: 1, perPage: 10000},
```

Good

```
pagination: {page: 1, perPage: MAX_FETCH_DATA_SIZE},
```

This will allow for only one modification when changing the maximum number of data to be fetched later.

### use trailing commas

No good

```typescript
const {
  a,
  b
} = useFoo();
```

Good

```typescript
const {
  a,
  b,
} = useFoo();
```

This is to make it easier to see what has been added when diffing.

### async map needs Promise.all

No good

```js
variantItems?.map(async (item: any) => {
  // do something
});
```

Good

```js
variantItems && await Promise.all(variantItems.map(async (item: any) => {
  // do something
}));
```

map must be wrapped in Promise.all to not wait for asynchronous processing

### Use then as little as possible

Sometimes you need multiple actions inside single functions, some of them may be asynchronous and some may be synchronous. Let's say you have following code with promises.

```typescript

getUser().then(user => {
  getOrders({
    user: user
  }).then(orders => {
    console.log(orders)
  })
})
```

now what if you want orders to be fetched only if a condition is true, but let further code run as it is, then if you are using promises, you have to create a separate function and then call that function like this

```typescript
function logOrders(orders) {
  console.log(orders)
}


getUser().then(user => {
  if (user.hasOrders) {
    getOrders({
      user: user
    }).then(logOrders)
  } else {
    logOrders([])
  }
})
```

but using async/await you can do it like this

```typescript
(async () => {

  const user = await getUser();
  let orders = [];

  if (user.hasOrders) {
    orders = await getOrders({
      user: user
    })
  }

  console.log(orders)

})()
```

### Avoid using window.location.reload as much as possible

Please find a way to initialize the screen content as much as possible without using window.location.reload
Using window.location.reload means that the SPA advantage is lost