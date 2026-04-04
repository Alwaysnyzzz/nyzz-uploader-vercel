const OWNER  = process.env.GITHUB_OWNER;
const REPO   = process.env.GITHUB_REPO;
const BRANCH = process.env.GITHUB_BRANCH || 'main';
const FOLDER_MAP = { image:'images', video:'videos', audio:'audios' };

export default function FilePage({ type, filename, rawUrl, notFound }) {
  if (notFound) return (
    <div style={{background:'#07070f',color:'#ededf5',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'system-ui'}}>
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:48,marginBottom:16}}>😵</div>
        <div style={{fontSize:18,fontWeight:800,marginBottom:8}}>File Tidak Ditemukan</div>
        <div style={{fontSize:13,color:'#8888a8',marginBottom:20}}>File mungkin sudah dihapus atau URL salah.</div>
        <a href="https://docs.nyzz.my.id" style={{color:'#a78bfa',textDecoration:'none',fontSize:13}}>← Kembali ke Docs</a>
      </div>
    </div>
  );
  if (type === 'image') return (
    <div style={{background:'#07070f',minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:20}}>
      <img src={rawUrl} alt={filename} style={{maxWidth:'100%',maxHeight:'90vh',borderRadius:12}} />
      <div style={{marginTop:12,fontSize:11,color:'#44445a'}}>
        <a href={rawUrl} download={filename} style={{color:'#a78bfa',textDecoration:'none'}}>Download</a>
        {' · '}
        <a href="https://api.nyzz.my.id" style={{color:'#44445a',textDecoration:'none'}}>NyzzAPI</a>
      </div>
    </div>
  );
  if (type === 'video') return (
    <div style={{background:'#000',minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
      <video controls autoPlay style={{maxWidth:'100%',maxHeight:'95vh'}}>
        <source src={rawUrl} />
      </video>
      <div style={{marginTop:10,fontSize:11,color:'#44445a'}}>
        <a href={rawUrl} download={filename} style={{color:'#a78bfa',textDecoration:'none'}}>Download</a>
      </div>
    </div>
  );
  if (type === 'audio') return (
    <div style={{background:'#07070f',color:'#ededf5',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'system-ui',padding:20}}>
      <div style={{background:'#0d0d1a',border:'1px solid #ffffff14',borderRadius:16,padding:32,maxWidth:400,width:'100%',textAlign:'center'}}>
        <div style={{fontSize:48,marginBottom:16}}>🎵</div>
        <div style={{fontSize:14,fontWeight:700,marginBottom:16,color:'#a78bfa',wordBreak:'break-all'}}>{filename}</div>
        <audio controls autoPlay style={{width:'100%',borderRadius:8}}>
          <source src={rawUrl} />
        </audio>
        <div style={{marginTop:16}}><a href={rawUrl} download={filename} style={{color:'#a78bfa',textDecoration:'none',fontSize:12}}>Download</a></div>
        <div style={{marginTop:12,fontSize:11,color:'#44445a'}}>Powered by <a href="https://api.nyzz.my.id" style={{color:'#44445a',textDecoration:'none'}}>NyzzAPI</a></div>
      </div>
    </div>
  );
  const ext = filename.split('.').pop().toLowerCase();
  return (
    <div style={{background:'#07070f',color:'#ededf5',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'system-ui',padding:20}}>
      <div style={{background:'#0d0d1a',border:'1px solid #ffffff14',borderRadius:16,padding:32,maxWidth:400,width:'100%',textAlign:'center'}}>
        <div style={{fontSize:48,marginBottom:16}}>📄</div>
        <div style={{fontSize:15,fontWeight:700,marginBottom:8,wordBreak:'break-all'}}>{filename}</div>
        <div style={{fontSize:11,color:'#a78bfa',background:'rgba(108,92,231,.12)',padding:'3px 10px',borderRadius:100,marginBottom:22,display:'inline-block'}}>.{ext}</div>
        <br/>
        <a href={rawUrl} download={filename} style={{display:'inline-block',background:'linear-gradient(135deg,#6c5ce7,#a78bfa)',color:'#fff',textDecoration:'none',padding:'12px 28px',borderRadius:10,fontWeight:700,fontSize:14}}>Download File</a>
        <div style={{marginTop:16,fontSize:11,color:'#44445a'}}>Powered by <a href="https://api.nyzz.my.id" style={{color:'#44445a',textDecoration:'none'}}>NyzzAPI</a></div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const slug = params.slug || [];
  let type, filename;
  if (['image','video','audio'].includes(slug[0])) { type=slug[0]; filename=slug[1]; }
  else { type='file'; filename=slug[0]; }
  if (!filename) return { props:{ notFound:true } };
  const folder = FOLDER_MAP[type] || 'files';
  const rawUrl = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${folder}/${filename}`;
  try {
    const check = await fetch(rawUrl, { method:'HEAD' });
    if (!check.ok) return { props:{ notFound:true } };
  } catch { return { props:{ notFound:true } }; }
  return { props:{ type, filename, rawUrl } };
}
