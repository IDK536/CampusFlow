import type { ReactNode } from 'react'
import { Icon, type IconName } from '../icons/Icon'

interface EmptyStateProps {
  icon?: IconName
  title: string
  children?: ReactNode
  action?: ReactNode
  compact?: boolean
}

export const EmptyState = ({ icon = 'info', title, children, action, compact = false }: EmptyStateProps) => (
  <div className={`empty-state${compact ? ' empty-state--compact' : ''}`}>
    <span className="empty-state__mark">
      <Icon name={icon} size={compact ? 20 : 26} />
    </span>
    <p className="empty-state__title">{title}</p>
    {children && <div className="empty-state__text">{children}</div>}
    {action && <div className="empty-state__action">{action}</div>}
  </div>
)
