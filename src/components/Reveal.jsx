import { useScrollReveal } from '../hooks/useScrollReveal'

export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const [ref, visible] = useScrollReveal()

  return (
    <Tag
      ref={ref}
      className={`reveal${visible ? ' reveal-visible' : ''}${className ? ` ${className}` : ''}`}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
