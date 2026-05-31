# Source: https://betterstack.com/community/guides/observability/distributed-tracing/
# Original language: go
# Normalized: go
# Block index: 1

// Basic example of instrumenting Go code with OpenTelemetry
func executeQuery(ctx context.Context, tracer trace.Tracer, db *sql.DB, query string) (*sql.Rows, error) {
	// 1. Create a new span
	var span trace.Span
	ctx, span = tracer.Start(ctx, "db query")
	// 2. Ensure that the span is completed regardless of whether the query
    // succeeded or failed
	defer span.End()

	// 3. Record which query is being executed
	span.SetAttributes(semconv.DBStatement(query))

	stmt, err := db.Prepare(query)
	if err != nil {
		// 4. Record that the query preparation failed
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		return nil, err
	}
	defer stmt.Close()

	rows, err := stmt.QueryContext(ctx)
	if err != nil {
		// 5. Record that the query execution failed
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		return nil, err
	}

    // 6. Record that the query execution was successful
	span.SetStatus(codes.Ok, "query successful")

	return rows, nil
}