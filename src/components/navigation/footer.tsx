import React from 'react'
import Icons from '../global/icons'
import { Heart} from 'lucide-react'
import Link from "next/link";

const footer = () => {
  return (
    <footer className='flex flex-col items-center justify-center border-t border-border pt-16 pb-8 px-6 lg:px-8 w-full max-w-6xl mx-auto lg:pt-10 mt-10'>
        <div className="grid grid-cols-1 xl:grid-cols-3 xl:gap-8 w-full mt-10">
            <div className="flex flex-col items-start justify-start md:max-w-[200px] mb-10">
                <div className="flex items-start relative">
                    <div className="hidden lg:block absolute -top-1/3 -right-1/4 bg-orange-800 w-32 h-32 rounded-full -z-10 blur-[14rem]"></div>
                    <div className="hidden lg:block absolute bottom-0 -right-1/4 bg-orange-800 w-32 h-32 rounded-full -z-10 blur-[14rem]"></div>
                    <Icons.logo className='w-7 h-7' />
                </div>
                <p className="text-muted-foreground mt-4 text-sm text-start">
                    Ve todo lo que necesitas en tiempo real.
                </p>
                <span className="mt-4 text-neutral-200 text-sm flex items-center">
                    TI DIGITAL FAMILY
                    <Heart className='w-3.5 h-3.5 ml-1 fill-orange-500 text-orange-500' />
                </span>
            </div>
            <div className="grid grid-cols-2 gap-8 xl:col-span-2 mt-16 xl:mt-0 ">
                <div className="md:grid md:grid-cols-2 md:gap-8">
                    <div className="">
                        <h3 className="text-base font-medium text-white">
                            Recursos
                        </h3>
                        <ul className="mt-4 text-sm text-muted-foreground">
                            <li className="mt-2">
                                <Link href="#" className='hover:text-foreground transition-all duration-300 '>
                                    Trello
                                </Link>
                            </li>
                            <li className="mt-2">
                                <Link href="#" className='hover:text-foreground transition-all duration-300 '>
                                    Google Workspace
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="">
                        <h3 className="text-base font-medium text-white">
                            Soporte
                        </h3>
                        <ul className="mt-4 text-sm text-muted-foreground">
                            <li className="mt-2">
                                <Link href="#" className='hover:text-foreground transition-all duration-300 '>
                                    TI
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div className="mt-8 border-t border-border/70 pt-4 md:pt-8 md:flex md:items-center md:justify-between w-full">
            <p className="text-sm text-muted-foreground mt-8 md:mt-0">
                &copy; {new Date().getFullYear()} Digital Family todos los derechos reservados.
            </p>
        </div>
    </footer>
  )
}

export default footer