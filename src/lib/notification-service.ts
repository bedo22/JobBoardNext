/**
 * Centralized Notification Service
 * 
 * This service provides a single interface for creating notifications across the app.
 * It ensures consistent formatting, proper routing, and includes all necessary metadata.
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

// Singleton admin client for performance
let adminClientInstance: ReturnType<typeof createSupabaseClient<Database>> | null = null

function getAdminClient() {
    if (!adminClientInstance) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY!

        if (!supabaseUrl || !supabaseSecretKey) {
            throw new Error('Missing Supabase environment variables')
        }

        adminClientInstance = createSupabaseClient<Database>(supabaseUrl, supabaseSecretKey)
    }

    return adminClientInstance
}

// Notification types
export type NotificationType = 'new_message' | 'new_application' | 'application_update' | 'system'
export type RelatedType = 'conversation' | 'job' | 'application' | 'system'

interface BaseNotificationParams {
    userId: string
    senderId?: string
    type: NotificationType
    title: string
    message: string
}

interface MessageNotificationParams extends BaseNotificationParams {
    conversationId: string
    jobId: string
    jobTitle: string
    messagePreview: string
    senderName: string
    recipientRole: 'employer' | 'seeker'
}

interface ApplicationNotificationParams extends BaseNotificationParams {
    applicationId: string
    jobId: string
    jobTitle: string
    applicantName: string
}

interface SystemNotificationParams extends BaseNotificationParams {
    link?: string
}

/**
 * Send a message notification with proper routing and context
 */
export async function sendMessageNotification(params: MessageNotificationParams) {
    const { 
        userId, 
        senderId, 
        conversationId, 
        jobId, 
        jobTitle, 
        messagePreview, 
        senderName,
        recipientRole
    } = params

    // Generate role-specific link
    const link = recipientRole === 'employer'
        ? `/dashboard/applicants/${jobId}?chat=${conversationId}`
        : `/messages/${conversationId}`

    const adminClient = getAdminClient()

    const { error } = await adminClient
        .from('notifications')
        .insert({
            user_id: userId,
            sender_id: senderId,
            type: 'new_message',
            title: 'New Message',
            message: `${senderName}: "${messagePreview.slice(0, 50)}${messagePreview.length > 50 ? '...' : ''}"`,
            link,
            related_id: conversationId,
            related_type: 'conversation',
            metadata: {
                jobId,
                jobTitle,
                conversationId,
                messagePreview,
                senderName,
                recipientRole
            },
            is_read: false
        })

    if (error) {
        console.error('Failed to send message notification:', error)
        return { error: error.message }
    }

    return { success: true }
}

/**
 * Send an application notification
 */
export async function sendApplicationNotification(params: ApplicationNotificationParams) {
    const { userId, senderId, applicationId, jobId, jobTitle, applicantName } = params

    const link = `/dashboard/applicants/${jobId}`

    const adminClient = getAdminClient()

    const { error } = await adminClient
        .from('notifications')
        .insert({
            user_id: userId,
            sender_id: senderId,
            type: 'new_application',
            title: 'New Application',
            message: `${applicantName} applied for "${jobTitle}"`,
            link,
            related_id: applicationId,
            related_type: 'application',
            metadata: {
                applicationId,
                jobId,
                jobTitle,
                applicantName
            },
            is_read: false
        })

    if (error) {
        console.error('Failed to send application notification:', error)
        return { error: error.message }
    }

    return { success: true }
}

/**
 * Send an application status update notification
 */
export async function sendApplicationUpdateNotification(params: {
    userId: string
    applicationId: string
    jobId: string
    jobTitle: string
    status: string
}) {
    const { userId, applicationId, jobId, jobTitle, status } = params

    const link = `/dashboard`

    const statusMessages: Record<string, string> = {
        'accepted': `Your application for "${jobTitle}" has been accepted!`,
        'rejected': `Your application for "${jobTitle}" has been reviewed`,
        'interview': `You've been invited to interview for "${jobTitle}"`,
    }

    const message = statusMessages[status] || `Your application for "${jobTitle}" has been updated`

    const adminClient = getAdminClient()

    const { error } = await adminClient
        .from('notifications')
        .insert({
            user_id: userId,
            type: 'application_update',
            title: 'Application Update',
            message,
            link,
            related_id: applicationId,
            related_type: 'application',
            metadata: {
                applicationId,
                jobId,
                jobTitle,
                status
            },
            is_read: false
        })

    if (error) {
        console.error('Failed to send application update notification:', error)
        return { error: error.message }
    }

    return { success: true }
}

/**
 * Send a system notification
 */
export async function sendSystemNotification(params: SystemNotificationParams) {
    const { userId, title, message, link = '/dashboard' } = params

    const adminClient = getAdminClient()

    const { error } = await adminClient
        .from('notifications')
        .insert({
            user_id: userId,
            type: 'system',
            title,
            message,
            link,
            related_type: 'system',
            metadata: {},
            is_read: false
        })

    if (error) {
        console.error('Failed to send system notification:', error)
        return { error: error.message }
    }

    return { success: true }
}

/**
 * Helper to get notification link based on type and metadata
 */
export function getNotificationLink(notification: {
    type: string
    related_type: string | null
    related_id: string | null
    metadata: Record<string, string | number | boolean | null>
    link: string | null
}, userRole: 'employer' | 'seeker'): string {
    // Use custom link if provided
    if (notification.link && notification.link !== '/dashboard') {
        return notification.link
    }

    // Route based on notification type and user role
    switch (notification.type) {
        case 'new_message':
            if (userRole === 'employer' && notification.metadata?.jobId) {
                return `/dashboard/applicants/${notification.metadata.jobId}?chat=${notification.related_id}`
            }
            return `/messages/${notification.related_id}`

        case 'new_application':
        case 'application_update':
            if (userRole === 'employer') {
                return `/dashboard/applicants/${notification.metadata?.jobId || notification.related_id}`
            }
            return '/dashboard'

        case 'system':
        default:
            return notification.link || '/dashboard'
    }
}

/**
 * Get icon name for notification type
 */
export function getNotificationIcon(type: string): string {
    const icons: Record<string, string> = {
        'new_message': 'MessageCircle',
        'new_application': 'Briefcase',
        'application_update': 'FileCheck',
        'system': 'Bell'
    }
    return icons[type] || 'Bell'
}
