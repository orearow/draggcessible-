import {closest} from 'shared/utils';
import Sensor from '../Sensor';

const onKeyDown = Symbol('onKeyDown');

/**
 * This sensor picks up native browser keyboard events and dictates drag operations
 * @class KeyboardSensor
 * @module KeyboardSensor
 * @extends Sensor
 */
export default class KeyboardSensor extends Sensor {
  /**
   * KeyboardSensor constructor.
   * @constructs KeyboardSensor
   * @param {HTMLElement[]|NodeList|HTMLElement} containers - Containers
   * @param {Object} options - Options
   */
  constructor(containers = [], options = {}) {
    super(containers, options);

    this[onKeyDown] = this[onKeyDown].bind(this);
  }

  /**
   * Attaches sensors event listeners to the DOM
   */
  attach() {
    document.addEventListener('keydown', this[onKeyDown], true);
  }

  /**
   * Detaches sensors event listeners to the DOM
   */
  detach() {
    document.removeEventListener('keydown', this[onMouseDown], true);
  }

  /**
   * Key down handler
   * @private
   * @param {Event} event - Key down event
   */
  [onKeyDown](event) {
    // console.log(event);
    const originalSource = closest(event.target, this.options.draggable);
    // console.log(originalSource);
    // console.log('containers children', this.containers[0].children);
    const index = Array.prototype.indexOf.call(this.containers[0].children, originalSource);
    console.log(index);
    if (event.key === 'Enter') {
      this.dragging = !this.dragging;
      // console.log(this.dragging);
    } else if (this.dragging && event.key === 'ArrowUp') {
      // console.log('currentContainer', this.currentContainer);
    }
  }
}
