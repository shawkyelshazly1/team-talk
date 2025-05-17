import { Button } from "@/components/ui/button";
import Link from "next/link";
import SubmitAsButton from "./buttons/SubmitAsButton";
import PendingBadge from "../../common/badges/PendingBadge";
import SolvedBadge from "../../common/badges/SolvedBadge";
import NewBadge from "../../common/badges/NewBadge";
import UserInfoAvatar from "../../common/cards/UserInfoAvatar";
export default function ChatHeader() {
	return (
		<div className="flex flex-row items-center justify-between border-b border-border pb-4">
			<div className="flex flex-row gap-2">
				<UserInfoAvatar
					user={{
						id: "1",
						name: "John Doe",
						email: "email@example.com",
						image: "https://avatar.iran.liara.run/public/boy",
						role: "csr",
					}}
				/>

				<SolvedBadge />
				<PendingBadge />
				<NewBadge />
			</div>
			<div className="flex flex-row gap-2">
				<div className="flex flex-row gap-2">
					<Button
						variant="default"
						className="bg-blue-500 font-medium hover:bg-blue-600"
					>
						<Link href="#" target="_blank">
							Open Ticket
						</Link>
					</Button>
				</div>
				<SubmitAsButton />
			</div>
		</div>
	);
}
