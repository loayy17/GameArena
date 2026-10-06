const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;

const BUG_REPORT_MAILTO = SUPPORT_EMAIL
    ? `mailto:${SUPPORT_EMAIL}?subject=GameArena%20Bug%20Report`
    : null;

export { BUG_REPORT_MAILTO, SUPPORT_EMAIL };

