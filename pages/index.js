export default function Home() {
  return (
    <div style={{background:'#07070f',color:'#ededf5',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'system-ui',padding:20}}>
      <div style={{textAlign:'center',maxWidth:480}}>
        <div style={{width:64,height:64,borderRadius:16,background:'linear-gradient(135deg,#6c5ce7,#a78bfa)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',fontSize:28}}>📦</div>
        <div style={{fontSize:11,fontWeight:700,color:'#6c5ce7',letterSpacing:2,textTransform:'uppercase',marginBottom:10}}>NyzzAPI Storage</div>
        <div style={{fontSize:26,fontWeight:800,marginBottom:8,letterSpacing:-0.5}}>API Aktif</div>
        <div style={{fontSize:14,color:'#8888a8',marginBottom:6}}>Silahkan mulai upload file kamu.</div>
        <div style={{fontSize:13,color:'#44445a',marginBottom:28}}>Image · Video · Audio · File</div>
        <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}>
          <a href="https://docs.nyzz.my.id" style={{background:'linear-gradient(135deg,#6c5ce7,#a78bfa)',color:'#fff',textDecoration:'none',padding:'10px 22px',borderRadius:10,fontWeight:700,fontSize:13}}>Dokumentasi</a>
          <a href="https://docs.nyzz.my.id/register.html" style={{background:'#12121e',color:'#a78bfa',textDecoration:'none',padding:'10px 22px',borderRadius:10,fontWeight:700,fontSize:13,border:'1px solid rgba(108,92,231,.3)'}}>Daftar Gratis</a>
        </div>
        <div style={{marginTop:32,padding:'14px 20px',background:'#0d0d1a',borderRadius:12,border:'1px solid #ffffff0a',textAlign:'left'}}>
          <div style={{fontSize:10,color:'#44445a',fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',marginBottom:8}}>Quick Start</div>
          <code style={{fontSize:11,color:'#34d399',fontFamily:'monospace',lineHeight:1.8,display:'block'}}>
            POST https://api.nyzz.my.id/uploader/image<br/>
            ?apikey=API_KEY<br/>
            -F file=@foto.jpg
          </code>
        </div>
        <div style={{marginTop:16,fontSize:11,color:'#44445a'}}>
          Powered by <a href="https://api.nyzz.my.id" style={{color:'#a78bfa',textDecoration:'none'}}>NyzzAPI</a>
        </div>
      </div>
    </div>
  );
}
