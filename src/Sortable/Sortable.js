/* eslint-disable babel/no-invalid-this */
/* eslint-disable shopify/prefer-early-return */
/* eslint-disable id-length */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import {closest} from 'shared/utils';

import Draggable from '../Draggable';
import {SortableStartEvent, SortableSortEvent, SortableSortedEvent, SortableStopEvent} from './SortableEvent';

const onDragStart = Symbol('onDragStart');
const onDragOverContainer = Symbol('onDragOverContainer');
const onDragOver = Symbol('onDragOver');
const onDragStop = Symbol('onDragStop');

/**
 * Returns announcement message when a Draggable element has been sorted with another Draggable element
 * or moved into a new container
 * @param {SortableSortedEvent} sortableEvent
 * @return {String}
 */

function onSortableSortedDefaultAnnouncement({dragEvent}) {
  const sourceText = dragEvent.source.textContent.trim() || dragEvent.source.id || 'sortable element';

  if (dragEvent.over) {
    const overText = dragEvent.over.textContent.trim() || dragEvent.over.id || 'sortable element';
    const isFollowing = dragEvent.source.compareDocumentPosition(dragEvent.over) & Node.DOCUMENT_POSITION_FOLLOWING;

    if (isFollowing) {
      return `Placed ${sourceText} after ${overText}`;
    } else {
      return `Placed ${sourceText} before ${overText}`;
    }
  } else {
    // need to figure out how to compute container name
    return `Placed ${sourceText} into a different container`;
  }
}

/**
 * @const {Object} defaultAnnouncements
 * @const {Function} defaultAnnouncements['sortable:sorted']
 */
const defaultAnnouncements = {
  'sortable:sorted': onSortableSortedDefaultAnnouncement,
};

/**
 * Sortable is built on top of Draggable and allows sorting of draggable elements. Sortable will keep
 * track of the original index and emits the new index as you drag over draggable elements.
 * @class Sortable
 * @module Sortable
 * @extends Draggable
 */
