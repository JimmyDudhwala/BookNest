"use client"
import { useLogoutMutation } from "@/store/api"
import { logout, toggleLoginDialog } from "@/store/slice/userSlice"
import type { RootState } from "@/store/store"
import { BookOpen, Heart, ShoppingCart, User, LogOut } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import type React from "react"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import NoData from "../components/NoData"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const layout = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname()
  const user = useSelector((state: RootState) => state.user.user)
  const [logoutMutation] = useLogoutMutation()
  const dispatch = useDispatch()
  const router = useRouter()

  const userPlaceholder = user?.name
    ?.split(" ")
    .map((name: string) => name[0])
    .join("")

  const navigation = [
    {
      title: "My Profile",
      href: "/account/profile",
      icon: User,
      color: "from-pink-500 to-rose-500",
    },
    {
      title: "My Orders",
      href: "/account/orders",
      icon: ShoppingCart,
      color: "from-orange-500 to-amber-500",
    },
    {
      title: "Selling Products",
      href: "/account/selling-products",
      icon: BookOpen,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Wishlist",
      href: "/account/wishlist",
      icon: Heart,
      color: "from-red-500 to-pink-500",
    },
  ]

  const handleLogout = async () => {
    try {
      await logoutMutation({}).unwrap()
      dispatch(logout())
      toast.success("User logout Successfully")
      router.push("/")
    } catch (error) {
      toast.error("Failed to logout")
      console.log(error)
    }
  }

  const handleLoginOpen = () => {
    dispatch(toggleLoginDialog())
  }

  if (!user) {
    return (
      <div className="my-10 max-w-3xl justify-center mx-auto">
        <NoData
          imageUrl="/images/login.jpg"
          message="You need to be logged in to view your account"
          description="Please log in to access your account features"
          onClick={handleLoginOpen}
          buttonText="Login to Continue"
        />
      </div>
    )
  }

  return (
    <div className="grid p-4 w-[90%] mx-auto lg:grid-cols-[370px_1fr] gap-6">
      {/* Sidebar */}
      <div className="hidden border-r rounded-lg p-6 bg-gradient-to-b from-violet-500 to-purple-700 lg:block">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="text-white mb-8">
            <h2 className="text-2xl font-bold mb-6">Your Account</h2>
            <div className="flex items-center gap-3 mb-6">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user?.avatar || "/placeholder.svg?height=48&width=48"} />
                <AvatarFallback className="bg-white text-purple-700 font-semibold">{userPlaceholder}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-lg">{user?.name || "User"}</p>
                <p className="text-purple-200 text-sm">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathName === item.href

              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                                        ${
                                          isActive
                                            ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                                            : "text-purple-100 hover:bg-purple-600/50"
                                        }
                                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.title}</span>
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            variant="outline"
            className="mt-6 bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen">{children}</div>
    </div>
  )
}

export default layout
