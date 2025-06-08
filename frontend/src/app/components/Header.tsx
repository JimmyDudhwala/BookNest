'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  BookLock,
  ChevronRight,
  FileTerminal,
  Heart,
  HelpCircle,
  Lock,
  LogOut,
  Menu,
  Package2,
  Search,
  ShoppingCart,
  User,
  User2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { logout, toggleLoginDialog } from '@/store/slice/userSlice';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import AuthPage from './AuthPage';
import { useGetCartQuery, useLogoutMutation } from '@/store/api';
import toast from 'react-hot-toast';
import { setCart } from '@/store/slice/cartSlice';


const Header = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const isLoginOpen = useSelector(
    (state: RootState) => state.user.isLoginDialogOpen
  );
  const [isDropDownOpen, setIsDropdownOpen] = useState(false);
  const [logoutMutation] = useLogoutMutation()

    const user = useSelector((state: RootState) => state.user.user)

    const cartItemCount = useSelector((state:RootState)=>state.cart.items.length)


  const userPlaceholder = user?.name?.split(" ").map((name:string) => name[0]).join();

  const {data:cartData} = useGetCartQuery(user?._id, {skip:!user})

  const [searchTerms, setSearchTerms] = useState("")

  const  handleSearch = () => {
    router.push(`/books?search=${encodeURIComponent(searchTerms)}`)
  }

  const handleLoginClick = () => {
    dispatch(toggleLoginDialog());
    setIsDropdownOpen(false);

    // setIsLoginOpen(true);
  };

  useEffect(()=>{
    if(cartData?.success && cartData?.data){
      dispatch(setCart(cartData.data))
    }
  },[cartData, dispatch])

  const handleProtectionNavigation = (href: string) => {
    if (user) {
      router.push(href);
      setIsDropdownOpen(false);
    } else {
      dispatch(toggleLoginDialog());
      setIsDropdownOpen(false);
    }
  };
  const handleLogout = async () => {
    try{
      await logoutMutation({}).unwrap
      dispatch(logout())
      toast.success("user logout Successfully")
      setIsDropdownOpen(false)
    }catch(error){
      toast.error("failed to logout" + error)
    }
  };

  const menuItems = [
    ...(user && user
      ? [
          {
            href: '/account/profile',
            content: (
              <div className="item-center flex space-x-4 border-b p-2">
                <Avatar className="-ml-2 h-12 w-12 rounded-full">
                  {user?.profilePicture ? (
                    <AvatarImage src={user.profilePicture} alt="User Image" />
                  ) : (
                    <AvatarFallback className='bg-gray-200 p-5 rounded-full'>{userPlaceholder}</AvatarFallback>
                  )}
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-md font-semibold">{user.name}</span>
                  <span className="text-xs text-gray-500">{user.email}</span>
                </div>
              </div>
            ),
          },
        ]
      : [
          {
            icon: <Lock className="h-5 w-5" />,
            label: 'Login/Sign Up',
            onclick: handleLoginClick,
          },
        ]),
    {
      icon: <User className="h-5 w-5" />,
      label: 'My Profile',
      onclick: () => handleProtectionNavigation('/account/profile'),
    },
    {
      icon: <Package2 className="h-5 w-5" />,
      label: 'My orders',
      onclick: () =>  handleProtectionNavigation('/account/orders'),
    },
    {
      icon: <Lock className="h-5 w-5" />,
      label: 'My selling Orders',
      onclick:  () => handleProtectionNavigation('/account/selling-products'),
    },
    {
      icon: <ShoppingCart className="h-5 w-5" />,
      label: 'Cart',
      onclick: () =>  handleProtectionNavigation('/checkout/cart'),
    },
    {
      icon: <Heart className="h-5 w-5" />,
      label: 'My WishList',
      onclick: () =>  handleProtectionNavigation('/account/wishlist'),
    },
    {
      icon: <User2 className="h-5 w-5" />,
      label: 'About Us',
      href: '/about-us',
    },
    {
      icon: <FileTerminal className="h-5 w-5" />,
      label: 'Terms & Used',
      href: '/terms-of-use',
    },
    {
      icon: <BookLock className="h-5 w-5" />,
      label: 'Privacy Policy',
      href: '/privacy-policy',
    },
    {
      icon: <HelpCircle className="h-5 w-5" />,
      label: 'Help',
      href: '/how-it-works',
    },
    ...(user && user ?  [
      {
        icon: <LogOut className="h-5 w-5" />,
        label: 'Logout',
        onclick: handleLogout,
      },
    ]: []),
  ];

  const MenuItems = ({ classname = '' }) => (
    <div className={classname}>
      {menuItems?.map((item, index) =>
        item?.href ? (
          <Link
            href={item.href}
            key={index}
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-gray-200"
            onClick={() => setIsDropdownOpen(false)}
          >
            {item.icon}
            <span>{item?.label}</span>
            {item.content && <div className="mt-1">{item?.content}</div>}
            <ChevronRight className="ml-auto h-4 w-4" />
          </Link>
        ) : (
          <button
  key={index}
  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-gray-200"
  onClick={() => item.onclick && item.onclick()} // Actually call the function
>
            {item.icon}
            <span>{item?.label}</span>
            {item.content && <div className="mt-1">{item?.content}</div>}
            <ChevronRight className="ml-auto h-4 w-4" />
          </button>
        )
      )}
    </div>
  );
  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="container mx-auto hidden w-[80%] items-center justify-between p-4 lg:flex">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/web-logo.png"
            width={450}
            height={100}
            alt="Logo"
          />
        </Link>
        <div className="item-center flex max-w-xl flex-1 justify-center px-4">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Book Name / Author / Subject / publisher"
              className="w-full pr-10"
              value={searchTerms}
              onChange={(e) => {setSearchTerms(e.target.value)}}
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-0 top-1/2 -translate-y-1/2"
              onClick={handleSearch}
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/book-sell">
            <Button className="bg-yellow-400 text-gray-900 hover:bg-yellow-500">
              Sell Used Book
            </Button>
          </Link>

          <DropdownMenu open={isDropDownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <Avatar className="h-8 w-8 rounded-full">
                  {user?.profilePicture ? (
                    <AvatarImage src={user.profilePicture} alt="User Image" />
                  ) : userPlaceholder ? (
                    <AvatarFallback>{userPlaceholder}</AvatarFallback>
                  ) : (
                    <User className="ml-2 mt-2" />
                  )}
                </Avatar>
                My Account
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-80 p-2">
              <MenuItems />
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/checkout/cart">
            <div className="relative">
              <Button variant="ghost" className="relative">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Cart
              </Button>
              {user && cartItemCount > 0 && (
                <span className="absolute left-5 top-2 -translate-y-1/2 translate-x-1/2 transform rounded-full bg-red-500 px-1 text-xs text-white">
                  {cartItemCount}
                </span>
              )}
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="container mx-auto flex items-center justify-center p-4 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="ghost">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <SheetHeader>
              <SheetTitle className="sr-only"></SheetTitle>
            </SheetHeader>
            <SheetHeader>
              <div className="border-b p-4">
                <Image
                  src="/images/web-logo.png"
                  alt="logo"
                  width={150}
                  height={40}
                  className="h-10 w-auto"
                />
              </div>
              <MenuItems classname="py-2" />
            </SheetHeader>
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center">
          <Image
            src="/images/web-logo.png"
            width={450}
            height={100}
            alt="Logo"
            className="h-6 w-20 md:h-10 md:w-auto"
          />
        </Link>
        <div className="item-center flex max-w-xl flex-1 justify-center px-4">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Book Name / Author / Subject / publisher"
              className="w-full pr-10"
              value=""
              onChange={() => {}}
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-0 top-1/2 -translate-y-1/2"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <Link href="/checkout/cart">
          <div className="relative">
            <Button variant="ghost" className="relative">
              <ShoppingCart className="mr-2 h-5 w-5" />
            </Button>
            {user && cartItemCount > 0 &&(
              <span className="absolute left-5 top-2 -translate-y-1/2 translate-x-1/2 transform rounded-full bg-red-500 px-1 text-xs text-white">
                {cartItemCount}
              </span>
            )}
          </div>
        </Link>
      </div>
      <AuthPage isLoginOpen={isLoginOpen} setIsLoginOpen={handleLoginClick}/>
    </header>
  );
};

export default Header;
