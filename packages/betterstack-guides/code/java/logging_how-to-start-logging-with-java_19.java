# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-java/
# Original language: java
# Normalized: java
# Block index: 19

[label MaskingJsonMessage.java]
  import org.apache.logging.log4j.core.LogEvent;
  import org.apache.logging.log4j.core.config.plugins.Plugin;
  import org.apache.logging.log4j.core.layout.JsonLayout;

  @Plugin(name = "MaskingJsonMessage", category = "Core", elementType = "message", printObject = true)
  public class MaskingJsonMessage extends JsonLayout {

      private static final String PASSWORD_FIELD_NAME = "password";

      @Override
      public String getFormattedMessage(LogEvent event) {
          String json = super.getFormattedMessage(event);
          return maskPassword(json);
      }

      private String maskPassword(String json) {
          // Mask password field with placeholder
          return json.replaceAll("\"" + PASSWORD_FIELD_NAME + "\":\".*?\"", "\"" + PASSWORD_FIELD_NAME + "\":\"********\"");
      }
  }