import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="wrap max-w-xl py-20 text-center">
      <p lang="nah" className="display text-5xl text-cochineal">Ahmo</p>
      <h1 className="mt-3 text-3xl">Esa página no existe</h1>
      <p className="mt-3">«Ahmo» quiere decir «no». La dirección está mal escrita o la página cambió de lugar.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn">Ir al inicio</Link>
        <Link href="/curso" className="btn btn-plain">Ver el curso</Link>
      </div>
    </div>
  );
}
