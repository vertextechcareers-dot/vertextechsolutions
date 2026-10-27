import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Upload, Lock, Trash2, Copy, Eye, EyeOff, Check, FileText, CloudUpload, X, ExternalLink, Link as LinkIcon, KeyRound } from 'lucide-react';
import { supabase, supabaseAnonKey } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';

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

type UploadMode = 'file' | 'link';

const MAX_FILE_SIZE = 250 * 1024 * 1024; // 250 MB

const SecuredFiles = () => {
  const [files, setFiles] = useState<SecuredFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showCodeId, setShowCodeId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [mode, setMode] = useState<UploadMode>('file');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    secretPhrase: '',
    externalUrl: '',
    file: null as File | null,
  });

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('secured_files')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load secured files');
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  }, []);

  const validateAndSetFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File exceeds 250 MB limit. Please upload a smaller file.`);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      file,
      name: prev.name || file.name.replace(/\.[^/.]+$/, ''),
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      secretPhrase: '',
      externalUrl: '',
      file: null,
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const uploadFile = async () => {
    if (!formData.name.trim()) {
      toast.error('File name is required');
      return;
    }

    if (mode === 'file' && !formData.file) {
      toast.error('Please select a file to upload');
      return;
    }

    if (mode === 'link' && !formData.externalUrl.trim()) {
      toast.error('Please enter an external URL');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const projectUrl = 'https://aqlejfzgabllyeaeczca.supabase.co';
      const functionUrl = `${projectUrl}/functions/v1/upload-file`;

      const body = new FormData();
      if (formData.file) {
        body.append('file', formData.file);
        body.append('original_filename', formData.file.name);
      }
      body.append('name', formData.name.trim());
      if (formData.description.trim()) {
        body.append('description', formData.description.trim());
      }
      if (formData.secretPhrase.trim()) {
        body.append('secret_phrase', formData.secretPhrase.trim());
      }
      if (formData.externalUrl.trim()) {
        body.append('external_url', formData.externalUrl.trim());
      }

      setUploadProgress(30);

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'admin-secret': '3381',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body,
      });

      setUploadProgress(70);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to upload file');
      }

      setUploadProgress(100);
      toast.success(mode === 'link' ? 'External link secured successfully' : 'File uploaded successfully');
      setShowUploadForm(false);
      resetForm();
      fetchFiles();
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload file');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteFile = async (file: SecuredFile) => {
    if (!confirm(`Delete "${file.name}"? This action cannot be undone.`)) return;

    try {
      if (file.file_path) {
        await supabase.storage.from('secured-files').remove([file.file_path]);
      }

      const { error } = await supabase.from('secured_files').delete().eq('id', file.id);
      if (error) throw error;

      toast.success('File deleted successfully');
      fetchFiles();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete file');
    }
  };

  const copyDownloadLink = (file: SecuredFile) => {
    const url = `${window.location.origin}/downloads?code=${file.access_code}`;
    navigator.clipboard.writeText(url);
    setCopiedId(file.id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success('Download link copied to clipboard');
  };

  const copySecretPhrase = (file: SecuredFile) => {
    if (!file.secret_phrase) return;
    navigator.clipboard.writeText(file.secret_phrase);
    setCopiedId(file.id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success('Secret phrase copied to clipboard');
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const removeSelectedFile = () => {
    setFormData((prev) => ({ ...prev, file: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Secured Files</h2>
          <p className="text-slate-500 mt-1">Manage password-protected file downloads and external links</p>
        </div>
        <Button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="bg-brand-blue hover:bg-brand-blue/90 text-white"
        >
          <Upload size={18} className="mr-2" />
          {showUploadForm ? 'Cancel' : 'Upload File'}
        </Button>
      </div>

      {showUploadForm && (
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Add New Secured Item</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg w-fit">
              <button
                type="button"
                onClick={() => setMode('file')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  mode === 'file'
                    ? 'bg-white text-brand-blue shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setMode('link')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  mode === 'link'
                    ? 'bg-white text-brand-blue shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                External Link
              </button>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Product Brochure 2024"
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Secret Phrase</label>
              <Input
                value={formData.secretPhrase}
                onChange={(e) => setFormData({ ...formData, secretPhrase: e.target.value })}
                placeholder="Optional phrase used to unlock this item on the download page"
                className="w-full"
              />
            </div>

            {mode === 'link' && (
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">External URL *</label>
                <Input
                  value={formData.externalUrl}
                  onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                  placeholder="https://example.com/resource"
                  className="w-full"
                />
              </div>
            )}

            {mode === 'file' && (
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">File * (max 250 MB)</label>

                {!formData.file ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                      dragOver
                        ? 'border-brand-blue bg-brand-blue/5'
                        : 'border-slate-200 hover:border-brand-blue/50 hover:bg-slate-50'
                    }`}
                  >
                    <CloudUpload
                      size={40}
                      className={`mx-auto mb-3 ${dragOver ? 'text-brand-blue' : 'text-slate-300'}`}
                    />
                    <p className="text-sm font-medium text-slate-700">
                      {dragOver ? 'Drop file here' : 'Drag & drop file here, or click to browse'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Supports files up to 250 MB</p>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <FileText size={24} className="text-brand-blue shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{formData.file.name}</p>
                      <p className="text-xs text-slate-400">{formatFileSize(formData.file.size)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeSelectedFile}
                      className="text-slate-400 hover:text-red-500 shrink-0"
                    >
                      <X size={18} />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {uploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Uploading to secure storage...</span>
                  <span className="font-medium text-brand-blue">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            <Button
              onClick={uploadFile}
              disabled={
                uploading ||
                !formData.name.trim() ||
                (mode === 'file' ? !formData.file : !formData.externalUrl.trim())
              }
              className="bg-brand-blue hover:bg-brand-blue/90 text-white w-full"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Lock size={18} className="mr-2" />
                  {mode === 'link' ? 'Secure Link' : 'Upload & Secure'}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {files.length === 0 ? (
        <Card className="border-none shadow-sm">
          <CardContent className="py-16 text-center">
            <Lock size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Secured Files Yet</h3>
            <p className="text-slate-500">Upload files or add external links to share with access-code protection.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {files.map((file) => (
            <Card key={file.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-brand-blue/10 rounded-xl flex items-center justify-center shrink-0">
                      {file.external_url ? (
                        <ExternalLink size={24} className="text-brand-blue" />
                      ) : (
                        <FileText size={24} className="text-brand-blue" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-slate-900 truncate">{file.name}</h4>
                      {file.description && (
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{file.description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-400">
                        {!file.external_url && <span>{formatFileSize(file.file_size)}</span>}
                        <span>{file.file_type || (file.external_url ? 'External Link' : 'Unknown type')}</span>
                        <span>{file.download_count} downloads</span>
                        <span>Added {formatDate(file.created_at)}</span>
                        <span className="flex items-center gap-1">
                          <Lock size={12} />
                          Code:{' '}
                          <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-brand-blue text-[10px]">
                            {showCodeId === file.id ? file.access_code : '••••••••'}
                          </code>
                          <button
                            onClick={() => setShowCodeId(showCodeId === file.id ? null : file.id)}
                            className="text-slate-400 hover:text-slate-600"
                            title={showCodeId === file.id ? 'Hide code' : 'Show code'}
                          >
                            {showCodeId === file.id ? <EyeOff size={12} /> : <Eye size={12} />}
                          </button>
                        </span>
                        {file.secret_phrase && (
                          <span className="flex items-center gap-1">
                            <KeyRound size={12} />
                            Phrase:{' '}
                            <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-brand-blue text-[10px]">
                              {showCodeId === file.id ? file.secret_phrase : '••••••••'}
                            </code>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {file.external_url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          window.open(file.external_url!, '_blank');
                        }}
                        className="text-slate-500 hover:text-brand-blue"
                        title="Open external link"
                      >
                        <LinkIcon size={18} />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyDownloadLink(file)}
                      className="text-slate-500 hover:text-brand-blue"
                      title="Copy download link"
                    >
                      {copiedId === file.id ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                    </Button>
                    {file.secret_phrase && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copySecretPhrase(file)}
                        className="text-slate-500 hover:text-brand-blue"
                        title="Copy secret phrase"
                      >
                        <KeyRound size={18} />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteFile(file)}
                      className="text-slate-500 hover:text-red-500"
                      title="Delete file"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SecuredFiles;