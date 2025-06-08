'use client';
import { useUIStore } from "@/stores/useUIStore";
import { useUserStore } from "@/stores/useUserStore";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export const useConversationUrlSync = () => {
    const params = useParams();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { user } = useUserStore();
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
        else if (pathname === '/app' && user.role === 'team_lead') {

            const conversationId = searchParams.get('conversation_id');
            setSelectedConversationId(conversationId || '');
            setViewMode('team-leader-multi');
            return;
        } else if (pathname === '/app/inbox') {

            const conversationId = searchParams.get('conversation_id');
            setSelectedConversationId(conversationId || '');
            setViewMode('csr-inbox');
            return;
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