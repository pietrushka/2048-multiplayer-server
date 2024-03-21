import { ReactNode } from "react"
import { Link } from "react-router-dom"
import styled from "@emotion/styled"
import COLORS from "../styles/colors"

export const LinkList = styled.div({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "1.5em",
  padding: "1em",
})

type ButtonProps = {
  href: string
  children: ReactNode
  onClick?: () => void
  bgColor: keyof typeof COLORS
}

export default function StyledLink({ children, bgColor, href, onClick }: ButtonProps) {
  return (
    <LinkButton to={href} onClick={onClick} bgColor={bgColor}>
      <LinkText>{children}</LinkText>
    </LinkButton>
  )
}

const LinkButton = styled(Link)<Pick<ButtonProps, "bgColor">>(
  {
    borderRadius: "1.5rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: ".4em 0",
    fontSize: "1.5rem",
    minWidth: 300,
  },
  (props) => ({
    background: COLORS[props.bgColor],
  }),
)

const LinkText = styled.span({
  fontSize: "1.5rem",
  fontWeight: 600,
  color: COLORS.lightFont,
  textAlign: "center",
})
