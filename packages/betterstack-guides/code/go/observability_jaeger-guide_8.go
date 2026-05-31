# Source: https://betterstack.com/community/guides/observability/jaeger-guide/
# Original language: go
# Normalized: go
# Block index: 8

[label examples/hotrod/services/customer/database.go]
. . .

func (d *database) Get(ctx context.Context, customerID int) (*Customer, error) {
	d.logger.For(ctx).Info("Loading customer", zap.Int("customer_id", customerID))

	ctx, span := d.tracer.Start(ctx, "SQL SELECT", trace.WithSpanKind(trace.SpanKindClient))
	span.SetAttributes(
		otelsemconv.PeerServiceKey.String("mysql"),
		attribute.
			Key("sql.query").
			String(fmt.Sprintf("SELECT * FROM customer WHERE customer_id=%d", customerID)),
	)
	defer span.End()

[highlight]
	if !config.MySQLMutexDisabled {
		// simulate misconfigured connection pool that only gives one connection at a time
		d.lock.Lock(ctx)
		defer d.lock.Unlock()
	}

	// simulate RPC delay
	delay.Sleep(config.MySQLGetDelay, config.MySQLGetDelayStdDev)
[/highlight]

	if customer, ok := d.customers[customerID]; ok {
		return customer, nil
	}
	return nil, errors.New("invalid customer ID")
}