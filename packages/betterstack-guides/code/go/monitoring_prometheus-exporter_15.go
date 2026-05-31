# Source: https://betterstack.com/community/guides/monitoring/prometheus-exporter/
# Original language: go
# Normalized: go
# Block index: 15

[label main.go]
. . .
// Metrics holds descriptions for NGINX-related metrics.
type metrics struct {
	ActiveConnectionsDesc   *prometheus.Desc
	ConnectionsReadingDesc  *prometheus.Desc
	ConnectionsAcceptedDesc *prometheus.Desc
	ConnectionsHandledDesc  *prometheus.Desc
	ConnectionsWaitingDesc  *prometheus.Desc
	ConnectionsWritingDesc  *prometheus.Desc
	HTTPRequestsTotalDesc   *prometheus.Desc
}

// NewMetrics initializes all metric descriptions.
func NewMetrics(namespace string) *metrics {
	return &metrics{
		ActiveConnectionsDesc: prometheus.NewDesc(
			namespace+"_connections_active",
			"Active client connections",
			nil, nil,
		),
		ConnectionsReadingDesc: prometheus.NewDesc(
			namespace+"_connections_reading",
			"Connections currently reading client request headers",
			nil, nil,
		),
		ConnectionsAcceptedDesc: prometheus.NewDesc(
			namespace+"_connections_accepted_total",
			"Total accepted client connections",
			nil, nil,
		),
		ConnectionsHandledDesc: prometheus.NewDesc(
			namespace+"_connections_handled_total",
			"Total handled client connections",
			nil, nil,
		),
		ConnectionsWaitingDesc: prometheus.NewDesc(
			namespace+"_connections_waiting",
			"Idle client connections",
			nil, nil,
		),
		ConnectionsWritingDesc: prometheus.NewDesc(
			namespace+"_connections_writing",
			"Connections where NGINX is currently writing responses to clients",
			nil, nil,
		),
		HTTPRequestsTotalDesc: prometheus.NewDesc(
			namespace+"_http_requests_total",
			"Total number of HTTP requests handled",
			nil, nil,
		),
	}
}

// CollectMetrics is a struct that collects metrics dynamically.
type CollectMetrics struct {
	metrics *metrics
}

// NewCollector creates a new instance of CollectMetrics.
func NewCollector(namespace string, reg prometheus.Registerer) *CollectMetrics {
	m := NewMetrics(namespace)
	c := &CollectMetrics{metrics: m}
	reg.MustRegister(c)
	return c
}

// Describe sends metric descriptions to the provided channel.
func (c *CollectMetrics) Describe(ch chan<- *prometheus.Desc) {
	ch <- c.metrics.ActiveConnectionsDesc
	ch <- c.metrics.ConnectionsReadingDesc
	ch <- c.metrics.ConnectionsAcceptedDesc
	ch <- c.metrics.ConnectionsHandledDesc
	ch <- c.metrics.ConnectionsWaitingDesc
	ch <- c.metrics.ConnectionsWritingDesc
	ch <- c.metrics.HTTPRequestsTotalDesc
}

// Collect dynamically collects metrics and sends them to Prometheus.
func (c *CollectMetrics) Collect(ch chan<- prometheus.Metric) {
	endpoint := os.Getenv("NGINX_STATUS_ENDPOINT")

	nginxStats, err := GetStubStats(endpoint)
	if err != nil {
		log.Println(err)
		return
	}

	activeConnections := float64(nginxStats.Connections.Active)
	connectionsReading := float64(nginxStats.Connections.Reading)
	connectionsAccepted := float64(nginxStats.Connections.Accepted)
	connectionsHandled := float64(nginxStats.Connections.Handled)
	connectionsWaiting := float64(nginxStats.Connections.Waiting)
	connectionsWriting := float64(nginxStats.Connections.Writing)
	httpRequestsTotal := float64(nginxStats.Requests)

	ch <- prometheus.MustNewConstMetric(c.metrics.ActiveConnectionsDesc, prometheus.GaugeValue, activeConnections)
	ch <- prometheus.MustNewConstMetric(c.metrics.ConnectionsReadingDesc, prometheus.GaugeValue, connectionsReading)
	ch <- prometheus.MustNewConstMetric(c.metrics.ConnectionsAcceptedDesc, prometheus.CounterValue, connectionsAccepted)
	ch <- prometheus.MustNewConstMetric(c.metrics.ConnectionsHandledDesc, prometheus.CounterValue, connectionsHandled)
	ch <- prometheus.MustNewConstMetric(c.metrics.ConnectionsWaitingDesc, prometheus.GaugeValue, connectionsWaiting)
	ch <- prometheus.MustNewConstMetric(c.metrics.ConnectionsWritingDesc, prometheus.GaugeValue, connectionsWriting)
	ch <- prometheus.MustNewConstMetric(c.metrics.HTTPRequestsTotalDesc, prometheus.CounterValue, httpRequestsTotal)
}
. . .