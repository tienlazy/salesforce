// ResizeObserverWrapper.js
export default class ResizeObserverWrapper {
    constructor(callback) {
      this.resizeObserver = new ResizeObserver(entries => {
        callback(entries);
      });
    }
  
    observe(target) {
      this.resizeObserver.observe(target);
    }
  
    unobserve(target) {
      this.resizeObserver.unobserve(target);
    }
  
    disconnect() {
      this.resizeObserver.disconnect();
    }
  }
  