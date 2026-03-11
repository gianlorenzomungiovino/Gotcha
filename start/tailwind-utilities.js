/**
 * Utility functions per Tailwind CSS
 * Questo file esporta le utility di base per essere importato nei componenti React/Vue
 */

// Esporta le utility Tailwind v4
export const tailwindUtilities = {
  // Spaziatura
  spacing: {
    px: 'px',
    ps: 'ps',
    pe: 'pe',
    pt: 'pt',
    pb: 'pb',
    pl: 'pl',
    pr: 'pr',
    pm: 'pm',
    ml: 'ml',
    mr: 'mr',
    mt: 'mt',
    mb: 'mb',
    mp: 'mp',
    ms: 'ms',
    me: 'me',
    pt_0: 'pt-0',
    pb_0: 'pb-0',
    pl_0: 'pl-0',
    pr_0: 'pr-0',
    pt_1: 'pt-1',
    pb_1: 'pb-1',
    pl_1: 'pl-1',
    pr_1: 'pr-1',
    pt_2: 'pt-2',
    pb_2: 'pb-2',
    pl_2: 'pl-2',
    pr_2: 'pr-2',
    pt_4: 'pt-4',
    pb_4: 'pb-4',
    pl_4: 'pl-4',
    pr_4: 'pr-4',
    pt_8: 'pt-8',
    pb_8: 'pb-8',
    pl_8: 'pl-8',
    pr_8: 'pr-8',
  },

  // Display
  display: {
    none: 'hidden',
    block: 'block',
    inline: 'inline',
    inline_block: 'inline-block',
    flex: 'flex',
    inline_flex: 'inline-flex',
    grid: 'grid',
    inline_grid: 'inline-grid',
  },

  // Flexbox
  flex: {
    0: 'flex-0',
    1: 'flex-1',
    auto: 'flex-auto',
    initial: 'flex-initial',
    none: 'flex-none',
  },

  // Grid
  grid: {
    col_1: 'grid-cols-1',
    col_2: 'grid-cols-2',
    col_3: 'grid-cols-3',
    col_4: 'grid-cols-4',
    col_5: 'grid-cols-5',
    col_6: 'grid-cols-6',
  },

  // Colors (Gotcha custom colors)
  colors: {
    primary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },

  // Typography
  typography: {
    text_sm: 'text-sm',
    text_base: 'text-base',
    text_large: 'text-lg',
    text_xl: 'text-xl',
    text_2xl: 'text-2xl',
    text_3xl: 'text-3xl',
    font_bold: 'font-bold',
    font_normal: 'font-normal',
    font_light: 'font-light',
  },

  // Border radius
  rounded: {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  },

  // Shadows
  shadow: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  },

  // Z-index
  zindex: {
    auto: 'auto',
    0: 'z-0',
    10: 'z-10',
    20: 'z-20',
    30: 'z-30',
    40: 'z-40',
    50: 'z-50',
  },

  // Position
  position: {
    static: 'static',
    relative: 'relative',
    absolute: 'absolute',
    fixed: 'fixed',
    sticky: 'sticky',
  },

  // Overflow
  overflow: {
    auto: 'overflow-auto',
    hidden: 'overflow-hidden',
    visible: 'overflow-visible',
    scroll: 'overflow-scroll',
  },
}

// Esporta le utility per essere usate nei componenti React/Vue
export const useTailwind = () => {
  return tailwindUtilities
}
