'use client'

import { useFormStatus } from "react-dom"
import { Button } from "./ui/button"
import { PropsWithChildren } from "react"

//
 
export function SubmitButton({children} : PropsWithChildren) {
 const { pending } = useFormStatus();
 const content = children ?? 'Submit'
  return (
    <Button className="rounded cursor-pointer p-1"  type="submit">
      { pending ? '...' : content }
    </Button>
  )
}