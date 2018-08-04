import { css } from 'vuikit/src/_core/utils/style'
import { width } from 'vuikit/src/_core/utils/dimensions'
import { win, docEl } from 'vuikit/src/_core/utils/env'

import core from '../core'
import { mixinPage, mixinActive } from '../mixins'
import { VkOffcanvasEl, VkOffcanvasElBar } from '../elements'
import { SHOW, SHOWN, HIDE, HIDDEN } from '../constants'

export default {
  name: 'VkOffcanvas',
  inheritAttrs: false,
  extends: core,
  mixins: [ mixinPage, mixinActive ],
  created () {
    this.$on(SHOW, () => {
      this.setPage()
    })

    this.$on(SHOWN, () => {
      this.setAsActive()
    })

    this.$on(HIDDEN, () => {
      this.resetPage()
      this.setAsInactive()
    })
  },
  beforeDestroy () {
    this.$emit(HIDDEN)
  },
  render (h) {
    const instance = this

    const content = h(VkOffcanvasEl, {
      props: this.$props,
      class: {
        'uk-open': this.show
      },
      directives: [{
        name: 'show',
        value: this.show
      }]
    }, [
      h(VkOffcanvasElBar, {
        ref: 'bar',
        class: {
          'uk-offcanvas-none': this.show
        }
      }, this.$slots.default)
    ])

    return h('transition', {
      props: { css: false },
      on: {
        enter: (el, done) => done(),
        leave: (el, done) => done(),
        beforeEnter (el) {
          instance.$emit(SHOW)

          const scrollbarWidth = instance.getScrollbarWidth()

          css(docEl, 'overflowY', scrollbarWidth && instance.overlay
            ? 'scroll'
            : ''
          )

          // freeze content width/height
          width(instance.$refs.content, width(win) - scrollbarWidth)
        },
        afterEnter (el) {
          instance.$emit(SHOWN)
        },
        beforeLeave (el) {
          instance.$emit(HIDE)
        },
        afterLeave (el) {
          instance.$emit(HIDDEN)
        }
      }
    }, [ content ])
  }
}
