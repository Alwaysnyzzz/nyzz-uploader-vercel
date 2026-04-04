export default function Home() {
  return (
    <div style={{background:'#07070f',color:'#ededf5',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'system-ui',padding:20}}>
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:48,marginBottom:16}}>📦</div>
        <div style={{fontSize:24,fontWeight:800,marginBottom:8}}>NyzzAPI Uploader</div>
        <div style={{fontSize:14,color:'#8888a8',marginBottom:20}}>File hosting untuk NyzzAPI</div>
        <a href="https://docs.nyzz.my.id" style={{background:'linear-gradient(135deg,#6c5ce7,#a78bfa)',color:'#fff',textDecoration:'none',padding:'10px 24px',borderRadius:10,fontWeight:700,fontSize:14}}>
          Lihat Dokumentasi
        </a>
      </div>
    </div>
  );
}
