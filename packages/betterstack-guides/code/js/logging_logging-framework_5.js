# Source: https://betterstack.com/community/guides/logging/logging-framework/
# Original language: javascript
# Normalized: js
# Block index: 5

function getEntity(entityID) {
  const childLogger = logger.child({ entity_id: entityID });
  childLogger.trace('getEntity invoked');
  childLogger.trace('getEntity completed');
}

getEntity('123');