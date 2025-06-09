'use client';
import { useUIStore } from "@/stores/useUIStore";
import { useUserStore } from "@/stores/useUserStore";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export const useConversationUrlSync = () => {
    const params = useParams();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { user, userStatus } = useUserStore();
    const { setSelectedConversationId, setViewMode } = useUIStore();


    useEffect(() => {
        if (!user) return;


        // single conversation view: /app/conversations/[id]
        if (pathname.startsWith('/app/conversation/') && params.id) {

            setSelectedConversationId(params.id as string);
            setViewMode('single-conversation');
            return;
        }

        // multi conversation view: /app?conversation_id=xxx ( team lead only)
        else if (pathname === '/app' && user.role === 'team_lead' && userStatus === 'online') {

            const conversationId = searchParams.get('conversation_id');
            setSelectedConversationId(conversationId || '');
            setViewMode('team-leader-multi');
            return;

            // csr inbox view: /app/inbox?conversation_id=xxx
        } else if (pathname === '/app/inbox') {

            const conversationId = searchParams.get('conversation_id');
            setSelectedConversationId(conversationId || '');
            setViewMode('csr-inbox');
            return;

        } else {
            setSelectedConversationId('');
            // Clear conversation_id from URL if it exists
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has('conversation_id')) {
                urlParams.delete("conversation_id");
                const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
                window.history.replaceState({}, "", newUrl);
            }
        }

        // Fallback: Handle unexpected combinations
        // Redirect to appropriate page based on role
        if (user.role === 'team_lead' && pathname !== '/app') {
            window.location.href = '/app';
        } else if (user.role === 'csr' && !pathname.startsWith('/app/inbox') && !pathname.startsWith('/app/search')) {
            window.location.href = '/app/inbox';
        }


    }, [params.id, searchParams, pathname, user, setSelectedConversationId, setViewMode]);

};