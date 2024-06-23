import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Button, Form, Heading } from "../Common"
import useAuthFormParam from "./useAuthFormParam"

export default function ActivateAccount() {
  const [currentQueryParameters] = useSearchParams()
  const token = currentQueryParameters.get("token")
  const { setActiveFormKey } = useAuthFormParam()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()

  useEffect(() => {
    async function activateAccount() {
      setIsLoading(true)
      setError(undefined)

      const url = `${process.env.REACT_APP_SERVER_URL}/user/activate/${token}`
      const response = await fetch(url, {
        method: "POST",
      })

      setIsLoading(false)
      if (response.ok) {
        return
      }

      const errorData = await response.json()
      setError(errorData.message)
    }
    activateAccount()
  }, [])

  if (isLoading) {
    return (
      <Form>
        <Heading>Activating account...</Heading>
      </Form>
    )
  }

  if (error) {
    return (
      <Form>
        <Heading>{error}</Heading>
      </Form>
    )
  }

  return (
    <Form>
      <Heading>Account activated!</Heading>
      <Button onClick={() => setActiveFormKey("login")}>Go to login</Button>
    </Form>
  )
}
