-- Create RLS policy for insert
CREATE POLICY "Users can only insert their own foo_bar records"
ON "foo_bar"
FOR INSERT
WITH CHECK (user_id = current_setting('app.current_user_id', true));