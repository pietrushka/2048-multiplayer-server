import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Button, Heading, ModalContentWrapper } from "../Common"
import useAuthFormParam from "../../hooks/useAuthFormParam"

export default function ActivateAccount() {
  const [currentQueryParameters] = useSearchParams()
  const token = currentQueryParameters.get("token")
  const { setActiveFormKey } = useAuthFormParam()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()

  useEffect(() => {
    async function activateAccount() {
      if (!token) {
        return
      }

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

  if (!token) {
    return (
      <ModalContentWrapper>
        <Heading>Invalid token</Heading>
      </ModalContentWrapper>
    )
  }

  if (isLoading) {
    return (
      <ModalContentWrapper>
        <Heading>Activating account...</Heading>
      </ModalContentWrapper>
    )
  }

  if (error) {
    return (
      <ModalContentWrapper>
        <Heading>{error}</Heading>
      </ModalContentWrapper>
    )
  }

  return (
    <ModalContentWrapper>
      <Heading>Account activated!</Heading>
      <Button onClick={() => setActiveFormKey("login")}>Go to login</Button>
    </ModalContentWrapper>
  )
}
