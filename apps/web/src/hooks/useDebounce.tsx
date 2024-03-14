//https://medium.com/@philip.andrewweedewang/debounce-hook-in-react-typescript-in-20-lines-of-code-9cde26254d10
import { useRef, useEffect } from "react"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => void

export default function useDebounce(func: AnyFunction, delay = 1000) {
  const timer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    return () => {
      if (!timer.current) return
      clearTimeout(timer.current)
    }
  }, [])

  const debouncedFunction = (...args: unknown[]) => {
    const newTimer = setTimeout(() => {
      func(...args)
    }, delay)
    clearTimeout(timer.current)
    timer.current = newTimer
  }

  return debouncedFunction
}
