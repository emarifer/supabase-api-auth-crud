# Tasks Manager App

### Full Stack App covering Auth flow & CRUD with Nodejs and Supabase and Frontend Solidjs with TypeScript

To run the application, you must first install the dependencies and compile the code, both backend and frontend:

```bash
$ npm i && npm run build && cd client/ && npm i && npm run build && cd..  # or pnpm or yarn install (without «run»)
```

Secondly, you must add to the .env file the project credentials that you have created in Supabase.:

```bash
SUPABASE_URL_PROJECT=xxxx
SUPABASE_ANON_KEY=xxxx
```

Once the backend and frontend are created, you can start the server (production mode) which will start at http://localhost:4000 with the command:

```bash
$ npm run dev # or pnpm dev or yarn dev
```

In development mode, you must start the backend and frontend separately:

```bash
$ npm run dev # or pnpm dev or yarn dev

# (another terminal in root folder)
$ cd client/ && npm run dev
```

Obviously, it is necessary to have created a project in Supabase, as we said before, to add these credentials to our application. We must also create 2 tables in our database. For this we can create them manually with the requirements of our application or execute the migration files found in the "migrations" folder. Alternatively we can copy the content of these 2 files in the SQL Editor of our project in Supabase and execute the corresponding SQL query:

```bash
create table
  public.users (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    username text not null,
    email text not null,
    password text not null,
    constraint user_pkey primary key (id),
    constraint user_email_key unique (email)
  ) tablespace pg_default;

# (and then)

create table
  public.tasks (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    title text not null,
    completed boolean null default false,
    description text not null,
    user_id uuid not null,
    constraint task_pkey primary key (id),
    constraint task_user_id_fkey foreign key (user_id) references "user" (id)
  ) tablespace pg_default;
```

## Deployment

We can deploy our application to some service like [Render](https://render.com/), taking care to set the Supabase credentials as environment variables in Render. The command to build the application would be:

```bash
$ cd client/ && npm i && export VITE_API_URL=[THE_URL_YOU_HAVE_CHOSEN_IN_RENDER/api] && npm run build && cd .. && npm i && npm run build
```

And to start the server:

```bash
$ npm start
```
