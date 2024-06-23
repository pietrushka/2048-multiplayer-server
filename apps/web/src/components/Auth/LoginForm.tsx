import { useNavigate } from "react-router-dom"
import { useForm, SubmitHandler } from "react-hook-form"
import { Form, Button, Heading, Input, Error } from "./AuthCommon"

type FormValues = {
  email: string
  password: string
}

export default function Login() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
    setError,
  } = useForm<FormValues>()

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const url = `${process.env.REACT_APP_SERVER_URL}/user/login`
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      })

      if (response.ok) {
        navigate("/")
        return
      }

      const errorData = await response.json()
      setError("root.serverError", {
        message: errorData.message,
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Heading>Login</Heading>
      <div>
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
      </div>

      <div>
        <Input
          id="password"
          type="password"
          placeholder="Password"
          {...register("password", {
            required: "Password is required",
          })}
        />
        <Error>{errors.password?.message}</Error>
      </div>

      <Button type="submit" disabled={isLoading}>
        Login
      </Button>
      <Error>{errors?.root?.serverError?.message}</Error>
    </Form>
  )
}
