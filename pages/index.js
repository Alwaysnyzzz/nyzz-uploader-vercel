export async function getServerSideProps({ res }) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ status: 'ok', message: 'Api Uploader Aktif' }));
  return { props: {} };
}
export default function Page() { return null; }
