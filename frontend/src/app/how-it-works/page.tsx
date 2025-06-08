"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Mail,
  Phone,
  BookOpen,
  ShoppingCart,
  CreditCard,
  Truck,
  HelpCircle,
  User,
  Settings,
} from "lucide-react"

export default function Page() {
  const [searchQuery] = useState("")
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const helpCategories = [
    {
      title: "Getting Started",
      icon: BookOpen,
      color: "bg-blue-100 text-blue-600",
      description: "Learn the basics of using BookKart",
    },
    {
      title: "Buying Books",
      icon: ShoppingCart,
      color: "bg-green-100 text-green-600",
      description: "How to find and purchase books",
    },
    {
      title: "Selling Books",
      icon: Settings,
      color: "bg-purple-100 text-purple-600",
      description: "List and sale your books",
    },
    {
      title: "Payments",
      icon: CreditCard,
      color: "bg-yellow-100 text-yellow-600",
      description: "Payment methods and billing",
    },
    {
      title: "Shipping",
      icon: Truck,
      color: "bg-red-100 text-red-600",
      description: "Delivery and shipping information",
    },
    {
      title: "Account",
      icon: User,
      color: "bg-indigo-100 text-indigo-600",
      description: "Manage your account settings",
    },
  ]

  const faqs = [
    {
      category: "Getting Started",
      question: "How do I create an account on BookKart?",
      answer:
        "To create an account, click the 'Sign Up' button on the top right of the homepage. Fill in your details including name, email, and password. You'll receive a verification email to activate your account.",
    },
    {
      category: "Buying Books",
      question: "How do I search for books?",
      answer:
        "Use the search bar at the top of the page to enter book titles, authors, or keywords. You can also browse by categories or use filters to narrow down your search results.",
    },
    {
      category: "Buying Books",
      question: "How do I add books to my cart?",
      answer:
        "Click on any book to view its details, then click the 'Add to Cart' button. You can also add books to your wishlist for later purchase.",
    },
    {
      category: "Selling Books",
      question: "How do I list a book for sale?",
      answer:
        "Go to your account dashboard and click 'Sale a Book'. Fill in the book details including title, author, condition, price, and upload photos. Your listing will be reviewed and published within 24 hours.",
    },
    {
      category: "Selling Books",
      question: "What condition should my books be in?",
      answer:
        "We accept books in Good, Very Good, and Like New conditions. Books should have all pages intact, minimal highlighting, and a readable spine. Damaged books may be rejected.",
    },
    {
      category: "Payments",
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, debit cards, UPI payments, net banking, and digital wallets. All transactions are secured with SSL encryption.",
    },
    {
      category: "Payments",
      question: "When will I receive payment for my sold books?",
      answer:
        "Payments are processed within 2-3 business days after the buyer confirms receipt of the book. The amount will be credited to your registered bank account or wallet.",
    },
    {
      category: "Shipping",
      question: "How long does shipping take?",
      answer:
        "Standard shipping takes 3-7 business days. Express shipping (available in select cities) takes 1-2 business days. You'll receive tracking information once your order ships.",
    },
    {
      category: "Shipping",
      question: "Do you offer free shipping?",
      answer:
        "Yes! We offer free shipping on orders above ₹299. For orders below this amount, shipping charges of ₹49 apply.",
    },
    {
      category: "Account",
      question: "How do I reset my password?",
      answer:
        "Click 'Forgot Password' on the login page, enter your email address, and we'll send you a password reset link. Follow the instructions in the email to create a new password.",
    },
    {
      category: "Account",
      question: "How do I update my profile information?",
      answer:
        "Go to your account dashboard and click on 'Profile'. You can update your personal information, contact details, and addresses from there.",
    },
    {
      category: "General",
      question: "Is my personal information secure?",
      answer:
        "Yes, we take data security seriously. All personal information is encrypted and stored securely. We never share your data with third parties without your consent.",
    },
  ]

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    // Reset form
    setContactForm({ name: "", email: "", subject: "", message: "" })
    alert("Thank you for your message! We'll get back to you soon.")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <HelpCircle className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">How can we help you?</h1>
          <p className="text-xl text-blue-100 mb-8">
            Find answers to your questions or get in touch with our support team
          </p>

          {/* Search Bar */}
          {/* <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg bg-white text-gray-900 border-0 rounded-lg"
            />
          </div> */}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Help Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Browse Help Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCategories.map((category, index) => {
              const Icon = category.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${category.color}`}>
                        <Icon className="w-8 h-8" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.title}</h3>
                    <p className="text-gray-600">{category.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-4xl mx-auto space-y-4">
            {filteredFaqs.map((faq, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm text-blue-600 font-medium">{faq.category}</span>
                      <CardTitle className="text-lg text-gray-900 mt-1">{faq.question}</CardTitle>
                    </div>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </CardHeader>
                {expandedFaq === index && (
                  <CardContent className="pt-0">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Get in Touch</h2>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Live Chat</h3>
                      <p className="text-gray-600">Chat with our support team</p>
                      <Button className="mt-2 bg-blue-600 hover:bg-blue-700">Start Chat</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Email Support</h3>
                      <p className="text-gray-600">jimmydudhwala25@gmail.com</p>
                      <p className="text-sm text-gray-500">Response within 24 hours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Phone Support</h3>
                      <p className="text-gray-600">+91 9904181104</p>
                      <p className="text-sm text-gray-500">Mon-Fri, 9 AM - 6 PM IST</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Send us a Message</h2>
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      type="text"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      required
                      rows={5}
                      className="mt-1"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
