interface PdfPreviewModalProps {
  open: boolean;
  loading: boolean;
  pdfUrl: string | null;
  error: string | null;
  onClose: () => void;
  onRefresh: () => void;
}

const PdfPreviewModal = ({ open, loading, pdfUrl, error, onClose, onRefresh }: PdfPreviewModalProps) => {
  if (!open) return null;

  return (
    <div className="settings-modal-mask no-print" onClick={onClose} role="presentation">
      <section className="pdf-preview-modal" onClick={(event) => event.stopPropagation()}>
        <header className="settings-modal-header">
          <h3>PDF 预览</h3>
          <div className="settings-actions">
            <button type="button" onClick={onRefresh} disabled={loading}>
              {loading ? '生成中...' : '刷新'}
            </button>
            {pdfUrl && !loading && (
              <a className="button-link" href={pdfUrl} download="resume-preview.pdf">
                下载
              </a>
            )}
            <button type="button" onClick={onClose}>
              关闭
            </button>
          </div>
        </header>

        <div className="pdf-preview-body">
          {loading && <p className="tip">正在生成 PDF，请稍候...</p>}
          {!loading && error && <p className="pdf-error">{error}</p>}
          {!loading && !error && pdfUrl && <iframe title="pdf-preview" className="pdf-frame" src={pdfUrl} />}
        </div>
      </section>
    </div>
  );
};

export default PdfPreviewModal;
