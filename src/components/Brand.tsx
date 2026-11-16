import Link from "next/link";

export default function Brand() {
  return (
    <Link href="/" className="brand" aria-label="MOTB-8 home">
      <span className="brand-symbol" aria-hidden="true">
        <span className="brand-core" />
        <span className="brand-signal" />
      </span>
      <span>MOTB-8</span>
    </Link>
  );
}
