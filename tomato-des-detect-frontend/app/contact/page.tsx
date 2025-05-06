import Link from "next/link"
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Navbar from "@/components/navbar"

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      
      <main className="flex-1">
        {/* Hero Section */}
        <Navbar/>
        <section className="py-5 bg-gradient-to-b from-gray-100 to-gray-200 text-black">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-4 text-gray-800">Get In Touch</h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Feel free to reach out if you have any questions, collaborations, or just to say hello!
            </p>
          </div>
        </section>

        {/* Contact Form and Info */}
        <section className="py-7">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Form */}
              <Card className="border-none shadow-lg bg-white">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Me a Message</h2>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-gray-700">
                          Your Name
                        </label>
                        <Input
                          id="name"
                          placeholder="Name"
                          className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">
                          Your Email
                        </label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@example.com"
                          className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium text-gray-700">
                        Subject
                      </label>
                      <Input
                        id="subject"
                        placeholder="Subject of your message"
                        className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium text-gray-700">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        placeholder="Your message here..."
                        className="min-h-[150px] border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-red-500 hover:bg-red-600 text-white transition-colors"
                    >
                      <Send className="h-4 w-4 mr-2" /> Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
                  <p className="text-gray-700 mb-6">
                    I&apos;m currently available for freelance work, full-time positions, and interesting project
                    collaborations. Feel free to reach out using any of the methods below.
                  </p>
                </div>

                <div className="space-y-4">
                  <Card className="border-none shadow-lg hover:scale-[1.02] transition-transform duration-300 bg-white">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="bg-red-500 p-3 rounded-full">
                        <Mail className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <a
                          href="mailto:contact@tomatohealth.com"
                          className="font-medium hover:text-teal-500 transition-colors"
                        >
                          contact@tomatohealth.com
                        </a>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-lg hover:scale-[1.02] transition-transform duration-300 bg-white">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="bg-red-500 p-3 rounded-full">
                        <Phone className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <a href="tel:+250789897235" className="font-medium hover:text-teal-500 transition-colors">
                          +250 789897235
                        </a>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-lg hover:scale-[1.02] transition-transform duration-300 bg-white">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="bg-red-500 p-3 rounded-full">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">Rwanda, Kigali, Nyarugenge</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Connect With Me</h3>
                  <div className="flex space-x-4">
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-teal-500 p-3 rounded-full text-white hover:bg-teal-600 transition-colors"
                    >
                      <Github className="h-5 w-5" />
                      <span className="sr-only">GitHub</span>
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-teal-500 p-3 rounded-full text-white hover:bg-teal-600 transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                      <span className="sr-only">LinkedIn</span>
                    </a>
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-teal-500 p-3 rounded-full text-white hover:bg-teal-600 transition-colors"
                    >
                      <Twitter className="h-5 w-5" />
                      <span className="sr-only">Twitter</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      
        {/* CTA Section */}
        <section className="py-10 bg-gray-800 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Let&apos;s Work Together</h2>
            <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
              Have a project in mind? Contact us about your tomato monitoring needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                className="bg-transparent text-white border border-gray-300 hover:bg-white hover:text-gray-800 font-semibold transition-colors"
                asChild
              >
                <Link href="/">View Our Services</Link>
              </Button>
              <Button
                className="bg-red-500 text-white hover:bg-red-600 transition-colors"
                asChild
              >
                <Link href="#" id="get-started">Get Started</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}