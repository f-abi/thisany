<script setup lang="ts">
import { gsap } from 'gsap'
import { onMounted, onBeforeUnmount, useTemplateRef, watch } from 'vue'

interface TargetCursorProps {
  /** 延迟时间 */
  duration?: number
  /** 吸附效果的选择器 */
  targetSelector?: string
  /** 默认圆点大小 */
  defaultSize?: number
}

const {
  targetSelector = '.cursor-target',
  duration = 0.6,
  defaultSize = 28
} = defineProps<TargetCursorProps>()

const cursorRef = useTemplateRef('cursorRef')
const borderRef = useTemplateRef('borderRef')

// 跟踪悬停状态以切换行为
let isHovering = false

const moveCursor = (x: number, y: number) => {
  if (!cursorRef.value || isHovering) return

  // 标准鼠标跟随
  gsap.to(cursorRef.value, {
    x,
    y,
    duration,
    ease: 'power2.out',
    overwrite: 'auto' // 自动覆盖之前的动画
  })
}

let cleanupAnimation: () => void = () => {}

const setupAnimation = () => {
  if (!cursorRef.value || !borderRef.value) return

  const cursor = cursorRef.value
  const border = borderRef.value

  let activeTarget: Element | null = null
  let currentTargetMove: ((ev: Event) => void) | null = null
  let currentLeaveHandler: (() => void) | null = null

  const cleanupTarget = (target: Element) => {
    if (currentTargetMove) {
      target.removeEventListener('mousemove', currentTargetMove)
    }
    if (currentLeaveHandler) {
      target.removeEventListener('mouseleave', currentLeaveHandler)
    }
    currentTargetMove = null
    currentLeaveHandler = null
  }

  // 初始化光标位置
  gsap.set(cursor, {
    xPercent: -50,
    yPercent: -50,
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    opacity: 1,
    display: 'block'
  })

  // 初始化边框（默认状态）
  gsap.set(border, {
    xPercent: -50,
    yPercent: -50,
    width: defaultSize,
    height: defaultSize,
    borderRadius: '50%',
    x: 0,
    y: 0,
    backgroundColor: 'transparent'
  })

  // 监听鼠标移动事件
  const moveHandler = (e: MouseEvent) => moveCursor(e.clientX, e.clientY)
  window.addEventListener('mousemove', moveHandler)

  // 处理进入目标元素的事件
  const enterHandler = (e: MouseEvent) => {
    const directTarget = e.target as Element

    const allTargets: Element[] = []
    let current = directTarget
    while (current && current !== document.body) {
      if (current.matches(targetSelector)) {
        allTargets.push(current)
      }
      current = current.parentElement!
    }

    const target = allTargets[0] || null
    if (!target || !cursorRef.value || !borderRef.value) return

    if (activeTarget === target) return
    if (activeTarget) {
      cleanupTarget(activeTarget)
    }

    activeTarget = target
    isHovering = true // 停止默认的鼠标跟随行为

    // 强制杀掉之前的 tweens，防止冲突，防止“跳跃”
    gsap.killTweensOf(cursor)
    gsap.killTweensOf(border)

    const updateMagnet = () => {
      const rect = target.getBoundingClientRect()

      const targetCenterX = rect.left + rect.width / 2
      const targetCenterY = rect.top + rect.height / 2

      // 移除偏移，始终吸附在目标中心
      const cursorX = targetCenterX
      const cursorY = targetCenterY

      // 动画光标容器移动到目标中心
      gsap.to(cursor, {
        x: cursorX,
        y: cursorY,
        duration, // 进入吸附状态的延迟感
        ease: 'power3.out',
        overwrite: true
      })

      const computedStyle = window.getComputedStyle(target)
      const targetRadius = computedStyle.borderRadius

      // 动画边框以匹配目标大小
      const padding = 6
      gsap.to(border, {
        width: rect.width + padding,
        height: rect.height + padding,
        borderRadius: targetRadius,
        x: 0,
        y: 0,
        duration, // 边框变形的延迟感
        ease: 'power3.out',
        overwrite: true
      })
    }

    updateMagnet() // 初始吸附

    // 节流的移动处理程序 (不再需要视差效果，但保留结构以防未来需要)
    const targetMove = (ev: Event) => {
      // 空逻辑
    }

    // 离开处理程序
    const leaveHandler = () => {
      activeTarget = null
      isHovering = false // 恢复默认鼠标跟随

      cleanupTarget(target)

      // 停止边框的变形动画
      gsap.killTweensOf(border)

      // 动画边框恢复到默认圆形
      gsap.to(border, {
        width: defaultSize,
        height: defaultSize,
        borderRadius: '50%',
        x: 0,
        y: 0,
        duration, // 离开恢复的延迟感
        ease: 'power3.out',
        overwrite: true
      })
    }

    currentTargetMove = targetMove
    currentLeaveHandler = leaveHandler

    target.addEventListener('mousemove', targetMove)
    target.addEventListener('mouseleave', leaveHandler)
  }

  window.addEventListener('mouseover', enterHandler, { passive: true })

  // 清理动画及事件监听
  cleanupAnimation = () => {
    window.removeEventListener('mousemove', moveHandler)
    window.removeEventListener('mouseover', enterHandler)

    if (activeTarget) {
      cleanupTarget(activeTarget)
    }

    if (cursorRef.value) {
      gsap.killTweensOf(cursorRef.value)
      gsap.set(cursorRef.value, {
        opacity: 0,
        display: 'none'
      })
    }
    if (borderRef.value) {
      gsap.killTweensOf(borderRef.value)
    }

    isHovering = false
    activeTarget = null
  }
}

onMounted(() => {
  setupAnimation()
})

onBeforeUnmount(() => {
  cleanupAnimation()
})

watch(
  () => targetSelector,
  () => {
    cleanupAnimation()
    setupAnimation()
  }
)
</script>

<template>
  <div
    ref="cursorRef"
    class="pointer-events-none fixed top-0 left-0 z-9999 h-0 w-0 -translate-x-1/2 -translate-y-1/2 transform opacity-0"
    :style="{ willChange: 'transform' }"
  >
    <div
      ref="borderRef"
      class="border-primary pointer-events-none absolute top-1/2 left-1/2 box-border border-2"
      :style="{ willChange: 'transform, width, height, border-radius' }"
    />
  </div>
</template>
