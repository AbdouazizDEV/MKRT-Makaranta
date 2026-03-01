/**
 * Composant Footer
 */

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#0D1B2A] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-display font-bold text-[#F4A823] mb-4">
              LUMINA
            </h3>
            <p className="text-gray-300">
              Éclairer les esprits, bâtir l'avenir.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Liens rapides</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/activites" className="hover:text-[#F4A823] transition-colors">
                  Activités
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#F4A823] transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#F4A823] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-gray-300">
              Email: contact@lumina.org
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} LUMINA. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
