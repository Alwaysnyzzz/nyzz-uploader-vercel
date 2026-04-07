const OWNER  = process.env.GITHUB_OWNER;
const REPO   = process.env.GITHUB_REPO;
const BRANCH = process.env.GITHUB_BRANCH || 'main';

const FOLDER_MAP = { image:'images', video:'videos', audio:'audios' };

const FOOTER = () => `
  <footer style="border-top:1px solid #ffffff0a;padding:24px 20px;text-align:center;margin-top:0">
    <div style="display:flex;flex-direction:column;align-items:center;gap:10px">
      <a href="https://docs.nyzz.my.id" style="display:flex;align-items:center;gap:8px;text-decoration:none">
        <div style="width:26px;height:26px;border-radius:7px;background:linear-gradient(135deg,#6c5ce7,#a78bfa);display:flex;align-items:center;justify-content:center">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
        </div>
        <span style="font-size:14px;font-weight:800;color:#ededf5">Nyzz<em style="font-style:normal;color:#a78bfa">API</em></span>
      </a>
      <div style="display:flex;gap:14px;flex-wrap:wrap;justify-content:center">
        <a href="https://docs.nyzz.my.id" style="font-size:12px;color:#44445a;text-decoration:none">Documentation</a>
        <a href="https://docs.nyzz.my.id/apikey.html" style="font-size:12px;color:#44445a;text-decoration:none">API Key</a>
        <a href="https://wa.me/6287713472756" style="font-size:12px;color:#44445a;text-decoration:none">WhatsApp</a>
        <a href="https://t.me/DzzXNzz" style="font-size:12px;color:#44445a;text-decoration:none">Telegram</a>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:3px">
        <span style="font-size:11px;color:#44445a">Made with ❤️ by <a href="https://t.me/DzzXNzz" style="color:#a78bfa;text-decoration:none">@DzzXNzz</a></span>
        <span style="font-size:11px;color:#44445a">© 2026 NyzzAPI.</span>
      </div>
    </div>
  </footer>`;

const BASE_STYLE = `
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:#07070f;color:#ededf5;font-family:system-ui,-apple-system,sans-serif;min-height:100vh;display:flex;flex-direction:column}
    .wrap{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px}
    .card{background:#0d0d1a;border:1px solid #ffffff14;border-radius:16px;overflow:hidden;width:100%;max-width:480px}
    .card-header{padding:16px 20px;border-bottom:1px solid #ffffff0a;display:flex;align-items:center;gap:10px}
    .card-logo{width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,#6c5ce7,#a78bfa);display:flex;align-items:center;justify-content:center;flex-shrink:0}
    .card-logo svg{width:14px;height:14px}
    .card-site{font-size:13px;font-weight:700;color:#ededf5}
    .card-site em{font-style:normal;color:#a78bfa}
    .card-body{padding:20px}
    .file-name{font-size:15px;font-weight:700;word-break:break-all;margin-bottom:6px}
    .file-ext{font-size:11px;color:#a78bfa;background:rgba(108,92,231,.12);padding:3px 10px;border-radius:100px;display:inline-block;margin-bottom:16px}
    .btn-dl{display:block;background:linear-gradient(135deg,#6c5ce7,#a78bfa);color:#fff;text-decoration:none;padding:13px;border-radius:10px;font-weight:700;font-size:14px;text-align:center;transition:opacity .2s}
    .btn-dl:hover{opacity:.85}
    .link-row{display:flex;align-items:center;gap:8px;margin-top:12px;background:#12121e;border:1px solid #ffffff0a;border-radius:10px;padding:10px 14px}
    .link-url{font-family:monospace;font-size:11px;color:#34d399;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .btn-copy{background:#1c1c2a;border:1px solid #ffffff14;color:#8888a8;padding:5px 12px;border-radius:7px;font-size:11px;font-weight:600;cursor:pointer;transition:all .18s;white-space:nowrap}
    .btn-copy:hover{border-color:#a78bfa;color:#a78bfa}
    .btn-copy.copied{border-color:#10b981;color:#34d399}
    .resp-card{margin-top:12px;background:#060610;border:1px solid #ffffff0a;border-radius:10px;padding:14px 16px}
    .resp-label{font-size:10px;font-weight:700;color:#44445a;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px}
    .resp-code{font-family:monospace;font-size:11.5px;line-height:1.8;color:#b8b8d8}
    .resp-code .k{color:#c4b5fd}
    .resp-code .s{color:#a3e635}
    .resp-code .n{color:#fbbf24}
    .resp-code .t{color:#34d399}
  </style>`;

