/**
 * VNSIR UI Component Library — Public API
 * Single import point for all shared components.
 *
 * Usage:
 *   import { Button, ReportCard, Badge, Modal } from '@/components/ui'
 */

// Button
export { Button } from './Button'
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button'

// Form inputs
export { Input, Select, Textarea, FormGroup, isCorporateEmail, validateCorporateEmail } from './Input'
export type { InputProps, SelectProps, TextareaProps, FormGroupProps } from './Input'

// Badge / Tags
export { Badge } from './Badge'
export type { BadgeProps, Sector, ReportStatus } from './Badge'

// Cards
export { ReportCard, BriefCard, Card, CardBody } from './Card'
export type { ReportCardProps, BriefCardProps, CardProps } from './Card'

// Modal
export { Modal } from './Modal'
export type { ModalProps } from './Modal'

// Navigation
export { Header, SectorTabs, Breadcrumb } from './Navigation'
export type { HeaderProps, TabsProps, BreadcrumbItem, BreadcrumbProps, SectorFilter } from './Navigation'

// Alerts & Toast
export { Alert, TrustSignal, Toast, ToastContainer } from './Alert'
export type { AlertProps, AlertVariant, TrustSignalProps, ToastItem, ToastProps } from './Alert'

// Skeleton loaders
export { Skeleton, SkeletonReportCard, SkeletonBriefCard } from './Skeleton'

// Class name utility
export { cn } from '@/lib/cn'
