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

  // Image, video, audio → redirect langsung ke raw
  if (type !== 'file') {
    res.setHeader('Location', rawUrl);
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  // File → cek exist dulu
  try {
    const check = await fetch(rawUrl, { method: 'HEAD' });
    if (!check.ok) return { notFound: true };
    const size = check.headers.get('content-length');
    const sizeStr = size ? (parseInt(size)/1024).toFixed(1) + ' KB' : null;
    return { props: { filename, rawUrl, sizeStr } };
  } catch {
    return { notFound: true };
  }
}

export default function FilePage({ filename, rawUrl, sizeStr }) {
  if (!filename) return null;
  const ext = filename?.split('.').pop().toLowerCase();

  return (
    <>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        body{background:#07070f;color:#ededf5;font-family:system-ui,-apple-system,sans-serif;min-height:100vh;display:flex;flex-direction:column}
        .wrap{flex:1;display:flex;align-items:center;justify-content:center;padding:20px}
        .card{background:#0d0d1a;border:1px solid #ffffff14;border-radius:16px;overflow:hidden;width:100%;max-width:420px}
        .card-head{padding:14px 18px;border-bottom:1px solid #ffffff0a;display:flex;align-items:center;gap:9px}
        .logo-ico{width:26px;height:26px;border-radius:7px;background:linear-gradient(135deg,#6c5ce7,#a78bfa);display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .card-body{padding:24px 20px;text-align:center}
        .file-ico{width:56px;height:56px;border-radius:14px;background:rgba(108,92,231,.1);border:1px solid rgba(108,92,231,.2);display:flex;align-items:center;justify-content:center;margin:0 auto 14px}
        .file-name{font-size:15px;font-weight:700;margin-bottom:6px;word-break:break-all}
        .file-meta{font-size:11px;color:#a78bfa;background:rgba(108,92,231,.12);padding:3px 10px;border-radius:100px;display:inline-block;margin-bottom:20px}
        .btn-dl{display:block;background:linear-gradient(135deg,#6c5ce7,#a78bfa);color:#fff;text-decoration:none;padding:13px;border-radius:10px;font-weight:700;font-size:14px;text-align:center}
        .btn-dl:hover{opacity:.88}
        footer{border-top:1px solid #ffffff0a;padding:22px 20px;text-align:center}
        .f-inner{display:flex;flex-direction:column;align-items:center;gap:10px}
        .f-logo{display:flex;align-items:center;gap:7px;text-decoration:none}
        .f-links{display:flex;gap:14px;flex-wrap:wrap;justify-content:center}
        .f-links a{font-size:12px;color:#44445a;text-decoration:none}
        .f-copy{font-size:11px;color:#44445a}
      `}</style>

      <div className="wrap">
        <div className="card">
          <div className="card-head">
            <div className="logo-ico">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            </div>
            <span style={{fontSize:13,fontWeight:700,color:'#ededf5'}}>Nyzz<em style={{fontStyle:'normal',color:'#a78bfa'}}>API</em> Uploader</span>
          </div>
          <div className="card-body">
            <div className="file-ico">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <div className="file-name">{filename}</div>
            <div className="file-meta">.{ext}{sizeStr ? ` · ${sizeStr}` : ''}</div>
            <a className="btn-dl" href={rawUrl} download={filename}>Download File</a>
          </div>
        </div>
      </div>

      <footer>
        <div className="f-inner">
          <a className="f-logo" href="https://docs.nyzz.my.id">
            <div className="logo-ico">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            </div>
            <span style={{fontSize:14,fontWeight:800,color:'#ededf5'}}>Nyzz<em style={{fontStyle:'normal',color:'#a78bfa'}}>API</em></span>
          </a>
          <div className="f-links">
            <a href="https://docs.nyzz.my.id">Documentation</a>
            <a href="https://docs.nyzz.my.id/apikey.html">API Key</a>
            <a href="https://wa.me/6287713472756">WhatsApp</a>
            <a href="https://t.me/DzzXNzz">Telegram</a>
          </div>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:3}}>
            <span className="f-copy">Made with ❤️ by <a href="https://t.me/DzzXNzz" style={{color:'#a78bfa',textDecoration:'none'}}>@DzzXNzz</a></span>
            <span className="f-copy">© 2026 NyzzAPI.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
