'use client'    
import { headerLinks } from '../constant'
import Link from 'next/link'
import { usePathname } from 'next/navigation';

function NavItems() {
  const pathname = usePathname();
  return (
    <div className=' flex items-center gap-5 max-lg:items-start  max-lg:flex-col '>
      {headerLinks.map((link) => {
            const isActive = pathname === link.route;
            
            return (
              <h2
                key={link.route}
                className={`${
                  isActive && 'text-pink-600 font-semibold border-b-2 border-pink-600'  
                } flex-center p-medium-16 whitespace-nowrap`}
              >
                <Link href={link.route}>{link.label}</Link>
              </h2>
            )
          })}
    </div>
  )
}

export default NavItems