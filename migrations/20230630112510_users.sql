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
