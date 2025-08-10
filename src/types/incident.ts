export interface IncidentReport {
  id: string;
  title: string;
  severity: 'P1' | 'P2' | 'P3' | 'P4';
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  startTime: Date;
  endTime?: Date;
  description: string;
  impactedServices: string[];
  timeline: TimelineEntry[];
  rootCause?: string;
  resolution?: string;
  actionItems?: ActionItem[];
}

export interface TimelineEntry {
  timestamp: Date;
  user: string;
  action: string;
  details: string;
}

export interface ActionItem {
  id: string;
  description: string;
  assignee: string;
  dueDate?: string;
  status: 'open' | 'in-progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
}

export interface ConfluenceTemplate {
  id: string;
  name: string;
  spaceKey: string;
  labels: string[];
  sections: TemplateSection[];
}

export interface TemplateSection {
  title: string;
  type: 'heading1' | 'heading2' | 'heading3' | 'paragraph' | 'table' | 'code' | 'note';
  content?: string;
  children?: TemplateSection[];
}

export interface ConfluenceMetadata {
  spaceKey: string;
  parentId?: string;
  labels: string[];
  templateId?: string;
}
