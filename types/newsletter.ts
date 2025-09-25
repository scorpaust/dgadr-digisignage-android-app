export type NewsletterIssue = {
  id: string;
  title: string;
  description?: string;
  publishedAt: string; // ISO string
  url: string;
  coverImagePath?: string;
};

export type NewsletterCollection = {
  id: string;
  name: string;
  color: string;
  issues: NewsletterIssue[];
};
