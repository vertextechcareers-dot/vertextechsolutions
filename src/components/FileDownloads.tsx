import React, { useState } from 'react';
import { Shield, Lock, FileText, Download, KeyRound, Check, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface SecuredFile {
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
}

const FileDownloads = () => {
  const [secretPhrase, setSecretPhrase] = useState('');
  const [files, setFiles] = useState<SecuredFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  const verifyPhrase = async () => {
    const phrase = secretPhrase.trim();
    if (!phrase) {
      toast.error('Please enter the secret phrase');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('secured_files')
        .select('*')
        .eq('secret_phrase', phrase)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        setShake(true);
        setTimeout(() => setShake(false), 500);
        toast.error('Invalid secret phrase. Please check and try again.');
        setFiles([]);
        setVerified(false);
        return;
      }

      setFiles(data);
      setVerified(true);
      toast.success(`Access granted — ${data.length} file(s) available`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to verify secret phrase');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (file: SecuredFile) => {
    setDownloadingId(file.id);
    try {
      const { error: updateError } = await supabase
        .from('secured_files')
        .update({ download_count: file.download_count + 1 })
        .eq('id', file.id);

      if (updateError) throw updateError;

      if (file.external_url) {
        window.open(file.external_url, '_blank');
        toast.success(`Opening ${file.name}`);
        return;
      }

      if (!file.file_path) {
        throw new Error('No file or external link available');
      }

      const { data: signedUrl, error: signError } = await supabase.storage
        .from('secured-files')
        .createSignedUrl(file.file_path, 60);

      if (signError || !signedUrl) throw signError || new Error('Failed to generate download URL');

      const response = await fetch(signedUrl.signedUrl);
      if (!response.ok) throw new Error('Failed to fetch file for download');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const downloadName = file.original_filename || (file.name + (file.file_type ? `.${file.file_type.split('/').pop()}` : ''));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = downloadName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      toast.success(`Downloading ${file.name}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to download file');
    } finally {
      setDownloadingId(null);
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-32 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-brand-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield size={32} className="text-brand-blue" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Secure File Download Center
          </h1>
          <p className="text-slate-500 max-w-lg mx-auto">
            Access your files securely using the secret phrase provided by Vertex Tech Solutions.
          </p>
        </div>

        {!verified ? (
          /* Secret Phrase Form */
          <Card className={`border-none shadow-lg max-w-md mx-auto transition-transform ${shake ? 'animate-shake' : ''}`}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lock size={20} className="text-brand-blue" />
                Enter Secret Phrase
              </CardTitle>
              <CardDescription>
                Please enter the secret phrase you received from our team to view and download files.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Input
                  value={secretPhrase}
                  onChange={(e) => setSecretPhrase(e.target.value)}
                  placeholder="Enter secret phrase"
                  className="flex-1 text-center"
                  onKeyDown={(e) => e.key === 'Enter' && verifyPhrase()}
                />
              </div>
              <Button
                onClick={verifyPhrase}
                disabled={loading}
                className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <KeyRound size={18} className="mr-2" />
                    Unlock Files
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* File List */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Check size={18} className="text-green-500" />
                Access verified — {files.length} file(s) available
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setVerified(false);
                  setSecretPhrase('');
                  setFiles([]);
                }}
                className="text-slate-500"
              >
                <Lock size={16} className="mr-1" /> Lock again
              </Button>
            </div>

            {files.map((file) => (
              <Card key={file.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-brand-blue/10 rounded-xl flex items-center justify-center shrink-0">
                      {file.external_url ? (
                        <ExternalLink size={28} className="text-brand-blue" />
                      ) : (
                        <FileText size={28} className="text-brand-blue" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 truncate">{file.name}</h3>
                      {file.description && (
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{file.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                        {!file.external_url && <span>{formatFileSize(file.file_size)}</span>}
                        {file.file_type && <span>{file.file_type}</span>}
                        {file.external_url && <span>External link</span>}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDownload(file)}
                      disabled={downloadingId === file.id}
                      className="bg-brand-blue hover:bg-brand-blue/90 text-white shrink-0"
                    >
                      {downloadingId === file.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          {file.external_url ? 'Opening...' : 'Downloading...'}
                        </>
                      ) : (
                        <>
                          {file.external_url ? (
                            <>
                              <ExternalLink size={18} className="mr-2" />
                              Open
                            </>
                          ) : (
                            <>
                              <Download size={18} className="mr-2" />
                              Download
                            </>
                          )}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileDownloads;