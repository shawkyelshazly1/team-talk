import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SentMessage() {
	return (
		<div className="flex flex-row-reverse gap-1 w-fit max-w-2/3 ml-auto">
			<Avatar className="w-10 h-10">
				<AvatarImage
					loading="lazy"
					src="https://avatar.iran.liara.run/public/boy"
					alt="User avatar"
				/>
				<AvatarFallback>un</AvatarFallback>
			</Avatar>
			<div className="flex flex-col gap-1 ml-auto">
				<p className="text-sm font-medium ml-auto">John Doe</p>
				<p className="text-sm text-muted-foreground bg-[#ecf3fe] rounded-lg p-2 ">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
					quos.Lorem ipsum dolor sit amet consectetur adipisicing elit.
					Quisquam, quos.Lorem ipsum dolor sit amet consectetur adipisicing
					elit. Quisquam, quos.Lorem ipsum dolor sit amet consectetur
					adipisicing elit. Quisquam, quos.Lorem ipsum dolor sit amet
					consectetur adipisicing elit. Quisquam, quos.
				</p>
				<p className="text-xs text-muted-foreground ">2:30 PM</p>
			</div>
		</div>
	);
}
