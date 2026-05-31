# Source: https://betterstack.com/community/guides/logging/php-logging-opentelemetry/
# Original language: php
# Normalized: php
# Block index: 41

[label ./cms/public/index.php]
. . .
[highlight]
/*
[/highlight]
// Add routes
$app->get('/api/v1/templates/{key}', function (Request $request, Response $response, array $args) use ($eventToTemplateMap, $tracer) {
    $parent = Globals::propagator()->extract($request->getHeaders());
    $span = $tracer->spanBuilder('HTTP GET /api/v1/templates/{key}')->setSpanKind(SpanKind::KIND_SERVER)->setParent($parent)->startSpan();
    $key = $args['key'];
    if (isset($eventToTemplateMap[$key])) {
        $body = file_get_contents($eventToTemplateMap[$key]);
        $response->getBody()->write($body);
    } else {
        $response->withStatus(404);
        $span->setStatus(StatusCode::STATUS_ERROR, sprintf('Key "%s" not found', $key));
    }
    $span->end();

    return $response;
});
[highlight]
*/
[/highlight]
$app->run();