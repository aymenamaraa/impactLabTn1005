import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Calendar, Clock, Coffee, Cpu, Headphones, Lightbulb, MapPin, Printer, Wifi } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary to-primary-darker py-20 md:py-28">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
            <div className="text-white space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Your Workspace, <span className="text-secondary">Your Community</span>
              </h1>
              <p className="text-lg md:text-xl opacity-90">
                A modern coworking space designed for professionals, entrepreneurs, and creatives.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-secondary text-neutral-black hover:bg-secondary/90">
                  <Link href="/rooms">Explore Spaces</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block relative h-[400px]">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Modern coworking space"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-neutral-silver">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-neutral-black mb-4">Why Choose ImpactLab?</h2>
              <p className="text-neutral-grey max-w-2xl mx-auto">
                We provide everything you need to work productively and build meaningful connections.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Wifi className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">High-Speed Internet</h3>
                <p className="text-neutral-grey">
                  Reliable, high-speed fiber internet to keep you connected and productive.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Coffee className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Complimentary Refreshments</h3>
                <p className="text-neutral-grey">Enjoy free coffee, tea, and filtered water throughout your workday.</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Flexible Booking</h3>
                <p className="text-neutral-grey">
                  Book rooms by the hour, day, or month with our easy-to-use reservation system.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Spaces Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-neutral-black mb-4">Our Spaces</h2>
              <p className="text-neutral-grey max-w-2xl mx-auto">
                Discover the perfect workspace for your needs, from private offices to collaborative areas.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="rounded-lg overflow-hidden shadow-sm border">
                <div className="relative h-48">
                  <Image
                    src="/placeholder.svg?height=200&width=400"
                    alt="Private Office"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Private Offices</h3>
                  <p className="text-neutral-grey mb-4">Dedicated spaces for teams of 1-10 people with 24/7 access.</p>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/rooms">View Details</Link>
                  </Button>
                </div>
              </div>

              <div className="rounded-lg overflow-hidden shadow-sm border">
                <div className="relative h-48">
                  <Image
                    src="/placeholder.svg?height=200&width=400"
                    alt="Meeting Rooms"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Meeting Rooms</h3>
                  <p className="text-neutral-grey mb-4">
                    Professional spaces for client meetings, interviews, and team sessions.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/rooms">View Details</Link>
                  </Button>
                </div>
              </div>

              <div className="rounded-lg overflow-hidden shadow-sm border">
                <div className="relative h-48">
                  <Image src="/placeholder.svg?height=200&width=400" alt="Event Spaces" fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Event Spaces</h3>
                  <p className="text-neutral-grey mb-4">
                    Versatile areas for workshops, presentations, and networking events.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/rooms">View Details</Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="text-center mt-10">
              <Button asChild size="lg" className="bg-primary hover:bg-primary-dark">
                <Link href="/rooms">View All Spaces</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Amenities Section */}
        <section className="py-16 bg-neutral-silver">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-neutral-black mb-4">Amenities</h2>
              <p className="text-neutral-grey max-w-2xl mx-auto">
                Everything you need for a productive and comfortable workday.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex flex-col items-center text-center p-4">
                <Wifi className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-medium">High-Speed WiFi</h3>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <Printer className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-medium">Printing Services</h3>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <Coffee className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-medium">Coffee & Tea</h3>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <Clock className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-medium">24/7 Access</h3>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <Headphones className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-medium">Phone Booths</h3>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <MapPin className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-medium">Central Location</h3>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <Cpu className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-medium">Tech Support</h3>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <Lightbulb className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-medium">Community Events</h3>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to join our community?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              Experience the perfect blend of productivity, flexibility, and community at ImpactLab.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="bg-secondary text-neutral-black hover:bg-secondary/90">
                <Link href="/rooms">Book a Space</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link href="/contact">Schedule a Tour</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
