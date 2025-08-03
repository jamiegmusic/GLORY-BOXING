-- Create application_logs table for structured logging
CREATE TABLE IF NOT EXISTS application_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('info', 'warn', 'error', 'debug')),
  service TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  trace_id TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX idx_logs_timestamp ON application_logs(timestamp DESC);
CREATE INDEX idx_logs_level ON application_logs(level);
CREATE INDEX idx_logs_service ON application_logs(service);
CREATE INDEX idx_logs_trace_id ON application_logs(trace_id);
CREATE INDEX idx_logs_user_id ON application_logs(user_id);
CREATE INDEX idx_logs_created_at ON application_logs(created_at DESC);

-- Create index for metadata JSONB queries
CREATE INDEX idx_logs_metadata ON application_logs USING gin(metadata);

-- Add comments for documentation
COMMENT ON TABLE application_logs IS 'Structured application logs for monitoring and debugging';
COMMENT ON COLUMN application_logs.timestamp IS 'Timestamp when the log entry was created in the application';
COMMENT ON COLUMN application_logs.level IS 'Log level: info, warn, error, or debug';
COMMENT ON COLUMN application_logs.service IS 'Service or component that generated the log';
COMMENT ON COLUMN application_logs.message IS 'Log message';
COMMENT ON COLUMN application_logs.metadata IS 'Additional structured data as JSON';
COMMENT ON COLUMN application_logs.trace_id IS 'Trace ID for distributed tracing';
COMMENT ON COLUMN application_logs.user_id IS 'User ID if the log is associated with a specific user';
COMMENT ON COLUMN application_logs.created_at IS 'Database timestamp when the record was inserted';

-- Create RLS policies
ALTER TABLE application_logs ENABLE ROW LEVEL SECURITY;

-- Policy for service role to insert logs
CREATE POLICY "Service role can insert logs" ON application_logs
  FOR INSERT
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Policy for authenticated users to view their own logs
CREATE POLICY "Users can view their own logs" ON application_logs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy for admins to view all logs
CREATE POLICY "Admins can view all logs" ON application_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data ->> 'role' = 'admin'
    )
  );

-- Create a function to clean up old logs (optional)
CREATE OR REPLACE FUNCTION cleanup_old_logs()
RETURNS void AS $$
BEGIN
  -- Delete logs older than 30 days, keeping error logs for 90 days
  DELETE FROM application_logs
  WHERE created_at < NOW() - INTERVAL '30 days'
  AND level != 'error';
  
  DELETE FROM application_logs
  WHERE created_at < NOW() - INTERVAL '90 days'
  AND level = 'error';
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to clean up old logs (requires pg_cron extension)
-- Uncomment if pg_cron is available in your Supabase instance
-- SELECT cron.schedule('cleanup-old-logs', '0 2 * * *', 'SELECT cleanup_old_logs();');