export default class Sortable extends Draggable {
  /**
   * Sortable constructor.
   * @constructs Sortable
   * @param {HTMLElement[]|NodeList|HTMLElement} containers - Sortable containers
   * @param {Object} options - Options for Sortable
   */
  constructor(containers = [], options = {}) {
    super(containers, {
      ...options,
      announcements: {
        ...defaultAnnouncements,
        ...(options.announcements || {}),
      },
    });
    /**
     * start index of source on drag start
     * @property startIndex
     * @type {Number}
     */
    this.startIndex = null;

    /**
     * start container on drag start
     * @property startContainer
     * @type {HTMLElement}
     * @default null
     */
    this.startContainer = null;

    this[onDragStart] = this[onDragStart].bind(this);
    this[onDragOverContainer] = this[onDragOverContainer].bind(this);
    this[onDragOver] = this[onDragOver].bind(this);
    this[onDragStop] = this[onDragStop].bind(this);

    this.on('drag:start', this[onDragStart])
      .on('drag:over:container', this[onDragOverContainer])
      .on('drag:over', this[onDragOver])
      .on('drag:stop', this[onDragStop]);

    // /**
    //    * Key down handler
    //    * @private
    //    * @param {Event} event - Key down event
    //    */
    //  [onKeyDown](event) {
    //   // console.log(event);
    //   const originalSource = closest(event.target, this.options.draggable);
    //   // console.log(originalSource);
    //   // console.log('containers children', this.containers[0].children);
    //   const index = Array.prototype.indexOf.call(this.containers[0].children, originalSource);
    //   console.log(index);
    //   // if (event.key === 'Enter') {
    //   //   this.dragging = !this.dragging;
    //   //   // console.log(this.dragging);
    //   // } else if (this.dragging && event.key === 'ArrowUp') {
    //   //   // console.log('currentContainer', this.currentContainer);
    //   // }
    // }

    // document.addEventListener('keydown', (e) => {
    //   console.log(this.containers[0]);
    //   console.log(e.target);
    //   const testIndex = Array.prototype.indexOf.call(this.containers[0].children, e.target);
    //   console.log(testIndex);
    //   console.log(this.containers[0].children[testIndex + 1]);
    //   moveWithinContainerCopy(e.target, this.containers[0].children[testIndex + 1]);
    //   // console.log(e.ta[0].children);
    //   // const originalSource = closest(e.target, this.options.draggable);
    //   // const testIndex = Array.prototype.indexOf.call(this.containers[0].children, originalSource);
    //   // console.log(testIndex);
    //   if (e.key === 'Enter') {
    //     this.dragging = !this.dragging;
    //     // console.log(this.dragging);
    //   } else if (this.dragging && event.key === 'ArrowUp') {
    //     moveWithinContainerCopy(e.target, this.containers[0].children[testIndex + 1]);
    //   }
    // });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        console.log(this.dragging);
        this.dragging = !this.dragging;
        console.log(this.dragging);
        const testIndex = Array.prototype.indexOf.call(this.containers[0].children, e.target);

        if (this.dragging) {
          e.target.childNodes[0].style.backgroundColor = 'yellow';
        } else {
          e.target.childNodes[0].style.backgroundColor = 'white';
        }

        console.log(testIndex);
      } else if (e.key === 'Tab') {
        if (this.dragging) {
          this.dragging = false;
          e.target.childNodes[0].style.backgroundColor = 'white';
        }
      }
      // else if (this.dragging && event.key === 'ArrowUp') {
      //   moveWithinContainerCopy(e.target, this.containers[0].children[testIndex - 1]);
      // }
      else if (this.dragging && event.key === 'ArrowDown') {
        const maxIndex = this.containers[0].children.length - 1;
        const testIndex = Array.prototype.indexOf.call(this.containers[0].children, e.target);
        console.log(testIndex);
        console.log(' KEY EVENT DOWN AND DRAGGABLE');
        if (testIndex < maxIndex) {
          moveWithinContainerCopy(e.target, this.containers[0].children[testIndex + 1]);
          e.target.focus();
        } else {
          console.log('INDEX MAX');
        }
      } else if (this.dragging && event.key === 'ArrowUp') {
        const testIndex = Array.prototype.indexOf.call(this.containers[0].children, e.target);
        console.log(testIndex);
        console.log(' KEY EVENT DOWN AND DRAGGABLE');
        if (testIndex > 0) {
          moveWithinContainerCopy(e.target, this.containers[0].children[testIndex + -1]);
          e.target.focus();
        } else {
          console.log('INDEX MAX');
        }
      }
    });
  }

  /**
   * Destroys Sortable instance.
   */
  destroy() {
    super.destroy();

    this.off('drag:start', this[onDragStart])
      .off('drag:over:container', this[onDragOverContainer])
      .off('drag:over', this[onDragOver])
      .off('drag:stop', this[onDragStop]);
  }

  /**
   * Returns true index of element within its container during drag operation, i.e. excluding mirror and original source
   * @param {HTMLElement} element - An element
   * @return {Number}
   */
  index(element) {
    return this.getSortableElementsForContainer(element.parentNode).indexOf(element);
  }

  /**
   * Returns sortable elements for a given container, excluding the mirror and
   * original source element if present
   * @param {HTMLElement} container
   * @return {HTMLElement[]}
   */
  getSortableElementsForContainer(container) {
    const allSortableElements = container.querySelectorAll(this.options.draggable);

    return [...allSortableElements].filter((childElement) => {
      return (
        childElement !== this.originalSource && childElement !== this.mirror && childElement.parentNode === container
      );
    });
  }

  /**
   * Drag start handler
   * @private
   * @param {DragStartEvent} event - Drag start event
   */
  [onDragStart](event) {
    console.log('ON DRAG START EVENT');
    console.log(event);
    this.startContainer = event.source.parentNode;
    this.startIndex = this.index(event.source);

    const sortableStartEvent = new SortableStartEvent({
      dragEvent: event,
      startIndex: this.startIndex,
      startContainer: this.startContainer,
    });

    this.trigger(sortableStartEvent);

    if (sortableStartEvent.canceled()) {
      event.cancel();
    }
  }

  /**
   * Drag over container handler
   * @private
   * @param {DragOverContainerEvent} event - Drag over container event
   */
  [onDragOverContainer](event) {
    if (event.canceled()) {
      return;
    }

    const {source, over, overContainer} = event;
    const oldIndex = this.index(source);

    const sortableSortEvent = new SortableSortEvent({
      dragEvent: event,
      currentIndex: oldIndex,
      source,
      over,
    });

    this.trigger(sortableSortEvent);

    if (sortableSortEvent.canceled()) {
      return;
    }

    const children = this.getSortableElementsForContainer(overContainer);
    const moves = move({source, over, overContainer, children});

    if (!moves) {
      return;
    }

    const {oldContainer, newContainer} = moves;
    const newIndex = this.index(event.source);

    const sortableSortedEvent = new SortableSortedEvent({
      dragEvent: event,
      oldIndex,
      newIndex,
      oldContainer,
      newContainer,
    });

    this.trigger(sortableSortedEvent);
  }

  /**
   * Drag over handler
   * @private
   * @param {DragOverEvent} event - Drag over event
   */
  [onDragOver](event) {
    if (event.over === event.originalSource || event.over === event.source) {
      return;
    }

    const {source, over, overContainer} = event;
    const oldIndex = this.index(source);

    const sortableSortEvent = new SortableSortEvent({
      dragEvent: event,
      currentIndex: oldIndex,
      source,
      over,
    });

    this.trigger(sortableSortEvent);

    if (sortableSortEvent.canceled()) {
      return;
    }

    const children = this.getDraggableElementsForContainer(overContainer);
    const moves = move({source, over, overContainer, children});

    if (!moves) {
      return;
    }

    const {oldContainer, newContainer} = moves;
    const newIndex = this.index(source);

    const sortableSortedEvent = new SortableSortedEvent({
      dragEvent: event,
      oldIndex,
      newIndex,
      oldContainer,
      newContainer,
    });

    this.trigger(sortableSortedEvent);
  }

  /**
   * Drag stop handler
   * @private
   * @param {DragStopEvent} event - Drag stop event
   */
  [onDragStop](event) {
    const sortableStopEvent = new SortableStopEvent({
      dragEvent: event,
      oldIndex: this.startIndex,
      newIndex: this.index(event.source),
      oldContainer: this.startContainer,
      newContainer: event.source.parentNode,
    });

    this.trigger(sortableStopEvent);

    this.startIndex = null;
    this.startContainer = null;
  }
}

