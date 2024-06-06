import { Github } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import Link from "next/link"

export function ProfileCard() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <p className="text-xs font-medium underline-offset-4 hover:underline">@gilangf</p>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between gap-2">
          <Avatar>
            <AvatarImage src="/logo/avatar.webp" />
            <AvatarFallback>GF</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="text-sm font-semibold">@gilangf</h4>
            <p className="text-sm font-normal mt-[2px]">
              money can&apos;t buy happiness, but a lot of money can.
            </p>
            <div className="flex items-center pt-2 gap-1">
              <Github className="h-4 w-4 opacity-70" />{" "}
              <Link href={"https://github.com/gilangfatahilah"} className="text-xs font-normal text-muted-foreground hover:text-primary">
                @gilangfatahilah
              </Link>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
