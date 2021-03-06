# react-side-context

Experiment with subscription-based context for React.

Run `npm start` to start the example server at `localhost:8080`.

## Usage

From [examples/lang](examples/lang.js):

```js
import createContext from 'react-side-context';

const { broadcasts, observes } = createContext('app');

@broadcasts(['lang'])
class LangBroadcaster extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      lang: 'en',
    };

    // Replaces initial `getChildContext`
    this.props.broadcast(this.state);
  }

  componentWillUpdate(nextProps, nextState) {
    // Replaces subsequent `getChildContext`
    this.props.broadcast(nextState);
  }

  render() {
    return (
      <SwitchLanguage onSwitch={lang => this.setState({ lang })} />
    );
  }
}

@observes(['lang'])
class SwitchLanguage {
  render() {
    let { lang } = this.props;
    let labels = {
      en: 'Switch language',
      fr: 'Changer de langue',
    };
    return (
      <button
        onClick={() => this.props.onSwitch(lang === 'en' ? 'fr' : 'en')}
      >
        {labels[lang]}
      </button>
    );
  }
}
```

## Note

The result of `shouldComponentUpdate` in parent components has no influence in determining if a subscriber will be updated in response to a broadcast. See also [examples/shouldBroadcast](examples/shouldBroadcast.js).
