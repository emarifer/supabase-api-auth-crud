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
