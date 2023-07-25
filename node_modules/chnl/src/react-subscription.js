import Subscription from './subscription';

/**
 * Utility class that extends Subscription for using in ReactComponent - automatically attach/detach listeners
 * in `componentDidMount` / `componentWillUnmount`.
 *
 * @param {ReactComponent} component
 * @param {Array<{channel, event, listener}>} items
 *
 * @example
 * class Button extends React.Component {
 *   constructor() {
 *     super();
 *     new Channel.ReactSubscription(this, [
 *       {channel: onNewData, listener: this.handleNewData.bind(this)}
 *     ]);
 *   }
 * }
 *
 * // actually equals to (but with more boilerplate code):
 * class Button extends React.Component {
 *   constructor() {
 *     super();
 *     this.subscription = new Channel.Subscription([
 *       {channel: onNewData, listener: this.handleNewData.bind(this)}
 *     ]);
 *   }
 *   componentDidMount() {
 *     this.subscription.on();
 *   }
 *   componentWillUnmount() {
 *     this.subscription.off();
 *   }
 * }
 */
export default class ReactSubscription extends Subscription {
  constructor(component, items) {
    super(items);
    this._overrideComponentCallback(component, 'componentDidMount', 'on');
    this._overrideComponentCallback(component, 'componentWillUnmount', 'off');
  }

  /**
   * @param {ReactComponent} component
   * @param {String} callbackName
   * @param {String} methodName
   * @private
   */
  _overrideComponentCallback(component, callbackName, methodName) {
    const baseCallback = component[callbackName];
    component[callbackName] = (...args) => {
      this[methodName]();
      if (typeof baseCallback === 'function') {
        return baseCallback.apply(component, args);
      }
    };
  }
}
