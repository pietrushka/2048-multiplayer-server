import { useState } from "react"
import { MdContentCopy } from "react-icons/md"
import { ImCheckmark } from "react-icons/im"
import { Button } from "./Common"

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <Button
      disabled={copied}
      onClick={() => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
    >
      {copied ? (
        <>
          <span>Copied</span>
          <ImCheckmark />
        </>
      ) : (
        <>
          <span>Copy join url</span>
          <MdContentCopy />
        </>
      )}
    </Button>
  )
}
