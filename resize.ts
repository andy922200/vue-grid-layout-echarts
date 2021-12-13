interface eleCustom {
  __resizeTrigger__: undefined | any,
  __z_resizeListeners: undefined | any[]
}

interface DocumentExtend {
  attachEvent(event: string, listener: EventListener): boolean;
  detachEvent(event: string, listener: EventListener): void;
}

const EleResize = {
  _handleResize: function (e: Event) {
    const ele = {
      ...e.target || e.srcElement,
      __resizeTrigger__: undefined as undefined | Record<string, any>,
      __z_resizeListeners: undefined as undefined | any[]
    }
    const trigger = ele.__resizeTrigger__
    if (trigger) {
      const handlers = trigger.__z_resizeListeners
      if (handlers) {
        for (let i = 0; i < handlers.length; i++) {
          const h = handlers[i]
          const handler = h.handler
          const context = h.context
          handler.apply(context, [e])
        }
      }
    }
  },
  _removeHandler: function (ele: eleCustom & HTMLElement, handler: any, context: any) {
    const handlers = ele.__z_resizeListeners
    if (handlers) {
      for (let i = 0; i < handlers.length; i++) {
        const h = handlers[i]
        if (h.handler === handler && h.context === context) {
          handlers.splice(i, 1)
          return
        }
      }
    }
  },
  _createResizeTrigger: function (ele: eleCustom & HTMLElement) {
    const obj = document.createElement('object')
    obj.setAttribute('style',
      'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden;opacity: 0; pointer-events: none; z-index: -1;')
    obj.onload = EleResize._handleObjectLoad
    obj.type = 'text/html'
    ele.appendChild(obj)
    obj.data = 'about:blank'
    return obj
  },
  _handleObjectLoad: function () {
    const target = this as Record<string, any>
    target.contentDocument.defaultView.__resizeTrigger__ = target.__resizeElement__
    target.contentDocument.defaultView.addEventListener('resize', EleResize._handleResize)
  },
  on: undefined as unknown as Function,
  off: undefined as unknown as Function
}

/*@ts-ignore*/
if (document.attachEvent) { // ie9-10
  EleResize.on = function (ele: eleCustom & HTMLElement & DocumentExtend, handler: any, context: any) {
    let handlers = ele.__z_resizeListeners
    if (!handlers) {
      handlers = []
      ele.__z_resizeListeners = handlers
      ele.__resizeTrigger__ = ele
      ele.attachEvent('onresize', EleResize._handleResize)
    }
    handlers.push({
      handler: handler,
      context: context
    })
  }
  EleResize.off = function (ele: eleCustom & HTMLElement & DocumentExtend, handler: any, context: any) {
    let handlers = ele.__z_resizeListeners
    if (handlers) {
      EleResize._removeHandler(ele, handler, context)
      if (handlers.length === 0) {
        ele.detachEvent('onresize', EleResize._handleResize)
        delete ele.__z_resizeListeners
      }
    }
  }
} else {
  EleResize.on = function (ele: eleCustom & HTMLElement, handler: any, context: any) {
    let handlers = ele.__z_resizeListeners
    if (!handlers) {
      handlers = []
      ele.__z_resizeListeners = handlers

      if (getComputedStyle(ele, null).position === 'static') {
        ele.style.position = 'relative'
      };
      const obj = EleResize._createResizeTrigger(ele) as Record<string, any>
      ele.__resizeTrigger__ = obj
      obj.__resizeElement__ = ele
    }
    handlers.push({
      handler: handler,
      context: context
    })
  }
  EleResize.off = function (ele: eleCustom & HTMLElement, handler: any, context: any) {
    let handlers = ele.__z_resizeListeners
    if (handlers) {
      EleResize._removeHandler(ele, handler, context)
      if (handlers.length === 0) {
        const trigger = ele.__resizeTrigger__
        if (trigger) {
          trigger.contentDocument.defaultView.removeEventListener('resize', EleResize._handleResize)
          ele.removeChild(trigger)
          delete ele.__resizeTrigger__
        }
        delete ele.__z_resizeListeners
      }
    }
  }
}
export default EleResize