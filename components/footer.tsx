import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-neutral-silver py-12 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary">ImpactLab</h3>
            <p className="text-neutral-grey text-sm">
              A modern coworking space designed for professionals, entrepreneurs, and creatives.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-neutral-grey hover:text-primary">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-neutral-grey hover:text-primary">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-neutral-grey hover:text-primary">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-neutral-grey hover:text-primary">
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-neutral-black">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-neutral-grey hover:text-primary text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/rooms" className="text-neutral-grey hover:text-primary text-sm">
                  Rooms
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-grey hover:text-primary text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-neutral-grey hover:text-primary text-sm">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-neutral-black">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-neutral-grey hover:text-primary text-sm">
                  Private Offices
                </Link>
              </li>
              <li>
                <Link href="#" className="text-neutral-grey hover:text-primary text-sm">
                  Meeting Rooms
                </Link>
              </li>
              <li>
                <Link href="#" className="text-neutral-grey hover:text-primary text-sm">
                  Event Spaces
                </Link>
              </li>
              <li>
                <Link href="#" className="text-neutral-grey hover:text-primary text-sm">
                  Virtual Office
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-neutral-black">Contact Us</h4>
            <address className="not-italic text-sm text-neutral-grey">
              <p>123 Innovation Street</p>
              <p>Tech District, City 12345</p>
              <p className="mt-2">Email: info@impactlab.com</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>

        <div className="border-t border-neutral-lightgrey/20 mt-8 pt-8 text-center text-sm text-neutral-grey">
          <p>&copy; {new Date().getFullYear()} ImpactLab. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
