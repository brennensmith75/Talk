import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import React from 'react'

export function EmojiPicker({
  onChange,
  value
}: {
  onChange: Function
  value: any
}) {
  const [selectedEmoji, setSelectedEmoji] = React.useState(value)
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    onChange(selectedEmoji)
    setIsOpen(false)
  }, [selectedEmoji, onChange])

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          className="mt-8 h-9 w-9 rounded-full p-2 text-center"
          variant="outline"
        >
          {selectedEmoji}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="">
        <Picker
          data={data}
          onEmojiSelect={(value: any) => setSelectedEmoji(value.native)}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
