# Source: https://betterstack.com/community/guides/logging/semantic-logger/
# Original language: ruby
# Normalized: ruby
# Block index: 26

class WeatherStation
  include SemanticLogger::Loggable

  def initialize(station_id)
    @station_id = station_id
  end

  def calibrate_sensors
    logger.info('Starting sensor calibration', { station_id: @station_id, maintenance_type: 'calibration' })
    logger.info('Wind sensor calibrated', { bearing_adjusted: true, previous_direction: 'NW' })
  end
end

# Initialize the station
station = WeatherStation.new('STATION-SFO-01')

[highlight]
SemanticLogger.tagged(facility: 'SFO Airport', region: 'Bay Area') do
  station.calibrate_sensors
end
[/highlight]