import { useSearchParams } from "react-router-dom"
import { useForm, SubmitHandler } from "react-hook-form"
import { Form, Button, Heading, Input, Error, InputGroup, ModalContentWrapper } from "../Common"
import useAuthFormParam from "./useAuthFormParam"

type FormValues = {
  password: string
}

export default function ResetPasswordForm() {
  const { register, handleSubmit, formState, setError } = useForm<FormValues>()
  const { errors, isLoading, isSubmitSuccessful } = formState
  const [currentQueryParameters] = useSearchParams()
  const token = currentQueryParameters.get("token")
  const { closeModal, setActiveFormKey } = useAuthFormParam()

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const url = `${process.env.REACT_APP_SERVER_URL}/user/reset-password/${token}`
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (response.ok) {
      return
    }

    const errorData = await response.json()
    setError("root.serverError", {
      message: errorData.message,
    })
  }

  if (!token) {
    // TODO not sure if this ok
    closeModal()
    return null
  }

  if (isSubmitSuccessful) {
    return (
      <ModalContentWrapper>
        <Heading>Password changed!</Heading>
        <Button onClick={() => setActiveFormKey("login")}>Go to login</Button>
      </ModalContentWrapper>
    )
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Heading>ResetPassword</Heading>
      <InputGroup>
        <Input
          id="password"
          type="password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must have at least 8 characters",
            },
          })}
          placeholder="Password"
        />
        <Error>{errors.password?.message}</Error>
      </InputGroup>

      <Button type="submit" disabled={isLoading}>
        Change password
      </Button>
      <Error>{errors?.root?.serverError?.message}</Error>
    </Form>
  )
}
