export interface Certification {
  name: string;
  image: string; // path or URL to the certificate image
  link?: string; // optional verification/credential link
}

// No certifications listed on your CV yet — add them here when you have them.
export const certifications: Certification[] = [];
