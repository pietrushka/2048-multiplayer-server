import { Link } from "react-router-dom"
import styled from "@emotion/styled"

import { usePlayer } from "../hooks/usePlayer"

function Home() {
  const { nickname, setNickname, bestScore } = usePlayer()!

  return (
    <HomePage>
      <Heading>2048.vs</Heading>
      <BestScore>Best score: {bestScore}</BestScore>
      <NicknameLabel htmlFor="nickname-input">Your nickname:</NicknameLabel>
      <NicknameInput value={nickname} onChange={(e) => setNickname(e.target.value)} id="nickname-input" />

      <Menu>
        <MenuOption color="green">
          <Link to="/singleplayer">Singleplayer</Link>
        </MenuOption>
        <MenuOption color="blue">
          <Link to="/multiplayer">Multiplayer</Link>
        </MenuOption>
      </Menu>
    </HomePage>
  )
}

export default Home

const HomePage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`

const Heading = styled.div`
  font-size: 5rem;
  margin: 0 0 1rem 0;
  @media (min-width: 480px) {
    font-size: 6rem;
  }
  @media (min-width: 768px) {
    font-size: 7rem;
  }
  @media (min-width: 1024px) {
    font-size: 6rem;
  }
`

const BestScore = styled.p`
  margin: 1em auto;
  text-align: center;
  font-size: 1.25rem;
`

const NicknameLabel = styled.label`
  display: block;
  margin: 0 auto;
  text-align: center;
  font-size: 1.25rem;
  @media (min-width: 480px) {
    font-size: 1.5rem;
  }
  @media (min-width: 768px) {
    font-size: 1.75rem;
  }
  @media (min-width: 1024px) {
    font-size: 1.5rem;
  }
`

const NicknameInput = styled.input`
  background: #eee4da;
  color: #776e65;
  border-radius: 1rem;
  border: none;
  font-size: 1.5rem;
  margin: 0.25em 0;
  padding: 0.25em 0.25em;
  text-align: center;
  @media (min-width: 480px) {
    font-size: 1.75rem;
  }
  @media (min-width: 768px) {
    font-size: 2rem;
  }
  @media (min-width: 1024px) {
    font-size: 1.75rem;
  }
`

export const Menu = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`

type MenuOptionProps = {
  color: string
}

export const MenuOption = styled.li`
  width: 70%;
  font-size: 1.5rem;
  margin: 0.6em 0;
  border-radius: 1em;
  background: ${(props: MenuOptionProps) => `var(--${props.color})`};

  & > * {
    font-size: 1.5rem;
    margin: 0;
    width: 100%;
    font-weight: 600;
    display: block;
    text-align: center;
    color: #e1eef6;
    letter-spacing: 1px;
    padding: 0.5em 0;
    cursor: pointer;
    border-radius: 1em;
    background: ${(props: MenuOptionProps) => `var(--${props.color})`};
  }

  @media (min-width: 480px) {
    font-size: 1.75rem;
  }
  @media (min-width: 768px) {
    font-size: 2rem;
  }
  @media (min-width: 1024px) {
    font-size: 1.75rem;
  }
`
