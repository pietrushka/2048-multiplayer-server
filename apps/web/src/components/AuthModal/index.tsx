import Modal from "../Modal"
import RegisterForm from "./RegisterForm"
import LoginForm from "./LoginForm"
import ForgotPasswordForm from "./ForgotPasswordForm"
import ResetPasswordForm from "./ResetPasswordForm"
import useAuthFormParam from "./useAuthFormParam"

const authFormMap = {
  register: RegisterForm,
  login: LoginForm,
  forgotPassword: ForgotPasswordForm,
  resetPassword: ResetPasswordForm,
}

export default function AuthModal() {
  const { activeFormKey, closeModal } = useAuthFormParam()

  if (!activeFormKey) return null

  const ActiveForm = authFormMap[activeFormKey]
  return (
    <Modal closeModal={closeModal}>
      <ActiveForm />
    </Modal>
  )
}
