'use client';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  BookOpen,
  Camera,
  CreditCard,
  Library,
  Search,
  ShoppingBag,
  Store,
  Tag,
  Truck,
  Wallet,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import NewBooks from './components/NewBooks';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  const bannerImages = [
    '/images/book1.jpg',
    '/images/book2.jpg',
    '/images/book3.jpg',
  ];

  const blogPosts = [
    {
      imageSrc:
        'https://images.unsplash.com/photo-1604866830893-c13cafa515d5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8b25saW5lJTIwc2VsbCUyMGJvb2tzfGVufDB8fDB8fHww',
      title: 'Where and how to sell old books online?',
      description:
        'Get started with selling your used books online and earn money from your old books.',
      icon: <BookOpen className="h-6 w-6 text-primary" />,
    },
    {
      imageSrc:
        'https://media.istockphoto.com/id/910384920/photo/kid-reading-near-locked-door.webp?a=1&b=1&s=612x612&w=0&k=20&c=J3FL4ZVORItw_bkLzlVo4WO-xUy22S7Qqbuq2xusNnc=',
      title: 'What to do with old books?',
      description:
        'Learn about different ways to make use of your old books and get value from them.',
      icon: <Library className="h-6 w-6 text-primary" />,
    },
    {
      imageSrc:
        'https://images.unsplash.com/photo-1492539438225-2666b2a98f93?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fG9sZCUyMCUyMGJvb2tzfGVufDB8fDB8fHww',
      title: 'What is BookKart?',
      description:
        'Discover how BookKart helps you buy and sell used books online easily.',
      icon: <Store className="h-6 w-6 text-primary" />,
    },
  ];

  const sellSteps = [
    {
      step: 'Step 1',
      title: 'Post an ad for selling used books',
      description:
        'Post an ad on BookKart describing your book details to sell your old books online.',
      icon: <Camera className="h-8 w-8 text-primary" />,
    },
    {
      step: 'Step 2',
      title: 'Set the selling price for your books',
      description:
        'Set the price for your books at which you want to sell them.',
      icon: <Tag className="h-8 w-8 text-primary" />,
    },
    {
      step: 'Step 3',
      title: 'Get paid into your UPI/Bank account',
      description:
        'You will get money into your account once you receive an order for your book.',
      icon: <Wallet className="h-8 w-8 text-primary" />,
    },
  ];

  const buySteps = [
    {
      step: 'Step 1',
      title: 'Select the used books you want',
      description:
        'Search from over thousands of used books listed on BookKart.',
      icon: <Search className="h-8 w-8 text-primary" />,
    },
    {
      step: 'Step 2',
      title: 'Place the order by making payment',
      description:
        "Then simply place the order by clicking on the 'Buy Now' button.",
      icon: <CreditCard className="h-8 w-8 text-primary" />,
    },
    {
      step: 'Step 3',
      title: 'Get the books delivered at your doorstep',
      description: 'The books will be delivered to you at your doorstep!',
      icon: <Truck className="h-8 w-8 text-primary" />,
    },
  ];
  const [currentImage, setImage] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setImage((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(timer);
  });
  return (
    <main className="min-h-screen">
      <section className="relative h-[600px] overflow-hidden">
        {bannerImages.map((image, index) => (
          <div
            key={index}
            className={`translate-opacity absolute inset-0 duration-1000 ${currentImage === index ? 'opacity-100' : 'opacity-0'}`}
          >
            <Image
              src={image}
              alt="images"
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
        ))}
        <div className="container relative mx-auto flex h-full flex-col items-center justify-center px-4 text-center text-white">
          <h1 className="md:6xl mb-8 text-4xl font-bold">
            Buy and Sell Old Books Online in India
          </h1>
          <div className="flex flex-col gap-6 sm:flex-row">
            <Button
              size="lg"
              className="group rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white hover:from-blue-700 hover:to-blue-800"
            >
              <div className="item-center flex gap-3">
                <div className="rounded-lg bg-white/20 p-3 transition-colors group-hover:bg-white/30">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <Link href="/books">
                  <div className="text-left">
                    <div className="text-sm opacity-90">Start Shopping</div>
                    <div className="font-semibold">Buy used Books</div>
                  </div>
                </Link>
              </div>
            </Button>
            <Button
              size="lg"
              className="group rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 px-8 py-6 text-black hover:from-yellow-600 hover:to-yellow-700"
            >
              <div className="item-center flex gap-3">
                <div className="rounded-lg bg-black/20 p-3 transition-colors group-hover:bg-black/30">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <Link href="/book-sell">
                  <div className="text-left">
                    <div className="text-sm opacity-90">Start Selling</div>
                    <div className="font-semibold">Sell Old Books</div>
                  </div>
                </Link>
              </div>
            </Button>
          </div>
        </div>
      </section>
      <NewBooks />
      <Button
        size="lg"
        className="mx-auto mb-10 mt-10 flex rounded-xl bg-yellow-500 px-8 py-6"
      >
        <Link href="/book-sell">
          <div className="text-sm">Explore All Books</div>
        </Link>
      </Button>

      {/* How to sell Section  */}
      <section className="bg-amber-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-4 text-center">
            <h2 className="mb-4 text-3xl font-bold">
             How to SELL your old books online on BookKart?
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
             Earning money by selling your old books is just 3 steps away from you :)
            </p>
          </div>
          <div className="relative grid gap-8 md:grid-cols-3 mt-10">
            {sellSteps.map((step, index) => (
              <div key={index} className="relative flex h-full flex-col">
                <div className="flex flex-grow flex-col rounded-xl bg-white p-8 text-center shadow-lg">
                  <div className="absolute left-14 top-2 -translate-x-1/2 rounded-full bg-yellow-400 px-4 py-1 text-sm font-medium text-gray-900">
                    {step.step}
                  </div>
                  <div className="mx-auto flex h-16 w-16 m-2  items-center justify-center rounded-full ">
                    {step.icon}
                  </div>
                  <h3 className="mb-2 font-semibold">{step.title}</h3>
                  <p className="flex-grow text-sm text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to buy Section */}
       <section className="bg-gradient-b from-gray-50 to-white-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-4 text-center">
            <h2 className="mb-4 text-3xl font-bold">
              How to BUY second hand books online on BookKart?
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
             Saving some good amount of money by buying used books is just 3 steps away from you :)
            </p>
          </div>
          <div className="relative grid gap-8 md:grid-cols-3 mt-10">
            {buySteps.map((step, index) => (
              <div key={index} className="relative flex h-full flex-col">
                <div className="flex flex-grow flex-col rounded-xl bg-yellow-400 p-8 text-center shadow-lg">
                  <div className="absolute left-14 top-2  -translate-x-1/2 rounded-full bg-white px-4 py-1 text-sm font-medium text-gray-900">
                    {step.step}
                  </div>
                  <div className="mx-auto flex h-16 w-16 m-2 items-center justify-center rounded-full ">
                    {step.icon}
                  </div>
                  <h3 className="mb-2 font-semibold">{step.title}</h3>
                  <p className="flex-grow text-sm text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Blog Section */}
      <section className='py-16 bg-[rgb(221,234,254)]'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-12'>Read from our <span className='text-primary'>Blog</span></h2>
      
         <div className='grid md:grid-cols-3 gap-8'>
          {blogPosts.map((post, index)=>(
            <Card
            key={index}
            className="h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-lg" >
              <CardContent className='p-0 flex flex-col h-full'>
                <div className='relative h-48 overflow-hidden'>
                  <Image 
                  src={post.imageSrc}
                  alt={post.title}
                  layout="fill"
                 objectFit='cover'
                 className='transition-transform duration-300 hover:scale-105'/>
                </div>
                <div className='p-6 flex flex-col flex-grow'>
                  <h3 className='text-xl font-semibold mb-2 flex item-center gap-2'>
                    <div className='bg-primary-100 p-2 rounded-full'>
                      {post.icon}
                    </div>
                    <span className='flex-grow'>{post.title}</span>
                  </h3>
                  <p className='text-gray-600 text-sm flex-grow'>{post.description}</p>
                  <Button variant='link' className='mt-4 p-0 flex items-center text-primary'>Read More <ArrowRight className='w-4 h-4' /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
          </div>  
        </div> 
      </section>

    </main>
  );
}
