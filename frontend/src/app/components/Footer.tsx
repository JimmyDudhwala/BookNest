import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Youtube, Twitter, Shield, Clock, Headphones, CreditCard } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-12 md:grid-cols-4">
          {/** About Us */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">ABOUT US</h3>
            <ul className="space-y-2">
              <li><Link className="hover:text-white" href="/about-us">About Us</Link></li>
              <li><Link className="hover:text-white" href="/contact">Contact Us</Link></li>
            </ul>
          </div>
          
          {/** Useful Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">USEFUL LINKS</h3>
            <ul className="space-y-2">
              <li><Link className="hover:text-white" href="/how-it-works">How it works?</Link></li>
              <li><Link className="hover:text-white" href="/teleport">Blogs</Link></li>
            </ul>
          </div>
          
          {/** Policies */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">POLICIES</h3>
            <ul className="space-y-2">
              <li><Link className="hover:text-white" href="/terms-of-use">Terms Of Use</Link></li>
              <li><Link className="hover:text-white" href="/privacy-policy">Privacy Policy</Link></li>
            </ul>
          </div>
          
          {/** Social Media */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">STAY CONNECTED</h3>
            <div className="mb-4 flex space-x-4">
              {[Facebook, Instagram, Youtube, Twitter].map((Icon, idx) => (
                <Link key={idx} className="hover:text-white" href="#">
                  <Icon className="h-6 w-6" />
                </Link>
              ))}
            </div>
            <p className="text-sm">
              BookKart is a free platform where you can buy second-hand books at very cheap prices. Buy used books online like college books, school books, and much more near you.
            </p>
          </div>
        </div>
        
        {/** Features */}
        <section className="py-6">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-3">
              {[{ icon: Shield, title: "Secure Payment", desc: "100% Secure Online Transaction" },
                { icon: Clock, title: "BookKart Trust", desc: "Money transferred safely after confirmation" },
                { icon: Headphones, title: "Customer Support", desc: "Friendly customer support" }
              ].map(({ icon: Icon, title, desc }, idx) => (
                <div key={idx} className="flex items-center gap-4 rounded-xl p-6 shadow-sm">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="text-sm text-gray-600">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/** Footer Bottom */}
        <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center">
          <p className="text-sm text-gray-400">© 2024 BookKart. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            {["Visa", "Rupay", "Paytm", "UPI"].map((payment, idx) => (
              <CreditCard key={idx} className="h-6 w-6 text-gray-400"  />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
