ALTER TABLE prompts
  ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN updated_at TIMESTAMPTZ NULL,
  ADD COLUMN deleted_at TIMESTAMPTZ NULL,
  ADD COLUMN emoji TEXT NULL;

create trigger handle_updated_at before update on prompts 
  for each row execute procedure moddatetime (updated_at);