# Source: https://betterstack.com/community/guides/scaling-nodejs/valdi-snapchat/
# Original language: typescript
# Normalized: ts
# Block index: 1

[label App.tsx]
export class App extends StatefulComponent<AppViewModel, AppComponentContext> {
  state: State = { hotReloaderConnected: false };

  onCreate(): void {
    console.log('On App create!');
    getDaemonClientManager().addListener(this);
  }

  onDestroy(): void {
    console.log('On App destroy!');
    getDaemonClientManager().removeListener(this);
  }

  onAvailabilityChanged(available: boolean): void {
    this.setState({ hotReloaderConnected: available });
  }

  onRender(): void {
    console.log('On App render!');
    return (
      <view style={styles.main}>
        <image style={styles.logo} src={res.valdi} />
        <layout padding={20}>
            <label style={styles.title} value={'Welcome to Valdi!'} />
        </layout>
        <label style={styles.subtitle} value={this.renderLabel()} />
      </view>
    );
  }

  private renderLabel(): AttributedText {
    // ... logic to return text based on platform
  }
}