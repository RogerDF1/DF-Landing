import Link from "next/link"
import React from 'react'
import Icons from "../global/icons"


const Navbar = () => {
  const urls = [
    {
      name: 'Inicio',
      link: '/'
    },
    {
      name: 'Trello',
      link: '#trello'
    },
    {
      name: 'GW',
      link: '/google-workspace'
    }
  ]

  const user = false
  return (
    <header className='px-4 h-14 sticky top-0 inset-x-0 w-full bg-background/40 backdrop-blur-lg border-b border-border z-50'>
        <div className="flex items-center justify-between h-full mx-auto md:max-w-screen-xl">
            <div className="flex items-start">
                <Link href='/' className="flex items-center gap-3">
                  <Icons.logo className="w-8 h-8 "/>

                </Link>
            </div>
            <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
              <ul className="flex items-center justify-center gap-8">
              {urls.map(url => (
                <li key={url.name} className="hover:text-foreground/80 text-sm">
                  <Link href={url.link}>
                    {url.name}
                  </Link>
                </li>
              ))}
              </ul>
            </nav>
            <div className="flex items-center gap-4">
              {user ? (
                "user button"
              ) : (
                <>
                  <Link href="/ingresar" >
                    <button className="relative inline-flex h-10 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                        Ingresar
                      </span>
                    </button>
                  </Link>
                </>
              )
              }
            </div>
        </div>
    </header>
  )
}

export default Navbar