-- Create RLS policy: users can only see their own rows
CREATE POLICY "Users can only access their own foo_bar records"
ON "foo_bar"
FOR ALL
USING (user_id = current_setting('app.current_user_id', true));