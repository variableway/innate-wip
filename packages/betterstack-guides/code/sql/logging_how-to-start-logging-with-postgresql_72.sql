# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-postgresql/
# Original language: sql
# Normalized: sql
# Block index: 72

CREATE OR REPLACE FUNCTION custom_logs_func()
RETURNS TRIGGER LANGUAGE PLPGSQL AS $$
BEGIN
    RAISE LOG 'This is an informational message';
    RAISE WARNING 'Something unexpected happened';
    RAISE EXCEPTION 'An unexpected error';
END;
$$;

CREATE OR REPLACE TRIGGER UPDATE_LAST_EDITED_TIME BEFORE UPDATE ON ALBUM
FOR EACH ROW EXECUTE FUNCTION custom_logs_func();