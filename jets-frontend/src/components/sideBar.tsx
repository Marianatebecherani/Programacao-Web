import Link from 'next/link';

const links = [
  { href: '/dashboard', label: 'Início' },
  { href: '/admin/atletas', label: 'Atletas' },
  { href: '/admin/funcionarios', label: 'Funcionários' },
  { href: '/admin/torcedores', label: 'Torcedores' },
  { href: '/admin/eventos', label: 'Eventos' },
  { href: '/admin/financas', label: 'Finanças' },
  { href: '/admin/produtos', label: 'Produtos' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#000073] text-white min-h-screen p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-6">Administração</h2>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="block hover:text-[#FCC201]">
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}