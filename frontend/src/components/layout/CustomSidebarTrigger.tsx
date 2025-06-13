"use client";
import { PanelRightIcon } from "lucide-react";
import { useSidebar } from "../ui/sidebar";

export default function CustomSidebarTrigger() {
	const { toggleSidebar } = useSidebar();
	return <PanelRightIcon onClick={toggleSidebar} className="cursor-pointer" />;
}
