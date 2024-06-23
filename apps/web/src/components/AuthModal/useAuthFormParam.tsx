import { useSearchParams } from "react-router-dom"

type ActiveFromKey = "register" | "login" | "forgotPassword" | "resetPassword" | undefined

const queryParamKey = "authForm"

export default function useAuthFormParam() {
  const [currentQueryParameters, setSearchParams] = useSearchParams()
  const activeFormKey = currentQueryParameters.get(queryParamKey) as ActiveFromKey

  function closeModal() {
    setSearchParams(new URLSearchParams())
  }

  function setActiveFormKey(key: ActiveFromKey) {
    if (key === activeFormKey) return

    if (key) {
      return setSearchParams(new URLSearchParams({ [queryParamKey]: key }))
    }

    closeModal()
  }

  return { activeFormKey, setActiveFormKey, closeModal }
}
