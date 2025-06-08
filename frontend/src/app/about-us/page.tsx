import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Users, Shield, Layers, Edit, Lock, Handshake } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function page() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About Us</h1>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto">
          Welcome to BookKart, your ultimate destination for buying and selling used books online.
        </p>
      </div>

      {/* Main Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {/* Our Mission */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                At BookKart, we aim to make reading accessible to everyone by providing a platform where people can buy
                and sale their old books easily.
              </p>
            </CardContent>
          </Card>

          {/* Our Community */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Our Community</h3>
              <p className="text-gray-600 leading-relaxed">
                We believe in building a community of book lovers who can share their passion for reading while
                promoting eco-friendly practices.
              </p>
            </CardContent>
          </Card>

          {/* Our Commitment */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Our Commitment</h3>
              <p className="text-gray-600 leading-relaxed">
                We are committed to providing a secure platform for transactions and ensuring customer satisfaction at
                every step.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Why Choose BookKart Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-16">Why Choose BookKart?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {/* Wide Selection */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Layers className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-3">Wide Selection</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Thousands of used books available at your fingertips.
              </p>
            </CardContent>
          </Card>

          {/* Easy Listing */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Edit className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-3">Easy Listing</h4>
              <p className="text-gray-600 text-sm leading-relaxed">Sale your old books in just a few clicks.</p>
            </CardContent>
          </Card>

          {/* Secure Transactions */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Lock className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-3">Secure Transactions</h4>
              <p className="text-gray-600 text-sm leading-relaxed">Safe payment methods ensure your peace of mind.</p>
            </CardContent>
          </Card>

          {/* Community Driven */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Handshake className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-3">Community Driven</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Join a community of readers and sellers who share your passion.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Visual Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {/* Library Illustration */}
          <Card className="bg-white shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <div className="relative h-64 lg:h-80">
                <Image
                  src="https://media.istockphoto.com/id/910384920/photo/kid-reading-near-locked-door.webp?a=1&b=1&s=612x612&w=0&k=20&c=J3FL4ZVORItw_bkLzlVo4WO-xUy22S7Qqbuq2xusNnc="
                  alt="Children reading in library"
                  fill
                  className="object-cover"
                />
              </div>
            </CardContent>
          </Card>

          {/* Books Photo */}
          <Card className="bg-white shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <div className="relative h-64 lg:h-80">
                <Image
                  src='https://images.unsplash.com/photo-1492539438225-2666b2a98f93?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fG9sZCUyMCUyMGJvb2tzfGVufDB8fDB8fHww'
                  alt="Open book on stack of books"
                  fill
                  className="object-cover"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action Section */}
        <div className="text-center py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Join Us Today!</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Sign up now to start buying and selling your favorite books on BookKart!
          </p>
          <Link href="/register">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-lg">
              Get Started
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer Spacer */}
      <div className="h-16 bg-gray-900"></div>
    </div>
  )
}
