import { useForm, SubmitHandler } from "react-hook-form"
import { Form, Button, Heading, Input, Error, InputGroup, ModalContentWrapper } from "../Common"

type FormValues = {
  email: string
}

export default function ForgotPasswordForm() {
  const { register, handleSubmit, formState, setError } = useForm<FormValues>()
  const { errors, isLoading, isSubmitSuccessful } = formState

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const url = `${process.env.REACT_APP_SERVER_URL}/user/forgot-password/${data.email}`
    const response = await fetch(url, {
      method: "POST",
    })

    if (response.ok) {
      return
    }

    const errorData = await response.json()
    setError("root.serverError", {
      message: errorData.message,
    })
  }

  if (isSubmitSuccessful) {
    return (
      <ModalContentWrapper>
        <Heading>Email sent! Check your inbox.</Heading>
      </ModalContentWrapper>
    )
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Heading>Forgot password?</Heading>
      <InputGroup>
        <Input
          id="email"
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "Enter a valid email address",
            },
          })}
          placeholder="Email"
        />
        <Error>{errors.email?.message}</Error>
      </InputGroup>

      <Button type="submit" disabled={isLoading}>
        Send recovery link
      </Button>
      <Error>{errors?.root?.serverError?.message}</Error>
    </Form>
  )
}
