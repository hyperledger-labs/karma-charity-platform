export enum ProjectStatus {
    DRAFT = 'draft',
    ON_VERIFICATION = 'on_verification',
    VERIFIED = 'verified',
    ACTIVE = 'active',
    CLOSED = 'closed',
    REJECTED = 'rejected',
    FUNDS_PREPARE_WITHDRAWAL = 'funds_prepare_withdrawal',
    FUNDS_RAISED = 'funds_raised',
    FUNDS_PREWITHDRAWN = 'funds_prewithdrawn',
    FUNDS_WITHDRAWN = 'funds_withdrawn',
    WAIT_FOR_REPORT = 'wait_for_report',
    REPORT_CONFIRMED = 'report_confirmed',
    COMPLETED = 'completed'
}

export const ProjectPublicStatus = [
    ProjectStatus.ACTIVE,
    ProjectStatus.FUNDS_RAISED,
    ProjectStatus.FUNDS_WITHDRAWN,
    ProjectStatus.FUNDS_PREPARE_WITHDRAWAL,
    ProjectStatus.COMPLETED
];
