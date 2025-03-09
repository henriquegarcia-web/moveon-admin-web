import { useState, useEffect, useCallback } from 'react'

function useScrollbar(
  elementRef: React.RefObject<HTMLElement>,
  isVisible: boolean = true
) {
  const [containerHasScrollbar, setContainerHasScrollbar] = useState(false)

  const checkScrollbar = useCallback(() => {
    const element = elementRef.current
    if (element) {
      const hasScrollbar = element.scrollHeight > element.clientHeight
      setContainerHasScrollbar(hasScrollbar)
    }
  }, [elementRef])

  useEffect(() => {
    const element = elementRef.current

    const verifyScrollbar = () => {
      if (isVisible && element) {
        requestAnimationFrame(() => {
          checkScrollbar()
        })
      }
    }

    if (isVisible) {
      verifyScrollbar()
      const timer = setTimeout(verifyScrollbar, 100)
      return () => clearTimeout(timer)
    }

    const resizeObserver = new ResizeObserver(() => {
      if (isVisible) {
        verifyScrollbar()
      }
    })

    if (element) {
      resizeObserver.observe(element)
    }

    return () => {
      if (element) {
        resizeObserver.unobserve(element)
      }
    }
  }, [elementRef, isVisible, checkScrollbar])

  return [containerHasScrollbar] as const
}

export default useScrollbar
