import { useEffect, useState } from "react"

export default function useWelcomeAnimation() {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const shouldAnimate = sessionStorage.getItem("welcomeAnimationShown") !== "true"
    setAnimate(shouldAnimate)

    if (shouldAnimate) {
      const timer = setTimeout(() => {
        sessionStorage.setItem("welcomeAnimationShown", "true")
        setAnimate(false)
        // animation duration - 1500ms
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [])

  return animate
}
