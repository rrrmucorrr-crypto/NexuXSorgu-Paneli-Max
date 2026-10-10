import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#050609] p-4 text-center text-[#F0F2F6]">
      <div className="inline-flex items-center gap-2 rounded-full border border-[#C8103D]/40 bg-[#C8103D]/10 px-3 py-1 font-mono text-xs text-[#F0204F]">
        404 𖤟 SAYFA BULUNAMADI
      </div>
      <h1 className="mt-4 font-mono text-2xl font-bold tracking-wider text-white sm:text-3xl">
        MODÜL VEYA SAYFA BULUNAMADI
      </h1>
      <p className="mt-2 max-w-md text-sm text-[#A0A8B7]">
        Aradığınız rota sistem indeksinde yer almıyor veya erişim izniniz kısıtlanmış olabilir.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#C8103D] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#F0204F]"
      >
        Ana Panele Dön
      </Link>
    </div>
  );
}
