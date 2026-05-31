# Source: https://betterstack.com/community/guides/scaling-nodejs/valdi-snapchat/
# Original language: typescript
# Normalized: ts
# Block index: 0

[label HelloWorld.tsx]
import { Component } from 'valdi_core/src/Component';

class HelloWorld extends Component {
  onRender() {
    const message = 'Hello World! 🗺️';
    return (
      <view backgroundColor="#FFFC00" padding={30}>
        <label color="black" value={message} />
      </view>
    );
  }
}