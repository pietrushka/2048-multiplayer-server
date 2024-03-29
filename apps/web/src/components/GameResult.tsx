import StyledLink, { LinkList } from "./StyledLink"
import Modal from "./Modal"

interface GameResultProps {
  result?: string
}

export default function GameResult({ result }: GameResultProps) {
  return (
    <Modal>
      <h1>{result}</h1>
      <LinkList>
        <StyledLink bgColor="red" href="/">
          Go to menu
        </StyledLink>
      </LinkList>
    </Modal>
  )
}