function index(element) {
  return Array.prototype.indexOf.call(element.parentNode.children, element);
}

function move({source, over, overContainer, children}) {
  const emptyOverContainer = !children.length;
  const differentContainer = source.parentNode !== overContainer;
  const sameContainer = over && source.parentNode === over.parentNode;

  if (emptyOverContainer) {
    return moveInsideEmptyContainer(source, overContainer);
  } else if (sameContainer) {
    return moveWithinContainer(source, over);
  } else if (differentContainer) {
    return moveOutsideContainer(source, over, overContainer);
  } else {
    return null;
  }
}

function moveInsideEmptyContainer(source, overContainer) {
  const oldContainer = source.parentNode;

  overContainer.appendChild(source);

  return {oldContainer, newContainer: overContainer};
}
function moveWithinContainerCopy(source, over) {
  const oldIndex = index(source);
  const newIndex = index(over);

  if (oldIndex < newIndex) {
    source.parentNode.insertBefore(source, over.nextElementSibling);
  } else {
    source.parentNode.insertBefore(source, over);
  }

  return {oldContainer: source.parentNode, newContainer: source.parentNode};
}

function moveWithinContainer(source, over) {
  console.log(' IN HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  const oldIndex = index(source);
  const newIndex = index(over);
  console.log(source);
  console.log(over);

  if (oldIndex < newIndex) {
    source.parentNode.insertBefore(source, over.nextElementSibling);
  } else {
    source.parentNode.insertBefore(source, over);
  }

  return {oldContainer: source.parentNode, newContainer: source.parentNode};
}

function moveOutsideContainer(source, over, overContainer) {
  const oldContainer = source.parentNode;

  if (over) {
    over.parentNode.insertBefore(source, over);
  } else {
    // need to figure out proper position
    overContainer.appendChild(source);
  }

  return {oldContainer, newContainer: source.parentNode};
}
