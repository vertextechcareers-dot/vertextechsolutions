export type SecuredFile = {
  id: string;
  name: string;
  description: string | null;
  file_path: string | null;
  file_size: number | null;
  file_type: string | null;
  original_filename: string | null;
  access_code: string;
  secret_phrase: string | null;
  external_url: string | null;
  download_count: number;
  created_at: string;
};