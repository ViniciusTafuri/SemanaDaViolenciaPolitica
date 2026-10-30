export type SubmittedValues = {
  category?: string;
  isIndigenous?: boolean;
  title?: string;
  text?: string;
  incidentDate?: string;
  sources?: string[];
  donationLink?: string;
  submitterNote?: string;
  submitterName?: string;
  submitterEmail?: string;
};

export type FormState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  values?: SubmittedValues;
  // Changes on every failed submission so forms can remount their
  // uncontrolled fields with the values the user actually typed, since
  // React/the browser otherwise clears them after any form action attempt.
  attempt?: number;
};

export const INITIAL_FORM_STATE: FormState = { ok: false };
