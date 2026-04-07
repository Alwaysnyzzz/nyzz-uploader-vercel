const OWNER  = process.env.GITHUB_OWNER;
const REPO   = process.env.GITHUB_REPO;
const BRANCH = process.env.GITHUB_BRANCH || 'main';
const FOLDER_MAP = { image:'images', video:'videos', audio:'audios' };

export async function getServerSideProps({ params, res }) {
  const slug = params.slug || [];
  let type, filename;
  if (['image','video','audio'].includes(slug[0])) {
    type = slug[0]; filename = slug[1];
  } else {
    type = 'file'; filename = slug[0];
  }
  if (!filename) return { notFound: true };
  const folder = FOLDER_MAP[type] || 'files';
  const rawUrl = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${folder}/${filename}`;

  if (type === 'image') {
    // Fetch gambar lalu serve langsung dengan content-type asli
    try {
      const r = await fetch(rawUrl);
      if (!r.ok) return { notFound: true };
      const buf  = await r.arrayBuffer();
      const ct   = r.headers.get('content-type') || 'image/jpeg';
      res.setHeader('Content-Type', ct);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.end(Buffer.from(buf));
      return { props: {} };
    } catch { return { notFound: true }; }
  }

  if (type === 'video' || type === 'audio') {
    // Proxy stream
    try {
      const r = await fetch(rawUrl);
      if (!r.ok) return { notFound: true };
      const buf = await r.arrayBuffer();
      const ct  = r.headers.get('content-type') || (type==='video'?'video/mp4':'audio/mpeg');
      res.setHeader('Content-Type', ct);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.end(Buffer.from(buf));
      return { props: {} };
    } catch { return { notFound: true }; }
  }

  // File — halaman download
  try {
    const check = await fetch(rawUrl, { method: 'HEAD' });
    if (!check.ok) return { notFound: true };
    const size    = check.headers.get('content-length');
    const sizeStr = size ? (parseInt(size)/1024).toFixed(1)+' KB' : null;
    return { props: { filename, rawUrl, sizeStr } };
  } catch { return { notFound: true }; }
}

export default function FilePage({ filename, rawUrl, sizeStr }) {
  if (!filename) return null;
  const ext = filename?.split('.').pop().toLowerCase();
  return (
    <>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        html,body{height:100%}
        body{background:#07070f;color:#ededf5;font-family:system-ui,-apple-system,sans-serif;min-height:100vh;display:flex;flex-direction:column}
        .wrap{flex:1;display:flex;align-items:center;justify-content:center;padding:20px}
        .card{background:#0d0d1a;border:1px solid #ffffff14;border-radius:16px;overflow:hidden;width:100%;max-width:400px}
        .card-head{padding:13px 16px;border-bottom:1px solid #ffffff0a;display:flex;align-items:center;gap:8px}
        .logo-ico{width:24px;height:24px;border-radius:6px;background:linear-gradient(135deg,#6c5ce7,#a78bfa);display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .card-body{padding:24px 18px;text-align:center}
        .file-ico{width:52px;height:52px;border-radius:13px;background:rgba(108,92,231,.1);border:1px solid rgba(108,92,231,.2);display:flex;align-items:center;justify-content:center;margin:0 auto 12px}
        .file-name{font-size:14px;font-weight:700;margin-bottom:5px;word-break:break-all}
        .file-meta{font-size:11px;color:#a78bfa;background:rgba(108,92,231,.12);padding:2px 9px;border-radius:100px;display:inline-block;margin-bottom:18px}
        .btn-dl{display:block;background:linear-gradient(135deg,#6c5ce7,#a78bfa);color:#fff;text-decoration:none;padding:12px;border-radius:10px;font-weight:700;font-size:14px}
        footer{border-top:1px solid #ffffff0a;padding:20px;text-align:center}
        .f-inner{display:flex;flex-direction:column;align-items:center;gap:9px}
        .f-links{display:flex;gap:12px;flex-wrap:wrap;justify-content:center}
        .f-links a,.f-copy{font-size:11px;color:#44445a;text-decoration:none}
        .f-copy a{color:#a78bfa;text-decoration:none}
      `}</style>
      <div className="wrap">
        <div className="card">
          <div className="card-head">
            <div className="logo-ico">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            </div>
            <span style={{fontSize:12,fontWeight:700,color:'#ededf5'}}>Nyzz<em style={{fontStyle:'normal',color:'#a78bfa'}}>API</em> Uploader</span>
          </div>
          <div className="card-body">
            <div className="file-ico">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <div className="file-name">{filename}</div>
            <div className="file-meta">.{ext}{sizeStr?` · ${sizeStr}`:''}</div>
            <a className="btn-dl" href={rawUrl} download={filename}>Download File</a>
          </div>
        </div>
      </div>
      <footer>
        <div className="f-inner">
          <a href="https://docs.nyzz.my.id" style={{display:'flex',alignItems:'center',gap:7,textDecoration:'none'}}>
            <div className="logo-ico"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></div>
            <span style={{fontSize:13,fontWeight:800,color:'#ededf5'}}>Nyzz<em style={{fontStyle:'normal',color:'#a78bfa'}}>API</em></span>
          </a>
          <div className="f-links">
            <a href="https://docs.nyzz.my.id">Documentation</a>
            <a href="https://docs.nyzz.my.id/apikey.html">API Key</a>
            <a href="https://wa.me/6287713472756">WhatsApp</a>
            <a href="https://t.me/DzzXNzz">Telegram</a>
          </div>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:3}}>
            <span className="f-copy">Made with ❤️ by <a href="https://t.me/DzzXNzz">@DzzXNzz</a></span>
            <span className="f-copy">© 2026 NyzzAPI.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
