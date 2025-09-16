// Stub components for legacy components moved to _quarantine
// These are empty components to prevent import errors

// Removed OpenCopilotButton - CopilotPanel is now the single source of truth

export const SimulationDrawer = () => null;
export const SimulationResultPanel = () => null;
export const SimulationStickyBar = () => null;
export const CopilotPanel = ({ datasetId }: { datasetId: string }) => null;

// Dashboard component stubs
export const ExecutiveKpiCard = ({ title, value, icon, isHighlighted, yoyDelta }: any) => null;
export const ExecutivePayGapTrend = () => null;
export const ExecutiveRiskPanel = () => null;
export const ExecutiveInsightsFeed = () => null;
export const ExecutiveSuggestedActions = () => null;

// Insights component stubs
export const InsightCard = ({ insight }: any) => null;
export const SeverityBadge = ({ severity }: any) => null;

// Default export for InsightCard
export default InsightCard;
