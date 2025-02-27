import { useForm, SubmitHandler } from "react-hook-form"
import { Form, Button, Heading, Input, Error, InputGroup, ModalContentWrapper, Text, ButtonLikeLink } from "../Common"
import useAuthFormParam from "../../hooks/useAuthFormParam"
import { FaGoogle } from "react-icons/fa"
import constants from "../../constants"

type FormValues = {
  nickname: string
  email: string
  password: string
}

export default function RegisterForm() {
  const { setActiveFormKey } = useAuthFormParam()
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading, isSubmitSuccessful },
    setError,
  } = useForm<FormValues>()

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const url = `${process.env.REACT_APP_SERVER_URL}/user/register`
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
    } catch (error) {
      console.error(error)
    }
  }

  if (isSubmitSuccessful) {
    return (
      <ModalContentWrapper>
        <Heading>You have successfully registered</Heading>
        <p>Check your email for the activation link</p>
      </ModalContentWrapper>
    )
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Heading>Register</Heading>
      <InputGroup>
        <Input id="nickname" {...register("nickname", { required: "Last name is required" })} placeholder="Nickname" />
        <Error>{errors.nickname?.message}</Error>
      </InputGroup>

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
        Register
      </Button>

      <ButtonLikeLink href={constants.oAuthGoogleUrl}>
        <FaGoogle />
        Sign in with Google
      </ButtonLikeLink>

      <Text>
        Already have an account?{" "}
        <b style={{ cursor: "pointer" }} onClick={() => setActiveFormKey("login")}>
          Login
        </b>
      </Text>

      <Error>{errors?.root?.serverError?.message}</Error>
    </Form>
  )
}