export async function getServerSideProps({ params, req }) {
  const slug = params.slug || [];
  let type, filename;

  if (['image','video','audio'].includes(slug[0])) {
    type = slug[0]; filename = slug[1];
  } else {
    type = 'file'; filename = slug[0];
  }

  if (!filename) return { props: { notFound: true } };

  const folder = FOLDER_MAP[type] || 'files';
  const rawUrl = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${folder}/${filename}`;
  const viewUrl = `https://uploader.nyzz.my.id/file/${type === 'file' ? '' : type + '/'}${filename}`;

  try {
    const check = await fetch(rawUrl, { method: 'HEAD' });
    if (!check.ok) return { props: { notFound: true } };
    const size = check.headers.get('content-length');
    return { props: { type, filename, rawUrl, viewUrl, size: size || null } };
  } catch {
    return { props: { notFound: true } };
  }
}

export default function FilePage({ type, filename, rawUrl, viewUrl, size, notFound }) {
  if (notFound) return (
    <div style={{background:'#07070f',color:'#ededf5',minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'system-ui',padding:20}}>
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:48,marginBottom:16}}>😵</div>
        <div style={{fontSize:18,fontWeight:800,marginBottom:8}}>File Tidak Ditemukan</div>
        <div style={{fontSize:13,color:'#8888a8',marginBottom:20}}>File mungkin sudah dihapus atau URL salah.</div>
        <a href="https://docs.nyzz.my.id" style={{color:'#a78bfa',textDecoration:'none',fontSize:13}}>← Kembali ke Docs</a>
      </div>
    </div>
  );

  const ext      = filename.split('.').pop().toLowerCase();
  const sizeKB   = size ? (parseInt(size) / 1024).toFixed(1) + ' KB' : null;
  const respJson = JSON.stringify({ status:'sukses', message:'File berhasil diupload!', data:{ filename, type, url: viewUrl, raw_url: rawUrl, ...(sizeKB ? { size: sizeKB } : {}) }}, null, 2);

  // IMAGE: tampil langsung
  if (type === 'image') return (
    <div style={{background:'#07070f',minHeight:'100vh',display:'flex',flexDirection:'column'}}>
      <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:20,gap:16}}>
        {/* Card header */}
        <div style={{background:'#0d0d1a',border:'1px solid #ffffff14',borderRadius:16,overflow:'hidden',width:'100%',maxWidth:480}}>
          <div style={{padding:'12px 16px',borderBottom:'1px solid #ffffff0a',display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:26,height:26,borderRadius:7,background:'linear-gradient(135deg,#6c5ce7,#a78bfa)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            </div>
            <span style={{fontSize:13,fontWeight:700,color:'#ededf5'}}>Nyzz<em style={{fontStyle:'normal',color:'#a78bfa'}}>API</em> Uploader</span>
          </div>
          {/* Image */}
          <img src={rawUrl} alt={filename} style={{width:'100%',display:'block'}}/>
          {/* Info */}
          <div style={{padding:'14px 16px',borderTop:'1px solid #ffffff0a'}}>
            <div style={{fontSize:13,fontWeight:700,marginBottom:4,wordBreak:'break-all'}}>{filename}</div>
            <div style={{fontSize:11,color:'#a78bfa',background:'rgba(108,92,231,.12)',padding:'2px 9px',borderRadius:100,display:'inline-block',marginBottom:12}}>.{ext}{sizeKB ? ` · ${sizeKB}` : ''}</div>
            {/* Link + Salin */}
            <div style={{display:'flex',alignItems:'center',gap:8,background:'#12121e',border:'1px solid #ffffff0a',borderRadius:10,padding:'9px 12px',marginBottom:10}}>
              <span style={{fontFamily:'monospace',fontSize:11,color:'#34d399',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{viewUrl}</span>
              <button id="copy-btn" onClick={()=>{navigator.clipboard.writeText(viewUrl);const b=document.getElementById('copy-btn');b.textContent='✓';b.style.color='#34d399';setTimeout(()=>{b.textContent='Salin';b.style.color='';},2000);}} style={{background:'#1c1c2a',border:'1px solid #ffffff14',color:'#8888a8',padding:'4px 10px',borderRadius:7,fontSize:11,fontWeight:600,cursor:'pointer',whiteSpace:'nowrap'}}>Salin</button>
            </div>
            {/* Response */}
            <div style={{background:'#060610',border:'1px solid #ffffff0a',borderRadius:10,padding:'12px 14px'}}>
              <div style={{fontSize:10,fontWeight:700,color:'#44445a',letterSpacing:'1.5px',textTransform:'uppercase',marginBottom:8}}>Response</div>
              <pre style={{fontFamily:'monospace',fontSize:11,lineHeight:1.8,color:'#b8b8d8',whiteSpace:'pre-wrap',wordBreak:'break-all'}}>{respJson}</pre>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );

  // VIDEO
  if (type === 'video') return (
    <div style={{background:'#07070f',minHeight:'100vh',display:'flex',flexDirection:'column'}}>
      <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:20,gap:16}}>
        <div style={{background:'#0d0d1a',border:'1px solid #ffffff14',borderRadius:16,overflow:'hidden',width:'100%',maxWidth:480}}>
          <div style={{padding:'12px 16px',borderBottom:'1px solid #ffffff0a',display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:26,height:26,borderRadius:7,background:'linear-gradient(135deg,#6c5ce7,#a78bfa)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            </div>
            <span style={{fontSize:13,fontWeight:700,color:'#ededf5'}}>Nyzz<em style={{fontStyle:'normal',color:'#a78bfa'}}>API</em> Uploader</span>
          </div>
          <video controls autoPlay style={{width:'100%',display:'block',maxHeight:360}}>
            <source src={rawUrl}/>
          </video>
          <div style={{padding:'14px 16px',borderTop:'1px solid #ffffff0a'}}>
            <div style={{fontSize:13,fontWeight:700,marginBottom:4,wordBreak:'break-all'}}>{filename}</div>
            <div style={{fontSize:11,color:'#a78bfa',background:'rgba(108,92,231,.12)',padding:'2px 9px',borderRadius:100,display:'inline-block',marginBottom:12}}>.{ext}{sizeKB ? ` · ${sizeKB}` : ''}</div>
            <div style={{display:'flex',alignItems:'center',gap:8,background:'#12121e',border:'1px solid #ffffff0a',borderRadius:10,padding:'9px 12px',marginBottom:10}}>
              <span style={{fontFamily:'monospace',fontSize:11,color:'#34d399',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{viewUrl}</span>
              <button id="copy-btn" onClick={()=>{navigator.clipboard.writeText(viewUrl);const b=document.getElementById('copy-btn');b.textContent='✓';b.style.color='#34d399';setTimeout(()=>{b.textContent='Salin';b.style.color='';},2000);}} style={{background:'#1c1c2a',border:'1px solid #ffffff14',color:'#8888a8',padding:'4px 10px',borderRadius:7,fontSize:11,fontWeight:600,cursor:'pointer',whiteSpace:'nowrap'}}>Salin</button>
            </div>
            <div style={{background:'#060610',border:'1px solid #ffffff0a',borderRadius:10,padding:'12px 14px'}}>
              <div style={{fontSize:10,fontWeight:700,color:'#44445a',letterSpacing:'1.5px',textTransform:'uppercase',marginBottom:8}}>Response</div>
              <pre style={{fontFamily:'monospace',fontSize:11,lineHeight:1.8,color:'#b8b8d8',whiteSpace:'pre-wrap',wordBreak:'break-all'}}>{respJson}</pre>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );

  // AUDIO
  if (type === 'audio') return (
    <div style={{background:'#07070f',minHeight:'100vh',display:'flex',flexDirection:'column'}}>
      <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:20}}>
        <div style={{background:'#0d0d1a',border:'1px solid #ffffff14',borderRadius:16,overflow:'hidden',width:'100%',maxWidth:480}}>
          <div style={{padding:'12px 16px',borderBottom:'1px solid #ffffff0a',display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:26,height:26,borderRadius:7,background:'linear-gradient(135deg,#6c5ce7,#a78bfa)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            </div>
            <span style={{fontSize:13,fontWeight:700,color:'#ededf5'}}>Nyzz<em style={{fontStyle:'normal',color:'#a78bfa'}}>API</em> Uploader</span>
          </div>
          <div style={{padding:'24px 20px',textAlign:'center'}}>
            <div style={{width:64,height:64,borderRadius:50,background:'rgba(108,92,231,.12)',border:'1px solid rgba(108,92,231,.2)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
            </div>
            <div style={{fontSize:14,fontWeight:700,marginBottom:4,wordBreak:'break-all'}}>{filename}</div>
            <div style={{fontSize:11,color:'#a78bfa',background:'rgba(108,92,231,.12)',padding:'2px 9px',borderRadius:100,display:'inline-block',marginBottom:16}}>.{ext}{sizeKB ? ` · ${sizeKB}` : ''}</div>
            <audio controls autoPlay style={{width:'100%',borderRadius:8}}>
              <source src={rawUrl}/>
            </audio>
          </div>
          <div style={{padding:'0 16px 16px'}}>
            <div style={{display:'flex',alignItems:'center',gap:8,background:'#12121e',border:'1px solid #ffffff0a',borderRadius:10,padding:'9px 12px',marginBottom:10}}>
              <span style={{fontFamily:'monospace',fontSize:11,color:'#34d399',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{viewUrl}</span>
              <button id="copy-btn" onClick={()=>{navigator.clipboard.writeText(viewUrl);const b=document.getElementById('copy-btn');b.textContent='✓';b.style.color='#34d399';setTimeout(()=>{b.textContent='Salin';b.style.color='';},2000);}} style={{background:'#1c1c2a',border:'1px solid #ffffff14',color:'#8888a8',padding:'4px 10px',borderRadius:7,fontSize:11,fontWeight:600,cursor:'pointer',whiteSpace:'nowrap'}}>Salin</button>
            </div>
            <div style={{background:'#060610',border:'1px solid #ffffff0a',borderRadius:10,padding:'12px 14px'}}>
              <div style={{fontSize:10,fontWeight:700,color:'#44445a',letterSpacing:'1.5px',textTransform:'uppercase',marginBottom:8}}>Response</div>
              <pre style={{fontFamily:'monospace',fontSize:11,lineHeight:1.8,color:'#b8b8d8',whiteSpace:'pre-wrap',wordBreak:'break-all'}}>{respJson}</pre>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );

  // FILE — download page
  return (
    <div style={{background:'#07070f',minHeight:'100vh',display:'flex',flexDirection:'column'}}>
      <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:20}}>
        <div style={{background:'#0d0d1a',border:'1px solid #ffffff14',borderRadius:16,overflow:'hidden',width:'100%',maxWidth:480}}>
          <div style={{padding:'12px 16px',borderBottom:'1px solid #ffffff0a',display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:26,height:26,borderRadius:7,background:'linear-gradient(135deg,#6c5ce7,#a78bfa)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            </div>
            <span style={{fontSize:13,fontWeight:700,color:'#ededf5'}}>Nyzz<em style={{fontStyle:'normal',color:'#a78bfa'}}>API</em> Uploader</span>
          </div>
          <div style={{padding:'28px 20px',textAlign:'center'}}>
            <div style={{width:64,height:64,borderRadius:16,background:'rgba(108,92,231,.1)',border:'1px solid rgba(108,92,231,.2)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <div style={{fontSize:15,fontWeight:700,marginBottom:6,wordBreak:'break-all'}}>{filename}</div>
            <div style={{fontSize:11,color:'#a78bfa',background:'rgba(108,92,231,.12)',padding:'3px 10px',borderRadius:100,display:'inline-block',marginBottom:20}}>.{ext}{sizeKB ? ` · ${sizeKB}` : ''}</div>
            <a href={rawUrl} download={filename} style={{display:'block',background:'linear-gradient(135deg,#6c5ce7,#a78bfa)',color:'#fff',textDecoration:'none',padding:13,borderRadius:10,fontWeight:700,fontSize:14}}>
              Download File
            </a>
          </div>
          <div style={{padding:'0 16px 16px'}}>
            <div style={{display:'flex',alignItems:'center',gap:8,background:'#12121e',border:'1px solid #ffffff0a',borderRadius:10,padding:'9px 12px',marginBottom:10}}>
              <span style={{fontFamily:'monospace',fontSize:11,color:'#34d399',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{viewUrl}</span>
              <button id="copy-btn" onClick={()=>{navigator.clipboard.writeText(viewUrl);const b=document.getElementById('copy-btn');b.textContent='✓';b.style.color='#34d399';setTimeout(()=>{b.textContent='Salin';b.style.color='';},2000);}} style={{background:'#1c1c2a',border:'1px solid #ffffff14',color:'#8888a8',padding:'4px 10px',borderRadius:7,fontSize:11,fontWeight:600,cursor:'pointer',whiteSpace:'nowrap'}}>Salin</button>
            </div>
            <div style={{background:'#060610',border:'1px solid #ffffff0a',borderRadius:10,padding:'12px 14px'}}>
              <div style={{fontSize:10,fontWeight:700,color:'#44445a',letterSpacing:'1.5px',textTransform:'uppercase',marginBottom:8}}>Response</div>
              <pre style={{fontFamily:'monospace',fontSize:11,lineHeight:1.8,color:'#b8b8d8',whiteSpace:'pre-wrap',wordBreak:'break-all'}}>{respJson}</pre>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

function Footer() {
  return (
    <footer style={{borderTop:'1px solid #ffffff0a',padding:'24px 20px',textAlign:'center'}}>
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:10}}>
        <a href="https://docs.nyzz.my.id" style={{display:'flex',alignItems:'center',gap:8,textDecoration:'none'}}>
          <div style={{width:26,height:26,borderRadius:7,background:'linear-gradient(135deg,#6c5ce7,#a78bfa)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          </div>
          <span style={{fontSize:14,fontWeight:800,color:'#ededf5'}}>Nyzz<em style={{fontStyle:'normal',color:'#a78bfa'}}>API</em></span>
        </a>
        <div style={{display:'flex',gap:14,flexWrap:'wrap',justifyContent:'center'}}>
          <a href="https://docs.nyzz.my.id" style={{fontSize:12,color:'#44445a',textDecoration:'none'}}>Documentation</a>
          <a href="https://docs.nyzz.my.id/apikey.html" style={{fontSize:12,color:'#44445a',textDecoration:'none'}}>API Key</a>
          <a href="https://wa.me/6287713472756" style={{fontSize:12,color:'#44445a',textDecoration:'none'}}>WhatsApp</a>
          <a href="https://t.me/DzzXNzz" style={{fontSize:12,color:'#44445a',textDecoration:'none'}}>Telegram</a>
        </div>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:3}}>
          <span style={{fontSize:11,color:'#44445a'}}>Made with ❤️ by <a href="https://t.me/DzzXNzz" style={{color:'#a78bfa',textDecoration:'none'}}>@DzzXNzz</a></span>
          <span style={{fontSize:11,color:'#44445a'}}>© 2026 NyzzAPI.</span>
        </div>
      </div>
    </footer>
  );
}
