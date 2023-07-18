-- Public users table to store additional user data besides what's in auth.users
-- This is Supabase's recommended approach for storing and accessing additional user data
-- as auth.users is not directly accessible via the auto-generated API for security reasons
-- More info: https://supabase.com/docs/guides/auth/managing-user-data#creating-user-tables

-- NOTE: Unfortunately this table is conventionally named "profiles" which could get confusing
-- if we call the user prompts "profiles" as well. Calling this "prompts" for the purposes of
-- the database and we can still refer to them as "profiles" in the UI.
-- https://dev.to/sruhleder/creating-user-profiles-on-sign-up-in-supabase-5037

create table "public"."profiles" (
    id uuid primary key references auth.users on delete cascade,
    prompts jsonb DEFAULT '{}' :: jsonb
);

alter table
    public.profiles enable row level security;

create policy "Allow full access to own user data" on public.profiles as permissive for all to authenticated using ((auth.uid() = id)) with check ((auth.uid() = id));


-- Function to create a new profile record whenever a new auth.user record is created
-- Copies the user's full name and username from the raw_user_meta_data jsob field
-- Initializes the prompts field to an empty object with a "default" key
create or replace function public.create_profile_for_new_user()
returns trigger as
$$
begin
    insert into public.profile (id, display_name, username, prompts)
    values (
        new.id,
        '{"default": ""}'
    );
    return new;
end;
$$ language plpgsql security definer;

-- Trigger to trigger the function above
create trigger trigger_create_profile
after insert on auth.users
for each row
execute function public.create_profile_for_new_user();

-- Contents of auth.users.raw_user_meta_data
-- {"iss":"https://api.github.com","sub":"882952","name":"Sean Oliver","email":"helloseanoliver@gmail.com","full_name":"Sean Oliver","user_name":"seanoliver","avatar_url":"https://avatars.githubusercontent.com/u/882952?v=4","provider_id":"882952","email_verified":true,"preferred_username":"seanoliver"}